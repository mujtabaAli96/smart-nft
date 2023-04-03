import React, { useState } from "react";
import { Popup } from "../../../../common/component/popup";
import { SLUG, BACKENDMEDIAURL } from "../../../../common/store";
import { placeBid } from "./transections/place-bid";
import { errorMessage } from "../../../../common/component/message/error";
import { successMessage } from "../../../../common/component/message/success";
const { __ } = wp.i18n;

export const AuctionBid = ({
  nftInfo,
  web3Provider,
  usdPrice,
  highestBid,
  currencySymbol,
  distance,
}) => {
  const [price, setPrice] = useState(0);
  const [inputOpen, setInputOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const bid = async () => {
    //error check
    if (parseFloat(price) <= highestBid) {
      return errorMessage(__("Bid need to be greater then highest bid", SLUG));
    }
    try {
      setIsOpen(true);
      await placeBid({
        web3Provider,
        nftInfo,
        price,
        benificiary: nftInfo.owners[0],
      });
      successMessage(__("Bid Complete", SLUG));
      window.location.reload();
    } catch (err) {
      setIsOpen(false);
      console.log(err);
    }
  };

  return (
    <>
      <div className="auction-bid">
        <div>
          <p>{__("Min Price", SLUG)}</p>
          <p>
            {nftInfo.auction?.minPrice} {currencySymbol}
          </p>
          <p>${usdPrice.price}</p>
        </div>
        <div>
          <p>{__("Highest Bid", SLUG)}</p>
          <p>
            {highestBid} {currencySymbol}
          </p>
          <p>${usdPrice.highestPrice}</p>
        </div>

        {distance > 0 &&
        web3Provider?.account[0]?.toLowerCase() != nftInfo?.owners[0] ? (
          <button className="bid-btn" onClick={() => setInputOpen(!inputOpen)}>
            {__("Place a bid", SLUG)}
          </button>
        ) : null}

        {inputOpen ? (
          <div className="auction-bid__input-box">
            <input type="text" onChange={(e) => setPrice(e.target.value)} />
            <button className="submit-btn" onClick={bid}>
              {__("Submit", SLUG)}
            </button>
          </div>
        ) : null}
      </div>
      <Popup isOpen={isOpen} setIsOpen={setIsOpen}>
        <>
          <img
            className="rotating"
            src={`${BACKENDMEDIAURL}/loaders/loading.svg`}
            style={{ marginTop: 20 }}
          />
          <h2>{__("Please wait while you bid on this nft", SLUG)}</h2>
        </>
      </Popup>
    </>
  );
};
