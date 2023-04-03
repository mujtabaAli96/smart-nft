import React, { useState } from "react";
import { Popup } from "../../../../common/component/popup";
import { SLUG, BACKENDMEDIAURL } from "../../../../common/store";
import { closeBid } from "./transections/close-bid";
const { __ } = wp.i18n;
import { successMessage } from "../../../../common/component/message/success";
import { errorMessage } from "../../../../common/component/message/error";

export const CloseBid = ({
  web3Provider,
  nftInfo,
  highestBidData,
  distance,
  benificiary,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = async () => {
    try {
      setIsOpen(true);
      await closeBid({
        web3Provider,
        nftInfo,
        highestBidData,
        benificiary,
      });
      successMessage(__("Auction complete and closed.", SLUG));
      window.location.reload();
    } catch (err) {
      console.error(err);
      setIsOpen(false);
      errorMessage(__("Can't close the Auction ! Something is wrong!", SLUG));
    }
  };

  if (distance > 0) return null;

  return (
    <>
      <div className="close-bid">
        <button onClick={close}>{__("Complete auction", SLUG)}</button>
      </div>

      <Popup isOpen={isOpen} setIsOpen={setIsOpen}>
        <>
          <img
            className="rotating"
            src={`${BACKENDMEDIAURL}/loaders/loading.svg`}
            style={{ marginTop: 20 }}
          />
          <h2>{__("Wait! Closing the Auction.", SLUG)}</h2>
        </>
      </Popup>
    </>
  );
};
