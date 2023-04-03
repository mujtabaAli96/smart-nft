import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import { successMessage } from "../../../../../common/component/message/success";
import { catchWalletError } from "./error";
import useErc1155Owners from "../../../../../common/hook/useErc1155Owners";
import { SLUG } from "../../../../../common/store";
const { __ } = wp.i18n;

export const erc_1155_remove_from_sale = async (nftInfo, web3Provider) => {
  //CATCH WALLET ERROR
  await catchWalletError(nftInfo, web3Provider);

  const { proxy } = nftInfo.selectedContract.contract;
  const proxyContract = useContractGenaretor(
    proxy.address,
    "Market",
    web3Provider.wallet
  );
  const { storeTxHashLocally } = useTxHash();
  const { updateErc1155Owners } = useErc1155Owners();

  //IF ITS A FREE MINTING NFT THEN DONT NEED ANY NETWORK TRANSECTION
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  let tx = { hash: "0x0000000" };
  if (nftInfo.isFreeMinting != "true") {
    //MAKE THE TRANSECTION TO REMOVE IT FROM SALE
    tx = await proxyContract.unlist_for_sale(
      nftInfo.contractAddress,
      parseInt(nftInfo.tokenId)
    );

    await tx.wait();
  }

  //UNLIST FROM SALE AND UPDATE THE STATUS
  await updateErc1155Owners(
    nftInfo.postId,
    web3Provider.account[0].toLowerCase(),
    { isListed: false }
  );

  //SAVE TRANSECTION HASH WITH EVENT NAME
  await storeTxHashLocally(
    {
      eventType: __("Unlisted", SLUG),
      signer: web3Provider.account[0],
      hash: tx.hash,
    },
    parseInt(nftInfo.postId)
  );

  successMessage(__("Your NFT is successfully remove from sell", SLUG));
  window.location.reload(true);
};
