import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useTxHash from "../../../../../common/hook/useTxhash.hook";
import { catchWalletError } from "./error";

export const withdrawBid = async ({
  web3Provider,
  nftInfo,
  benificiary,
  price,
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

  //WITHDRAW BID
  const tx = await auctionContract.withdraw_bid(
    nftInfo.contractAddress,
    benificiary,
    nftInfo.tokenId
  );

  await tx.wait();

  // STORE TX HASH
  await storeTxHashLocally(
    {
      eventType: "Withdraw",
      signer: web3Provider.account[0].toLowerCase(),
      hash: tx.hash,
      price,
    },
    nftInfo.postId
  );

  return tx;
};
