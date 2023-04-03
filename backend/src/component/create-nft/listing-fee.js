import React, { useContext, useState, useEffect } from "react";
import { CreateNftContext } from "./state";
import { BACKEND_AJAX_URL, SLUG, SETTINGS } from "../../../../common/store";
const { __ } = wp.i18n;

const ListingFee = () => {
  const { state, dispatch } = useContext(CreateNftContext);
  const [usdPrice, setUsdPrice] = useState(0);

  let listingFee = SETTINGS?.listingPrice;
  const fixedListingPriceForCustomCoin =
    SETTINGS?.fixedListingPriceForCustomCoin || 0;
  const listingType = SETTINGS?.listingType;
  let currencySymbol =
    state?.customCoin?.isCustomCoin == true
      ? state?.customCoin?.contract?.symbol
      : state?.selectedContract?.network?.currencySymbol;
  let sign = listingType == "1" ? "%" : currencySymbol;

  if (state.customCoin.isCustomCoin) {
    //currencySymbol = state?.selectedContract?.network?.currencySymbol;
    sign = state?.selectedContract?.network?.currencySymbol;
    listingFee = fixedListingPriceForCustomCoin;
  }

  const calcFee = () => {
    if (!state.price) return null;
    const price = parseFloat(state.price);

    //if customcoin then return the fixed rate
    if (state.customCoin.isCustomCoin) {
      return price;
    }

    //IF listingType IS PERCENTAGE THEN PROCESS
    if (listingType == "1") {
      return price - price * (parseFloat(listingFee) / 100);
    }

    //IF listingType IS FIXED THEN PROCESS
    if (listingType == "2") {
      return price - parseFloat(listingFee);
    }
  };
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
        console.log('Converted price ********************', convertedPrice)
        setUsdPrice(convertedPrice.USD);
      } catch (err) {
        console.error("Convert usd price fetch error: ", err);
      }
    }
    fetchPriceInUsd();
  }, []);
  return (
    <div className="listing-fee mb-small">
      <div>
        <span className="pra-one">{__("Listing fee", SLUG)}</span>
        <span className="pra-one">
          {listingFee} {sign}
        </span>
      </div>
      <div>
        <span className="pra-one">{__("You will receive", SLUG)}</span>
        <span className="pra-one">
          { calcFee() ? `$${(parseFloat(calcFee()) * usdPrice).toFixed(2)} - ` : ""} 
          <strong> { calcFee() ? `${calcFee()} ${currencySymbol}` : "-"}</strong>
        </span>
      </div>
    </div>
  );
};
export default ListingFee;
