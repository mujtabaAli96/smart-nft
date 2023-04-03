import React, { useState } from "react";
import { errorMessage } from "../../../../common/component/message/error";
import { Popup, NormalLoaderPopup } from "../../../../common/component/popup";
import { BACKENDMEDIAURL, SLUG, SITE_ROOT } from "../../../../common/store";
import { erc_721_transfer_token } from "./transections/erc721-transfer-token";

const { __ } = wp.i18n;

const btnStyle = {
  padding: "5px",
  textAlign: "center",
};

const TransferConfirmPopup = ({ isOpen, confirmFn, cancelFn }) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const onChange = (e) => setRecipientAddress(e.target.value.trim());

  const submit = async () => {
    if (!recipientAddress) {
      return errorMessage(__("Provide recipient address", SLUG));
    }
    console.log(recipientAddress);
    await confirmFn(recipientAddress);
  };

  return (
    <Popup isOpen={isOpen}>
      <h2>
        <strong>{__("Transfer Token", SLUG)}</strong>
      </h2>
      <div style={{ padding: "0 20px" }}>
        <p>
          {__("Transfer this token from your wallet to other wallet.", SLUG)}
        </p>
        <input
          type="text"
          placeholder={__("Recipient address...")}
          className="transfer-input"
          value={recipientAddress}
          onChange={onChange}
        />
      </div>

      <div className="smart-nft-popup__btn-group">
        <button style={btnStyle} className="btn-confirm" onClick={submit}>
          {__("Confirm", SLUG)}
        </button>
        <button style={btnStyle} className="btn-close" onClick={cancelFn}>
          {__("Cancel", SLUG)}
        </button>
      </div>
    </Popup>
  );
};

const TransferCompleteConfirmation = () => {
  const reload = () => {
    window.location.reload();
  };

  return (
    <Popup isOpen={true}>
      <img src={`${BACKENDMEDIAURL}/loaders/done.svg`} />
      <h2>{__("Token Transfer Complete.", SLUG)}</h2>
      <button onClick={reload} className="translate-complete-btn-close">
        {__("Close", SLUG)}
      </button>
    </Popup>
  );
};

export const TransferComponent = ({ data, isOpen, setIsOpen }) => {
  const [isLoading, setLoading] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const { nftInfo, web3Provider } = data;

  //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

  const transfer = async (newOwnerAddress) => {
    console.log(">>>>>>>>>>>>", newOwnerAddress);
    try {
      setIsOpen(false);
      setLoading(true);
      await erc_721_transfer_token(nftInfo, web3Provider, newOwnerAddress);
      setComplete(true);
    } catch (err) {
      setLoading(false);
      setComplete(false);
      errorMessage(__("Cant transfer this token something is wrong.", SLUG));
      console.log("erc_721_transfer_token_err---->", err);
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
        <TransferConfirmPopup
          isOpen={isOpen}
          confirmFn={transfer}
          cancelFn={cancel}
        />
      )}
      {isLoading && (
        <NormalLoaderPopup
          isOpen={true}
          message={__("Transferring token.Please wait...", SLUG)}
        />
      )}
      {isComplete && <TransferCompleteConfirmation />}
    </>
  );
};
