import React, { useEffect, useState } from "react";
import useAuction from "../../../../common/hook/useAuction.hook";
import { BACKEND_AJAX_URL } from "../../../../common/store";
import { AuctionCountDown } from "./auction-coundown";
import { AuctionBid } from "./auction-bid";
import { WithdrawBids } from "./withdraw-underbids";
import { CloseBid } from "./close-bid";

export const AuctionIntegrate = ({ data }) => {
  const { nftInfo, web3Provider } = data;
  const isAuctionSet = nftInfo?.auction?.isAuctionSet == "true";
  const currencySymbol = nftInfo?.selectedContract?.network?.currencySymbol;
  const [bids, setBids] = useState([]);
  const [highestBid, setHightBid] = useState(0);
  const [highestBidData, setHighestBidData] = useState({});
  const [usdPrice, setUsdPrice] = useState({ price: 0, highestPrice: 0 });
  const { getAllBids } = useAuction();

  const countDownDate = new Date(
    `${nftInfo.auction.endDate}T${nftInfo.auction.endTime}:00`
  ).getTime();

  const distance = countDownDate - Date.now();

  async function fetchData() {
    try {
      let result = {};

      const res = jQuery
        .ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: { action: "convert_price", symbol: currencySymbol },
        })
        .then((r) => {
          result.res1 = JSON.parse(r);
        });

      const res2 = getAllBids({ postId: nftInfo.postId }).then((r) => {
        result.res2 = r;
      });

      await Promise.allSettled([res, res2]);
      console.log("result--------------------------------");
      console.log(result);
      const ethToDoller = result.res1.USD;
      const curBids = result.res2[nftInfo.owners[0].toLowerCase()];
      let hbid = 0;
      let hbd = null;

      if (
        curBids &&
        curBids.length &&
        curBids[curBids.length - 1].highestBid == true
      ) {
        hbid = parseFloat(curBids[curBids.length - 1].price);
        hbd = curBids[curBids.length - 1];
      }

      setUsdPrice({
        ...usdPrice,
        price: (parseFloat(nftInfo.auction.minPrice) * ethToDoller).toFixed(4),
        highestPrice: (hbid * ethToDoller).toFixed(4),
      });
      setHightBid(hbid);
      setHighestBidData(hbd);
      setBids(result.res2);
    } catch (err) {
      console.error("Convert fetch error: ", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [web3Provider.account[0]]);

  return (
    <div>
      {isAuctionSet ? (
        <>
          <AuctionCountDown data={data} />
          <div className="auc-bid-con">
            <AuctionBid
              nftInfo={nftInfo}
              web3Provider={web3Provider}
              usdPrice={usdPrice}
              highestBid={highestBid}
              currencySymbol={currencySymbol}
              distance={distance}
            />

            <CloseBid
              web3Provider={web3Provider}
              nftInfo={nftInfo}
              highestBidData={highestBidData}
              distance={distance}
              benificiary={highestBidData?.benificiary || nftInfo.owners[0]}
            />
          </div>
        </>
      ) : null}

      <WithdrawBids
        bids={bids}
        web3Provider={web3Provider}
        nftInfo={nftInfo}
        currencySymbol={currencySymbol}
      />
    </div>
  );
};
