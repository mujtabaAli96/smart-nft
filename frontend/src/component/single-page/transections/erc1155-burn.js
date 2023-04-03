import { errorMessage } from "../../../../../common/component/message/error";
import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useNft from "../../../../../common/hook/useNft.hook";
import { SLUG } from "../../../../../common/store";
import { catchWalletError } from "./error";
import useErc1155Owners from "../../../../../common/hook/useErc1155Owners";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
const { __ } = wp.i18n;

export const erc_1155_burn_token = async (
  nftInfo,
  web3Provider,
  nftOwners,
  amount,
  token
) => {
  //CATCH WALLET ERROR;
  await catchWalletError(nftInfo, web3Provider);

  const { contractAddress } = nftInfo;
  const erc1155Token = useContractGenaretor(
    contractAddress,
    "Erc1155",
    web3Provider.wallet
  );
  const { deleteLocalNft, updateNftMetaByPostId } = useNft();
  const { updateErc1155Owners, deleteErc1155Owner } = useErc1155Owners();
  const { storeTxHashLocally } = useTxHash();
  let willRedirect = false;

  //IF ITS A FREE MINTING NFT THEN DONT NEED ANY NETWORK TRANSECTION
  //////////////////////////////////////////////////////////////
  let tokenAmount;
  let tx = { hash: "0x0000000" };
  if (nftInfo.isFreeMinting != "true") {
    //CHECK IF OWNER HAVE THE ENOUGH AMOUNT TOKEN TO BURN.
    tokenAmount = (
      await erc1155Token.balanceOf(
        web3Provider.account[0],
        parseInt(nftInfo.tokenId)
      )
    ).toNumber();

    if (tokenAmount < amount) {
      errorMessage(__("Dont have enough token to burn.", SLUG));
      throw new Error("Dont have enough token to burn.");
    }

    //MAKE THE TRANSECTION TO BURN TOKEN;
    tx = await erc1155Token.burn(
      web3Provider.account[0],
      parseInt(nftInfo.tokenId),
      amount
    );
    await tx.wait();
  } else {
    tokenAmount = parseInt(nftInfo.amount);
    if (tokenAmount < amount) {
      errorMessage(__("Dont have enough token to burn.", SLUG));
      throw new Error("Dont have enough token to burn.");
    }
  }

  let updatedOwners = { ...nftOwners };
  //DECREMENT OR DELETE CURRENT OWNER AMOUNT
  if (amount == tokenAmount) {
    //if amount is == tokenAmount then owner has no amount left so delete the owner from owners
    await deleteErc1155Owner(nftInfo.postId, token.address);

    //delete from nftOwners
    const temp = { ...nftOwners };
    delete temp[token.address.toLowerCase()];
    delete updatedOwners[token.address.toLowerCase()];

    //SAVE NEW OWNERS METADATA
    const newOwners = Object.keys(updatedOwners).map((cur) =>
      cur.toLowerCase()
    );
    await updateNftMetaByPostId(nftInfo.postId, {
      newMeta: { owners: newOwners },
      //newDirectMeta will get their owne key on meta field
      newDirectMeta: { owners: newOwners },
    });

    //check if any other owners left or not
    if (Object.keys(temp).length === 0) {
      //no owner left delete the nft
      //DELETE THE NFT FROM LOCAL DB;
      await deleteLocalNft(nftInfo.postId);
      willRedirect = true;
    }
    //SAVE TRANSECTION HASH WITH EVENT NAME
    await storeTxHashLocally(
      {
        eventType: "Burn Token",
        signer: web3Provider.account[0],
        hash: tx.hash,
        amount: amount,
      },
      parseInt(nftInfo.postId)
    );
    return { tx, willRedirect };
  }

  //amount is lt then tokenAmount then decrement the owner amount
  await updateErc1155Owners(nftInfo.postId, token.address, {
    amount: tokenAmount - amount,
  });

  //also decrement the total amount of token
  await updateNftMetaByPostId(nftInfo.postId, {
    newMeta: {
      amount: parseInt(nftInfo.amount) - amount,
    },
    newDirectMeta: {},
  });

  //SAVE TRANSECTION HASH WITH EVENT NAME
  await storeTxHashLocally(
    {
      eventType: "Burn Token",
      signer: web3Provider.account[0],
      hash: tx.hash,
      amount: amount,
    },
    parseInt(nftInfo.postId)
  );

  return { tx, willRedirect };
};
