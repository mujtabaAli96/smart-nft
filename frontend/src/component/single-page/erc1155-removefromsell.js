import React, { useState } from "react";
import { RemoveFromSaleLoadingPopup } from "./remove-from-sale-loading-popup";
//import { erc_721_remove_from_sale } from "./transections/erc721-remove-from-sale";
import { erc_1155_remove_from_sale } from "./transections/erc1155-remove-from-sale";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

//import { RemoveFromSellPopup } from "../../../../common/component/popup";
//import { successMessage } from "../../../../common/component/message/success";
//import {
//escrowContract,
//magicContract,
//} from "../../../../common/utils/smartnft-importer-integration";

export const Erc1155RemoveFromSell = ({ data }) => {
  const { nftInfo, web3Provider, nftOwners } = data;
  if (nftInfo.standard === "Erc721") return null;

  const owner = nftOwners[web3Provider.account[0]?.toLowerCase()];
  const isListed = owner?.isListed === "false";

  if (isListed || !owner) return null;

  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const remove = async () => {
    try {
      await erc_1155_remove_from_sale(nftInfo, web3Provider);
    } catch (err) {
      setIsOpenPopup(false);
      console.log("erc_1155_remove_from_sale_err---->", err);
    }
  };

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
};
