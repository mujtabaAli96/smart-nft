import React, { useState } from "react";
import { SLUG, FRONTENDMEDIAURL } from "../../../../common/store";
import { erc_721_normal_buy } from "./transections/erc721-normal-buy";
import { erc_721_custom_token_normal_buy } from "./transections/erc721-custom-token-normal-buy";
import { BuyLoadingPopup } from "./buy-loading-popup";
import { errorMessage } from "../../../../common/component/message/error";
const { __ } = wp.i18n;

export const BuyBtn = ({ data }) => {
  const { nftInfo, web3Provider } = data;
  if (nftInfo.standard === "Erc1155") return null;

  const [tx, setTx] = useState(null);
  const [isLoaderOpen, setLoader] = useState(false);
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  const isOwner = nftInfo.owners.includes(
    web3Provider.account[0]?.toLowerCase()
  );
  const isListed = nftInfo.isListed === "false";

  const buy = async () => {
    try {
      //if erc721 standard
      let res;
      if (nftInfo?.customCoin?.isCustomCoin == "true") {
        res = await erc_721_custom_token_normal_buy(nftInfo, web3Provider);
      } else {
        res = await erc_721_normal_buy(nftInfo, web3Provider);
      }
      setTx(res);
      setLoadingComplete(true);
    } catch (err) {
      setLoader(false);
      console.log("erc_721_normal_buy_err--->", err);
      errorMessage(
        __(
          "Something is wrong! You may not have enough balance for gas fee.",
          SLUG
        )
      );
    }
  };

  // owner dont see the buy btn
  if (isListed || isOwner) return null;
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
