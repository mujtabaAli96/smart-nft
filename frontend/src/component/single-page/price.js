import React, { useState, useEffect } from "react";
import { SLUG, BACKEND_AJAX_URL } from "../../../../common/store";
const { __ } = wp.i18n;

const style = {
  marginTop: "5px",
  paddingLeft: "12px",
};

export const Price = ({ data }) => {
  const { nftInfo } = data;
  if (nftInfo.standard === "Erc1155") return null;
  const { network } = nftInfo.selectedContract;
  const [usdPrice, setUsdPrice] = useState(null);

  const currencySymbol =
    nftInfo?.customCoin?.isCustomCoin == "true"
      ? nftInfo?.customCoin?.contract?.symbol
      : network?.currencySymbol;

  useEffect(() => {
    async function fetchPriceInUsd() {
      try {
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: {
            action: "convert_price",
            symbol: currencySymbol,
          },
        });
        const convertedPrice = await JSON.parse(res);
        console.log("convertedPrice", convertedPrice);
        setUsdPrice(parseFloat(nftInfo.price * convertedPrice.USD));
      } catch (err) {
        console.error("Convert fetch error: ", err);
      }
    }

    if (nftInfo.auction.isAuctionSet !== "true") {
      fetchPriceInUsd();
    }
  }, [nftInfo.price]);

  //if auction is running then dont show price
  if (nftInfo.auction.isAuctionSet == "true") return null;

  return (
    <div className="buynft__price-container">
      <p className="buynft__price-text">{__("Current price", SLUG)}</p>
      <div className="buynft__price-con">
        <img src={network.icon} />
        <p className="header-one buynft__price">
          {nftInfo.price}
          <span>{currencySymbol}</span>
        </p>
        <p className="buynft__price-convert" style={style}>
          {usdPrice ? `$ ${usdPrice.toFixed(4)}` : null}
        </p>
      </div>
    </div>
  );
};
