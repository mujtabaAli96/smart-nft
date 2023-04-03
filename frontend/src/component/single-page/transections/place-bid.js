import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import useAuction from "../../../../../common/hook/useAuction.hook";
import { catchWalletError } from "./error";
import { parseEther } from "ethers/lib/utils";

export const placeBid = async ({
  web3Provider,
  nftInfo,
  price,
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
  const { addBid } = useAuction();

  // PLACE THE BID
  const tx = await auctionContract.bid_on_auction(
    nftInfo.contractAddress,
    benificiary,
    nftInfo.tokenId,
    {
      value: parseEther(price.toString()),
    }
  );
  await tx.wait();

  // SAVE THE NEW BID DATA
  await addBid({
    postId: nftInfo.postId,
    signer: web3Provider.account[0],
    benificiary,
    dataToSave: {
      signer: web3Provider.account[0].toLowerCase(),
      price,
      benificiary: benificiary.toLowerCase(),
      hash: tx.hash.toLowerCase(),
    },
  });

  // STORE TX HASH
  await storeTxHashLocally(
    {
      eventType: "Bid",
      signer: web3Provider.account[0].toLowerCase(),
      hash: tx.hash,
      price,
    },
    nftInfo.postId
  );

  return tx;
};
