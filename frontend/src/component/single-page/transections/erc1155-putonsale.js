import { parseEther } from "ethers/lib/utils";
import { SLUG } from "../../../../../common/store";
import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import { successMessage } from "../../../../../common/component/message/success";
import { catchWalletError } from "./error";
import useErc1155Owners from "../../../../../common/hook/useErc1155Owners";
import useActivity from "../../../../../common/hook/useActivity.hook";
const { __ } = wp.i18n;

export const erc_1155_put_on_sale = async (
  nftInfo,
  nftPrice,
  web3Provider,
  token,
  splitPayments
) => {
  if (!nftPrice) throw new Error("Price is not correct");
  //CATCH WALLET ERROR
  await catchWalletError(nftInfo, web3Provider);

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
  const { storeTxHashLocally } = useTxHash();
  const { updateErc1155Owners } = useErc1155Owners();
  const { createNewActivity } = useActivity();

  const price = parseEther(nftPrice).toString();

  //IF ITS A FREE MINTING NFT THEN DONT NEED ANY NETWORK TRANSECTION
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  let tx = { hash: "0x0000000" };
  if (nftInfo.isFreeMinting != "true") {
    //GIVE MARKET APPROVAL TO TRANSFER TOKEN
    const marketHasAccess = await tokenContract.isApprovedForAll(
      web3Provider.account[0],
      proxy.address
    );

    if (!marketHasAccess) {
      await tokenContract.setApprovalForAll(proxy.address, true);
    }

    // 0.contract_address, 1.creator_address, 2.split_payment_addresses_from_index_2
    // 0.token_id, 1.chain_id, 2.price, 3.royalty_percentage, 4.standard, 5.amount, 6.split_payment_percentages_from_index_6
    // 0.has_split_payment, 1.has_royalty

    //MAKE THE TRANSECTION TO PUT IT ON SALE
    tx = await proxyContract.list_for_sale(
      [
        nftInfo.contractAddress,
        nftInfo.creator,
        ...splitPayments.map((cur) => cur.address),
      ],
      [
        nftInfo.tokenId,
        web3Provider.network.chainId,
        price,
        0,
        1155,
        token.amount,
        ...splitPayments.map((cur) => cur.percentage * 100),
      ],
      [splitPayments.length > 0, false]
    );

    await tx.wait();
  }

  //LIST FROM SALE AND UPDATE THE PRICE
  await updateErc1155Owners(
    nftInfo.postId,
    web3Provider.account[0].toLowerCase(),
    {
      isListed: true,
      price: nftPrice,
    }
  );

  //SAVE TRANSECTION HASH WITH EVENT NAME
  await storeTxHashLocally(
    {
      eventType: "List",
      signer: web3Provider.account[0],
      hash: tx.hash,
      price: nftPrice,
    },
    parseInt(nftInfo.postId)
  );

  // SAVE THE ACTIVITY
  await createNewActivity({
    post_id: nftInfo.postId,
    activity_type: "list",
    price: nftPrice,
    addr_from: web3Provider.account[0].toLowerCase(),
    addr_to: web3Provider.account[0].toLowerCase(),
    chain_id: web3Provider.network.chainId,
    collection_id: nftInfo.collection.id,
    category_id: nftInfo.category.id,
  });

  successMessage(__("Your NFT is successfully put on sale", SLUG));
  window.location.reload();
};
