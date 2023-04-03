import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useNft from "../../../../../common/hook/useNft.hook";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import { successMessage } from "../../../../../common/component/message/success";
import { catchWalletError } from "./error";
import { SLUG } from "../../../../../common/store";
const { __ } = wp.i18n;

export const erc_721_remove_from_sale = async (nftInfo, web3Provider) => {
  const { proxy } = nftInfo.selectedContract.contract;
  const proxyContract = useContractGenaretor(
    proxy.address,
    "Market",
    web3Provider.wallet
  );
  const tokenContract = useContractGenaretor(
    nftInfo.contractAddress,
    "Erc721",
    web3Provider.wallet
  );
  const { updateNftMetaByPostId } = useNft();
  const { storeTxHashLocally } = useTxHash();

  //CATCH WALLET ERROR
  await catchWalletError(nftInfo, web3Provider);

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
  await updateNftMetaByPostId(nftInfo.postId, {
    newMeta: { isListed: false },
    //newDirectMeta will get their owne key on meta field
    newDirectMeta: { isListed: false },
  });

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
