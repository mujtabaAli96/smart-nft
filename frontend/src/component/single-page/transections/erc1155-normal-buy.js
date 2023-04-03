import { parseEther } from "ethers/lib/utils";
import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import useErc1155Owners from "../../../../../common/hook/useErc1155Owners";
import useActivity from "../../../../../common/hook/useActivity.hook";

import { catchWalletError } from "./error";
import { lazy_mint_buy } from "./lazy-mint";
import useNft from "../../../../../common/hook/useNft.hook";

export const erc_1155_normal_buy = async (
  nftInfo,
  web3Provider,
  token,
  nftOwners
) => {
  //CATCH WALLET ERROR
  await catchWalletError(nftInfo, web3Provider);

  const { proxy, Erc1155 } = nftInfo.selectedContract.contract;
  const erc1155Contract = useContractGenaretor(
    Erc1155.address,
    "Erc1155",
    web3Provider.wallet
  );
  const proxyContract = useContractGenaretor(
    proxy.address,
    "Market",
    web3Provider.wallet
  );
  const { updateErc1155Owners, deleteErc1155Owner } = useErc1155Owners();
  const { storeTxHashLocally } = useTxHash();
  const { createNewActivity } = useActivity();
  const { updateNftMetaByPostId } = useNft();

  //IF ITS A FREE MINTING NFT THEN CALL LAZY_MINT FUNCTION
  //////////////////////////////////////////////////////////////
  let tx;
  if (nftInfo.isFreeMinting == "true") {
    tx = await lazy_mint_buy({
      proxyContract,
      standardContract: erc1155Contract,
      web3Provider,
      parseEther,
      nftInfo,
      price: token.price,
      standard: "Erc1155",
    });
  } else {
    // contract_address, owner_address, erc20Contractaddress
    // token_id, standard, amount
    // is_erc_20

    const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
    //MAKE THE TRANSECTION TO TRANSFER TOKEN
    tx = await proxyContract.buy(
      [nftInfo.contractAddress, token.address, ADDRESS_ZERO],
      [nftInfo.tokenId, 1155, 1],
      [false],
      { value: parseEther(token.price) }
    );

    await tx.wait();
  }

  let updatedOwners = { ...nftOwners };
  //DECREMENT OR DELETE CURRENT OWNER AMOUNT
  const amount = parseInt(token.amount);
  if (amount == 1) {
    //if amount is 1 then owner has no amount left so delete the owner from owners
    await deleteErc1155Owner(nftInfo.postId, token.address);
    delete updatedOwners[token.address];
  }
  if (amount > 1) {
    //if amount is gt then 1 then decrement the owner amount
    await updateErc1155Owners(nftInfo.postId, token.address, {
      amount: amount - 1,
    });
  }

  //INCREMENT OR ADD NEW OWNER
  const owner = nftOwners[web3Provider.account[0].toLowerCase()];
  if (owner) {
    //old owner increment the amount
    await updateErc1155Owners(
      nftInfo.postId,
      web3Provider.account[0].toLowerCase(),
      {
        amount: parseInt(owner.amount) + 1,
      }
    );
  } else {
    //new owner save the new owner data
    await updateErc1155Owners(
      nftInfo.postId,
      web3Provider.account[0].toLowerCase(),
      {
        amount: 1,
        price: 0,
        isListed: false,
      }
    );
    updatedOwners[web3Provider.account[0].toLowerCase()] = {
      amount: 1,
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
      eventType: "Buy",
      signer: web3Provider.account[0],
      hash: tx.hash,
      price: token.price,
    },
    parseInt(nftInfo.postId)
  );

  // SAVE THE ACTIVITY
  await createNewActivity({
    post_id: nftInfo.postId,
    activity_type: "buy",
    price: token.price,
    addr_from: token.address.toLowerCase(),
    addr_to: web3Provider.account[0].toLowerCase(),
    chain_id: web3Provider.network.chainId,
    collection_id: nftInfo.collection.id,
    category_id: nftInfo.category.id,
  });

  return tx;
};
