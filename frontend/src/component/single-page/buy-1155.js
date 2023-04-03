import React, { useState } from "react";
import { SLUG, FRONTENDMEDIAURL } from "../../../../common/store";
import { erc_1155_normal_buy } from "./transections/erc1155-normal-buy";
import { erc_1155_custom_token_normal_buy } from "./transections/erc1155-custom-token-normal-buy";
import { BuyLoadingPopup } from "./buy-loading-popup";
import { errorMessage } from "../../../../common/component/message/error";
const { __ } = wp.i18n;
import { convertObjToArray } from "./owners/erc1155-owners";

export const findLowestPriceToken = (arr) => {
  let token;
  arr.forEach((cur) => {
    if (cur.isListed === "true" && !token) token = cur;
  });
  return token;
};

export const BuyBtnErc1155 = ({ data }) => {
  const { nftInfo, web3Provider, nftOwners } = data;
  if (nftInfo.standard === "Erc721") return null;

  const [tx, setTx] = useState(null);
  const [isLoaderOpen, setLoader] = useState(false);
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  const owner = nftOwners[web3Provider.account[0]?.toLowerCase()];
  const isListed = owner?.isListed === "false";

  const lowestPriceToken = findLowestPriceToken(convertObjToArray(nftOwners));

  const buy = async () => {
    try {
      let res;
      if (nftInfo?.customCoin?.isCustomCoin == "true") {
        res = await erc_1155_custom_token_normal_buy(
          nftInfo,
          web3Provider,
          lowestPriceToken,
          nftOwners
        );
      } else {
        res = await erc_1155_normal_buy(
          nftInfo,
          web3Provider,
          lowestPriceToken,
          nftOwners
        );
      }
      setTx(res);
      setLoadingComplete(true);
    } catch (err) {
      setLoader(false);
      console.log("erc_1155_normal_buy_err--->", err);
      errorMessage(
        __(
          "Something is wrong! You may not have enough balance for gas fee.",
          SLUG
        )
      );
    }
  };

  // owner dont see the buy btn
  if (isListed || owner || !lowestPriceToken) return null;
  return (
    <>
      <button
        onClick={() => {
          setLoader(true);
          buy();
        }}
        className="buynft__buy-btn"
      >
        <img src={`${FRONTENDMEDIAURL}buy-bag.svg`} />
        {__("Buy Now", SLUG)}
      </button>
      <BuyLoadingPopup
        isOpen={isLoaderOpen}
        setIsOpen={setLoader}
        data={data}
        isComplete={isLoadingComplete}
        tx={tx}
      />
    </>
  );
};
