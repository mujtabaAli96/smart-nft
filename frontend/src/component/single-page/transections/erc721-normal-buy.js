import { parseEther } from "ethers/lib/utils";
import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useNft from "../../../../../common/hook/useNft.hook";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import useActivity from "../../../../../common/hook/useActivity.hook";

import { catchWalletError } from "./error";
import { lazy_mint_buy } from "./lazy-mint";

export const erc_721_normal_buy = async (nftInfo, web3Provider) => {
  //catch wallet error
  await catchWalletError(nftInfo, web3Provider);

  const { proxy, Erc721 } = nftInfo.selectedContract.contract;
  const erc721Contract = useContractGenaretor(
    Erc721.address,
    "Erc721",
    web3Provider.wallet
  );
  const proxyContract = useContractGenaretor(
    proxy.address,
    "Market",
    web3Provider.wallet
  );
  const { updateNftMetaByPostId } = useNft();
  const { storeTxHashLocally } = useTxHash();
  const { createNewActivity } = useActivity();

  //IF ITS A FREE MINTING NFT THEN CALL LAZY_MINT FUNCTION
  //////////////////////////////////////////////////////////////
  let tx;
  if (nftInfo.isFreeMinting == "true") {
    tx = await lazy_mint_buy({
      proxyContract,
      standardContract: erc721Contract,
      web3Provider,
      parseEther,
      nftInfo,
      price: nftInfo.price,
      standard: "Erc721",
    });
  } else {
    // contract_address, owner_address, erc20Contractaddress
    // token_id, standard, amount
    // is_erc_20

    const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
    //make the transection to transfer token
    tx = await proxyContract.buy(
      [nftInfo.contractAddress, nftInfo.owners[0], ADDRESS_ZERO],
      [nftInfo.tokenId, 721, 1],
      [false],
      { value: parseEther(nftInfo.price) }
    );

    await tx.wait();
  }

  //unlist from sale and update the owner
  await updateNftMetaByPostId(nftInfo.postId, {
    newMeta: {
      isListed: false,
      owners: [web3Provider.account[0].toLowerCase()],
    },
    newDirectMeta: {
      //newDirectMeta will get their owne key on meta field
      isListed: false,
      owners: [web3Provider.account[0].toLowerCase()],
    },
  });

  //SAVE TRANSECTION HASH WITH EVENT NAME
  await storeTxHashLocally(
    {
      eventType: "Buy",
      signer: web3Provider.account[0],
      hash: tx.hash,
      price: nftInfo.price,
    },
    parseInt(nftInfo.postId)
  );

  // SAVE THE ACTIVITY
  await createNewActivity({
    post_id: nftInfo.postId,
    activity_type: "buy",
    price: nftInfo.price,
    addr_from: nftInfo.owners[0].toLowerCase(),
    addr_to: web3Provider.account[0].toLowerCase(),
    chain_id: web3Provider.network.chainId,
    collection_id: nftInfo.collection.id,
    category_id: nftInfo.category.id,
  });

  return tx;
};
