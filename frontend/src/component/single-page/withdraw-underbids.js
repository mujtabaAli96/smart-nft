import React, { useState, useEffect } from "react";
import { Popup } from "../../../../common/component/popup";
import { formatEther } from "ethers/lib/utils";
import { SLUG, BACKENDMEDIAURL } from "../../../../common/store";
import { successMessage } from "../../../../common/component/message/success";
import { errorMessage } from "../../../../common/component/message/error";
import useContractGenaretor from "../../../../common/hook/contract-genaretor.hook";
import { withdrawBid } from "./transections/withdraw-bid";
const { __ } = wp.i18n;

export const WithdrawBids = ({
  bids,
  web3Provider,
  nftInfo,
  currencySymbol,
}) => {
  if (!web3Provider?.account[0]) return null;

  const keys = Object.keys(bids);

  if (!keys.length) return null;

  return (
    <>
      {keys.map((key) => (
        <WithdrawBid
          key={key}
          auctionStarter={key}
          nftInfo={nftInfo}
          web3Provider={web3Provider}
          currencySymbol={currencySymbol}
        />
      ))}
    </>
  );
};

const WithdrawBid = ({
  auctionStarter,
  nftInfo,
  web3Provider,
  currencySymbol,
}) => {
  const myAddress = web3Provider.account[0].toLowerCase();
  const [isOpen, setIsOpen] = useState(false);
  const [withtdrawBlnc, setWithdrawBlnc] = useState("0");
  const { Auction } = nftInfo.selectedContract.contract;
  const { chainId } = nftInfo.selectedContract.network;
  if (!Auction?.address || parseInt(chainId) != web3Provider?.network?.chainId)
    return null;

  const auctionContract = useContractGenaretor(
    Auction.address,
    "Auction",
    web3Provider.wallet
  );

  const withdraw = async () => {
    try {
      setIsOpen(true);
      await withdrawBid({
        web3Provider,
        nftInfo,
        benificiary: auctionStarter,
        price: formatEther(withtdrawBlnc),
      });
      successMessage(__("Withdraw Complete", SLUG));
      window.location.reload();
    } catch (err) {
      console.log(err);
      setIsOpen(false);
      errorMessage(__("Cant Withdraw! Something is wrong!", SLUG));
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await auctionContract.recipient_balance(
        nftInfo.contractAddress,
        auctionStarter,
        myAddress,
        nftInfo.tokenId
      );
      setWithdrawBlnc(res.toString());
    }
    fetchData();
  }, [myAddress]);

  if (withtdrawBlnc == "0") return null;

  return (
    <>
      <div className="withdraw-bids">
        <p>
          {__("Under bid balance: ", SLUG)}
          {formatEther(withtdrawBlnc)} {currencySymbol}
        </p>
        <button onClick={(e) => withdraw()}>
          {__("Withdraw Balance", SLUG)}
        </button>
      </div>
      <Popup isOpen={isOpen} setIsOpen={setIsOpen}>
        <>
          <img
            className="rotating"
            src={`${BACKENDMEDIAURL}/loaders/loading.svg`}
            style={{ marginTop: 20 }}
          />
          <h2>{__("Please wait while you withdraw your underbid.", SLUG)}</h2>
        </>
      </Popup>
    </>
  );
};
