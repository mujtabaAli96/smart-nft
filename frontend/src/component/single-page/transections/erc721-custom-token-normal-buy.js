import { parseEther } from "ethers/lib/utils";
import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useNft from "../../../../../common/hook/useNft.hook";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import useActivity from "../../../../../common/hook/useActivity.hook";
import { errorMessage } from "../../../../../common/component/message/error";
import { SLUG } from "../../../../../common/store";
const { __ } = wp.i18n;

import { catchWalletError } from "./error";

export const erc_721_custom_token_normal_buy = async (
  nftInfo,
  web3Provider
) => {
  const erc20 = nftInfo?.customCoin?.contract;
  //catch wallet error
  await catchWalletError(nftInfo, web3Provider);

  const { proxy } = nftInfo.selectedContract.contract;
  const proxyContract = useContractGenaretor(
    proxy.address,
    "Market",
    web3Provider.wallet
  );
  const erc20Contract = useContractGenaretor(
    erc20.address,
    "Erc20",
    web3Provider.wallet
  );

  const { updateNftMetaByPostId } = useNft();
  const { storeTxHashLocally } = useTxHash();
  const { createNewActivity } = useActivity();

  //check if user has enough token
  const cusTokenOfUser = await erc20Contract.balanceOf(
    web3Provider.account?.[0]
  );
  const priceInBigNumber = parseEther(nftInfo?.price);

  //give error message if user dont have enough balance
  if (priceInBigNumber.gt(cusTokenOfUser)) {
    errorMessage(__("You dont have enough balance!", SLUG));
    throw new Error("You dont have enough balance!");
  }

  //check if market place have enough token access
  const allowance = await erc20Contract.allowance(
    web3Provider.account?.[0],
    proxy.address
  );

  if (priceInBigNumber.gt(allowance)) {
    await erc20Contract.approve(proxy.address, priceInBigNumber.toString());
  }

  // contract_address, owner_address, erc20Contractaddress
  // token_id, standard, amount
  // is_erc_20

  //MAKE THE TRANSECTION TO TRANSFER TOKEN
  const tx = await proxyContract.buy(
    [nftInfo.contractAddress, nftInfo.owners[0], erc20.address],
    [parseInt(nftInfo.tokenId), 721, 1],
    [true]
  );
  await tx.wait();

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
