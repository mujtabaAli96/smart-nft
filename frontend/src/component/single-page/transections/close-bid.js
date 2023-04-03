import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import useNft from "../../../../../common/hook/useNft.hook";
import useActivity from "../../../../../common/hook/useActivity.hook";
import { catchWalletError } from "./error";

export const closeBid = async ({
  web3Provider,
  nftInfo,
  highestBidData,
  benificiary,
}) => {
  // CATCH WALLET ERROR
  await catchWalletError(nftInfo, web3Provider);

  const { Auction } = nftInfo.selectedContract.contract;
  const auctionContract = useContractGenaretor(
    Auction.address,
    "Auction",
    web3Provider.wallet
  );

  const { storeTxHashLocally } = useTxHash();
  const { updateNftMetaByPostId } = useNft();
  const { createNewActivity } = useActivity();

  //CLOSE THE AUCTION

  const tx = await auctionContract.auction_end(
    [nftInfo.contractAddress, highestBidData?.benificiary || benificiary],
    [nftInfo.tokenId],
    721
  );
  await tx.wait();

  //SAVE NEW OWNERS METADATA
  await updateNftMetaByPostId(nftInfo.postId, {
    newMeta: {
      owners: [highestBidData?.signer || nftInfo.owners[0]],
      isListed: false,
      auction: {
        isAuctionSet: false,
        endDate: 0,
        endTime: 0,
        minPrice: 0,
        startDate: 0,
        startTime: 0,
      },
    },
    //newDirectMeta will get their owne key on meta field
    newDirectMeta: {
      isListed: false,
      owners: [highestBidData?.signer || nftInfo.owners[0]],
    },
  });

  // STORE TX HASH
  await storeTxHashLocally(
    {
      eventType: highestBidData?.signer ? "Buy" : "Auction End",
      signer: highestBidData?.signer || nftInfo.owners[0],
      hash: tx.hash,
      price: highestBidData?.price || 0,
    },
    nftInfo.postId
  );

  // SAVE THE ACTIVITY
  if (highestBidData?.hash) {
    await createNewActivity({
      post_id: nftInfo.postId,
      activity_type: "buy",
      price: highestBidData.price,
      addr_from: highestBidData.benificiary.toLowerCase(),
      addr_to: highestBidData.signer.toLowerCase(),
      chain_id: web3Provider.network.chainId,
      collection_id: nftInfo.collection?.id,
      category_id: nftInfo.category?.id,
    });
  }

  return tx;
};
