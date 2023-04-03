import React, { useState } from "react";
import { RemoveFromSaleLoadingPopup } from "./remove-from-sale-loading-popup";
import { erc_721_remove_from_sale } from "./transections/erc721-remove-from-sale";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

export const RemoveFromSell = ({ data }) => {
  const { nftInfo, web3Provider } = data;
  if (nftInfo.standard === "Erc1155") return null;

  const isOwner = nftInfo.owners.includes(
    web3Provider.account[0]?.toLowerCase()
  );

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const isListed = nftInfo.isListed === "true";

  const remove = () => {
    try {
      erc_721_remove_from_sale(nftInfo, web3Provider);
    } catch (err) {
      setIsOpenPopup(false);
      console.log("erc_721_remove_from_sale_err---->", err);
    }
  };

  if (isOwner && isListed) {
    return (
      <>
        {isOpenPopup && (
          <RemoveFromSaleLoadingPopup
            isOpen={isOpenPopup}
            setIsOpen={setIsOpenPopup}
          />
        )}
        <button
          className="buynft__remove-from-sell"
          onClick={() => {
            setIsOpenPopup(true);
            remove();
          }}
        >
          {__("Remove from sell", SLUG)}
        </button>
      </>
    );
  }
  return null;
};
