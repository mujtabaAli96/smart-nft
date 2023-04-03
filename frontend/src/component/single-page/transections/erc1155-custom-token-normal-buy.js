import { parseEther } from "ethers/lib/utils";
import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import useErc1155Owners from "../../../../../common/hook/useErc1155Owners";
import useActivity from "../../../../../common/hook/useActivity.hook";
import { errorMessage } from "../../../../../common/component/message/error";
import { SLUG } from "../../../../../common/store";
const { __ } = wp.i18n;

import { catchWalletError } from "./error";

export const erc_1155_custom_token_normal_buy = async (
  nftInfo,
  web3Provider,
  token,
  nftOwners
) => {
  const erc20 = nftInfo?.customCoin?.contract;
  //CATCH WALLET ERROR
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

  const { updateErc1155Owners, deleteErc1155Owner } = useErc1155Owners();
  const { storeTxHashLocally } = useTxHash();
  const { createNewActivity } = useActivity();

  //check if user has enough token
  const cusTokenOfUser = await erc20Contract.balanceOf(
    web3Provider.account?.[0]
  );
  const priceInBigNumber = parseEther(token?.price);

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
    [nftInfo.contractAddress, token.address, erc20.address],
    [nftInfo.tokenId, 1155, 1],
    [true]
  );
  await tx.wait();

  //DECREMENT OR DELETE CURRENT OWNER AMOUNT
  const amount = parseInt(token.amount);
  if (amount == 1) {
    //if amount is 1 then owner has no amount left so delete the owner from owners
    await deleteErc1155Owner(nftInfo.postId, token.address);
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
  }

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
