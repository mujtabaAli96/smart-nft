import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useNft from "../../../../../common/hook/useNft.hook";
import { catchWalletError } from "./error";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import useActivity from "../../../../../common/hook/useActivity.hook";

export const erc_721_transfer_token = async (
  nftInfo,
  web3Provider,
  newOwnerAddress
) => {
  //CATCH WALLET ERROR;
  await catchWalletError(nftInfo, web3Provider);

  const { proxy } = nftInfo.selectedContract.contract;
  const { contractAddress } = nftInfo;
  const proxyContract = useContractGenaretor(
    proxy.address,
    "Market",
    web3Provider.wallet
  );
  const erc721Token = useContractGenaretor(
    contractAddress,
    "Erc721",
    web3Provider.wallet
  );
  const { updateNftMetaByPostId } = useNft();
  const { storeTxHashLocally } = useTxHash();
  const { createNewActivity } = useActivity();

  //IF ITS A FREE MINTING NFT THEN DONT NEED ANY NETWORK TRANSECTION
  //////////////////////////////////////////////////////////////
  let tx = { hash: "0x0000000" };
  if (nftInfo.isFreeMinting != "true") {
    //MAKE THE TRANSECTION TO UNLIST THE TOKEN FROM MARKET
    await proxyContract.unlist_for_sale(contractAddress, nftInfo.tokenId);

    //MAKE THE TRANSECTION TO TRANSFER TOKEN;
    tx = await erc721Token.transferFrom(
      web3Provider.account[0],
      newOwnerAddress,
      parseInt(nftInfo.tokenId)
    );
    await tx.wait();
  }

  //UNLIST FROM SALE AND UPDATE THE OWNER
  await updateNftMetaByPostId(nftInfo.postId, {
    newMeta: {
      isListed: false,
      owners: [newOwnerAddress.toLowerCase()],
    },
    newDirectMeta: {
      //newDirectMeta will get their owne key on meta field
      isListed: false,
      owners: [newOwnerAddress.toLowerCase()],
    },
  });

  //SAVE TRANSECTION HASH WITH EVENT NAME
  await storeTxHashLocally(
    {
      eventType: "Transfer",
      signer: web3Provider.account[0],
      to: newOwnerAddress.toLowerCase(),
      from: web3Provider.account[0],
      hash: tx.hash,
    },
    parseInt(nftInfo.postId)
  );

  // SAVE THE ACTIVITY
  await createNewActivity({
    post_id: nftInfo.postId,
    activity_type: "transfer",
    price: 0,
    addr_from: nftInfo.owners[0].toLowerCase(),
    addr_to: newOwnerAddress.toLowerCase(),
    chain_id: web3Provider.network.chainId,
    collection_id: nftInfo.collection.id,
    category_id: nftInfo.category.id,
  });

  return tx;
};
