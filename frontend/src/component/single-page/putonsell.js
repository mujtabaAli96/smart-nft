import React, { useState } from "react";
import { erc_721_put_on_sale } from "./transections/erc721-putonsale";
import { PutOnSaleLoadingPopup } from "./putonsale-loading-popup";
import SplitPayment from "./putonsale-input";
import { SLUG } from "../../../../common/store";

const { __ } = wp.i18n;

const PutonSell = ({ data }) => {
  const [isInputOpen, setInputOpen] = useState(false);

  return (
    <div>
      <PutOnSellBtn data={data} setInputOpen={setInputOpen} />
      {isInputOpen && <PutOnSellInput data={data} />}
    </div>
  );
};

const PutOnSellBtn = ({ data, setInputOpen }) => {
  const { nftInfo, web3Provider } = data;
  if (nftInfo.standard === "Erc1155") return null;
  const isOwner = nftInfo.owners.includes(
    web3Provider.account[0]?.toLowerCase()
  );

  const isListed = nftInfo.isListed === "true";

  if (isOwner && !isListed) {
    return (
      <button
        className="buynft__puton-sell-btn"
        onClick={() => setInputOpen(true)}
      >
        {__("Put on Sell", SLUG)}
      </button>
    );
  }
  return null;
};

const PutOnSellInput = ({ data }) => {
  const [nftPrice, setNftPrice] = useState(0);
  const [isLoaderOpen, setLoader] = useState(false);
  const [splitPayments, setSplitPayments] = useState([]);
  const [hasSplitPayment, setHasSplitPayment] = useState(false);
  const { nftInfo, web3Provider } = data;

  const priceChange = (e) => {
    const value = e.target.value;
    if (!value) return setNftPrice(0);
    console.log(parseFloat(value));
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

      await erc_721_put_on_sale(nftInfo, nftPrice, web3Provider, splitPayments);
    } catch (err) {
      setLoader(false);
      console.log("erc_721_put_on_sale_err:--->", err);
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

export { PutonSell };
