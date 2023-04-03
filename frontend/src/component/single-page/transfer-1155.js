import React, { useState } from "react";
import { errorMessage } from "../../../../common/component/message/error";
import { Popup, NormalLoaderPopup } from "../../../../common/component/popup";
import { BACKENDMEDIAURL, SLUG } from "../../../../common/store";
import { erc_1155_transfer_token } from "./transections/erc1155-transfer-token";

const { __ } = wp.i18n;

const btnStyle = {
  padding: "5px",
  textAlign: "center",
};

const TransferConfirmPopup = ({ isOpen, confirmFn, cancelFn, maxAmount }) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const onChange = (e) => setRecipientAddress(e.target.value.trim());
  const onChangeAmount = (e) => setAmount(parseInt(e.target.value));

  const submit = async () => {
    if (!recipientAddress) {
      return errorMessage(__("Provide recipient address", SLUG));
    }
    if (!amount) {
      return errorMessage(__("Invalid amount", SLUG));
    }
    await confirmFn(recipientAddress, amount);
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
        <input
          type="number"
          placeholder={__("Amount to transfer")}
          className="transfer-input"
          value={amount}
          onChange={onChangeAmount}
        />
        <p>
          {__("Max amount", SLUG)} {maxAmount}
        </p>
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

export const Erc1155TransferComponent = ({ data, isOpen, setIsOpen }) => {
  const [isLoading, setLoading] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const { nftInfo, web3Provider, nftOwners } = data;
  const address = web3Provider.account[0].toLowerCase();
  const token = { ...nftOwners[address], address };

  const transfer = async (recipientAddress, amount) => {
    try {
      setIsOpen(false);
      setLoading(true);
      await erc_1155_transfer_token(
        nftInfo,
        web3Provider,
        nftOwners,
        amount,
        token,
        recipientAddress
      );
      setComplete(true);
    } catch (err) {
      setLoading(false);
      setComplete(false);
      errorMessage(__("Cant transfer this token. Something is wrong.", SLUG));
      console.log("erc_1155_transfer_token_err---->", err);
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
          maxAmount={parseInt(token.amount)}
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
