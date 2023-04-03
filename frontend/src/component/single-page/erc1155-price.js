import React, { useState, useEffect } from "react";
import { SLUG, BACKEND_AJAX_URL } from "../../../../common/store";
const { __ } = wp.i18n;
import { findLowestPriceToken } from "./buy-1155";
import { convertObjToArray } from "./owners/erc1155-owners";

const style = {
  marginTop: "5px",
  paddingLeft: "12px",
};

export const Erc1155Price = ({ data }) => {
  const { nftInfo, nftOwners } = data;
  if (nftInfo.standard === "Erc721") return null;

  const { network } = nftInfo.selectedContract;
  const [usdPrice, setUsdPrice] = useState(null);

  const lowestPriceToken = findLowestPriceToken(convertObjToArray(nftOwners));

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
        setUsdPrice(parseFloat(lowestPriceToken.price) * convertedPrice.USD);
      } catch (err) {
        console.error("Convert usd price fetch error: ", err);
      }
    }

    if (lowestPriceToken) fetchPriceInUsd();
  }, [nftInfo.price]);

  return (
    <>
      {lowestPriceToken?.price && (
        <>
          <div className="buynft__price-container">
            <p className="buynft__price-text">{__("Current price", SLUG)}</p>
            <div className="buynft__price-con">
              <img src={network.icon} />
              <p className="header-one buynft__price">
                {lowestPriceToken?.price}
                <span>{currencySymbol}</span>
              </p>
              <p className="buynft__price-convert" style={style}>
                {usdPrice ? `$ ${usdPrice.toFixed(4)}` : null}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
