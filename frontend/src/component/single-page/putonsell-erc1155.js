import React, { useState } from "react";
import { erc_1155_put_on_sale } from "./transections/erc1155-putonsale";
import { PutOnSaleLoadingPopup } from "./putonsale-loading-popup";
import { SLUG } from "../../../../common/store";
import SplitPayment from "./putonsale-input";

const { __ } = wp.i18n;

export const Erc1155PutonSell = ({ data }) => {
  const [isInputOpen, setInputOpen] = useState(false);
  const { nftInfo, nftOwners, web3Provider } = data;
  if (nftInfo.standard === "Erc721") return null;

  const owner = nftOwners[web3Provider.account[0]?.toLowerCase()];
  const isListed = owner?.isListed === "false";

  if (!isListed || !owner) return null;

  return (
    <div>
      <PutOnSellBtn setInputOpen={setInputOpen} />
      {isInputOpen && <PutOnSellInput data={data} token={owner} />}
    </div>
  );
};

const PutOnSellInput = ({ data, token }) => {
  const [nftPrice, setNftPrice] = useState(0);
  const [isLoaderOpen, setLoader] = useState(false);
  const [splitPayments, setSplitPayments] = useState([]);
  const [hasSplitPayment, setHasSplitPayment] = useState(false);
  const { nftInfo, web3Provider } = data;

  const priceChange = (e) => {
    const value = e.target.value;
    if (!value) return setNftPrice(0);
    setNftPrice(value);
  };

  const putOnSale = async () => {
    try {
      //split payment error check
      splitPayments.map((cur) => {
        if (!cur.address || !cur.percentage) {
          throw new Error("Invalid split payment");
        }
      });
      const total = splitPayments.reduce(
        (perValue, curEl) => perValue + curEl.percentage,
        0
      );
      if (hasSplitPayment && total != 100) {
        throw new Error("Invalid split payment");
      }
      //error end
      await erc_1155_put_on_sale(
        nftInfo,
        nftPrice,
        web3Provider,
        token,
        splitPayments
      );
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  return (
    <div className="putonsell">
      <p>{__("Give a new price to put this asset for sell.", SLUG)}</p>
      <label htmlFor="new-price">
        <input
          placeholder={__("Enter price for one piece", SLUG)}
          onChange={priceChange}
          type="text"
          id="new-price"
        />

        <SplitPayment
          splitPayments={splitPayments}
          setSplitPayments={setSplitPayments}
          hasSplitPayment={hasSplitPayment}
          setHasSplitPayment={setHasSplitPayment}
        />

        <button
          className="putonsell-submit"
          onClick={() => {
            setLoader(true);
            putOnSale();
          }}
        >
          {__("Submit", SLUG)}
        </button>
      </label>
      <PutOnSaleLoadingPopup isOpen={isLoaderOpen} setIsOpen={setLoader} />
    </div>
  );
};

const PutOnSellBtn = ({ setInputOpen }) => {
  return (
    <button
      className="buynft__puton-sell-btn"
      onClick={() => setInputOpen(true)}
    >
      {__("Put on Sell", SLUG)}
    </button>
  );
};
