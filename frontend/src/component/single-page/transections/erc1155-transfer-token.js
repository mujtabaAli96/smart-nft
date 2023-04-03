import { formatBytes32String } from "ethers/lib/utils";
import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import { catchWalletError } from "./error";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import useErc1155Owners from "../../../../../common/hook/useErc1155Owners";
import useActivity from "../../../../../common/hook/useActivity.hook";
import useNft from "../../../../../common/hook/useNft.hook";

export const erc_1155_transfer_token = async (
  nftInfo,
  web3Provider,
  nftOwners,
  amount,
  token,
  recipientAddress
) => {
  //CATCH WALLET ERROR;
  await catchWalletError(nftInfo, web3Provider);

  const { contractAddress } = nftInfo;
  const erc1155Token = useContractGenaretor(
    contractAddress,
    "Erc1155",
    web3Provider.wallet
  );
  const { storeTxHashLocally } = useTxHash();
  const { updateErc1155Owners, deleteErc1155Owner } = useErc1155Owners();
  const { createNewActivity } = useActivity();
  const { updateNftMetaByPostId } = useNft();

  //CHECK IF OWNER HAVE THE ENOUGH AMOUNT TOKEN TO TRANSFER.
  const tokenAmount = (
    await erc1155Token.balanceOf(
      web3Provider.account[0],
      parseInt(nftInfo.tokenId)
    )
  ).toNumber();

  if (tokenAmount < amount) {
    errorMessage(__("Dont have enough token to transfer.", SLUG));
    throw new Error("Dont have enough token to transfer.");
  }

  //MAKE THE TRANSECTIONS TO TRANSFER TOKEN
  const tx = await erc1155Token.safeTransferFrom(
    token.address,
    recipientAddress,
    parseInt(nftInfo.tokenId),
    amount,
    formatBytes32String("0")
  );
  await tx.wait();

  let updatedOwners = { ...nftOwners };
  //DECREMENT OR DELETE CURRENT OWNER AMOUNT
  if (amount == tokenAmount) {
    //if amount is == tokenAmount then owner has no amount left so delete the owner from owners
    await deleteErc1155Owner(nftInfo.postId, token.address);
    delete updatedOwners[token.address];
  } else {
    //amount is lt then tokenAmount then decrement the owner amount
    await updateErc1155Owners(nftInfo.postId, token.address, {
      amount: tokenAmount - amount,
    });
  }

  //INCREMENT OR ADD NEW OWNER
  const owner = nftOwners[recipientAddress];
  if (owner) {
    //old owner increment the amount
    await updateErc1155Owners(nftInfo.postId, recipientAddress, {
      amount: amount + parseInt(owner.amount),
    });
  } else {
    //new owner save the new owner data
    await updateErc1155Owners(nftInfo.postId, recipientAddress, {
      amount: amount,
      price: 0,
      isListed: false,
    });
    updatedOwners[recipientAddress.toLowerCase()] = {
      amount: amount,
      price: 0,
      isListed: false,
    };
  }

  //SAVE NEW OWNERS METADATA
  const newOwners = Object.keys(updatedOwners).map((cur) => cur.toLowerCase());
  await updateNftMetaByPostId(nftInfo.postId, {
    newMeta: { owners: newOwners },
    //newDirectMeta will get their owne key on meta field
    newDirectMeta: { owners: newOwners },
  });

  //SAVE TRANSECTION HASH WITH EVENT NAME
  await storeTxHashLocally(
    {
      eventType: "Transfer",
      signer: web3Provider.account[0],
      to: recipientAddress,
      from: web3Provider.account[0].toLowerCase(),
      hash: tx.hash,
      amount: amount,
    },
    parseInt(nftInfo.postId)
  );

  // SAVE THE ACTIVITY
  await createNewActivity({
    post_id: nftInfo.postId,
    activity_type: "transfer",
    price: 0,
    addr_from: web3Provider.account[0].toLowerCase(),
    addr_to: recipientAddress.toLowerCase(),
    chain_id: web3Provider.network.chainId,
    collection_id: nftInfo.collection.id,
    category_id: nftInfo.category.id,
  });
};
