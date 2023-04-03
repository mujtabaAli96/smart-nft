import React, { useState } from "react";
import { errorMessage } from "../../../../common/component/message/error";
import { Popup, NormalLoaderPopup } from "../../../../common/component/popup";
import { BACKENDMEDIAURL, SLUG, SITE_ROOT } from "../../../../common/store";
import { erc_721_burn_token } from "./transections/erc721-burn";
const { __ } = wp.i18n;

const btnStyle = {
  padding: "5px",
  textAlign: "center",
};

export const BurnConfirmPopup = ({ isOpen, confirmFn, cancelFn }) => {
  return (
    <Popup isOpen={isOpen}>
      <h2>
        <strong>{__("Do you really want to burn this Token?", SLUG)}</strong>
      </h2>
      <div style={{ padding: "0 20px" }}>
        <p>
          {__(
            "Burning token will destroy/delete the token from contract permanently. You will not find this token anywhere.",
            SLUG
          )}
        </p>
      </div>

      <div className="smart-nft-popup__btn-group">
        <button style={btnStyle} className="btn-confirm" onClick={confirmFn}>
          {__("Confirm", SLUG)}
        </button>
        <button style={btnStyle} className="btn-close" onClick={cancelFn}>
          {__("Cancel", SLUG)}
        </button>
      </div>
    </Popup>
  );
};

const BurnCompleteConfirmation = () => {
  const redirect = () => {
    window.location.replace(SITE_ROOT);
  };

  return (
    <Popup isOpen={true}>
      <img src={`${BACKENDMEDIAURL}/loaders/done.svg`} />
      <h2>{__("Token Burning complete.", SLUG)}</h2>
      <button onClick={redirect} className="translate-complete-btn-close">
        {__("Close", SLUG)}
      </button>
    </Popup>
  );
};

export const BurnComponent = ({ data, isOpen, setIsOpen }) => {
  const [isLoading, setLoading] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const { nftInfo, web3Provider } = data;

  const burn = async () => {
    try {
      setIsOpen(false);
      setLoading(true);
      await erc_721_burn_token(nftInfo, web3Provider);
      setComplete(true);
    } catch (err) {
      setLoading(false);
      setComplete(false);
      errorMessage(__("Cant burn this token something is wrong.", SLUG));
      console.log("erc_721_burn_token_err---->", err);
    }
  };

  const cancel = () => {
    setLoading(false);
    setComplete(false);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <BurnConfirmPopup isOpen={isOpen} confirmFn={burn} cancelFn={cancel} />
      )}
      {isLoading && (
        <NormalLoaderPopup
          isOpen={true}
          message={__("Burning token wait", SLUG)}
        />
      )}
      {isComplete && <BurnCompleteConfirmation />}
    </>
  );
};
