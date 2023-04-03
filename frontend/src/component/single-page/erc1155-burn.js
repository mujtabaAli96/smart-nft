import React, { useState } from "react";
import { errorMessage } from "../../../../common/component/message/error";
import { Popup, NormalLoaderPopup } from "../../../../common/component/popup";
import { BACKENDMEDIAURL, SLUG, SITE_ROOT } from "../../../../common/store";
import { erc_1155_burn_token } from "./transections/erc1155-burn";
const { __ } = wp.i18n;

const btnStyle = {
  padding: "5px",
  textAlign: "center",
};

const BurnConfirmPopup = ({ isOpen, confirmFn, cancelFn, maxAmount }) => {
  const [amount, setAmount] = useState(0);
  const onChange = (e) => setAmount(parseInt(e.target.value));

  const submit = async () => {
    if (!amount || amount > maxAmount) {
      return errorMessage(__("Invalid amount", SLUG));
    }
    await confirmFn(amount);
  };

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
        <input
          type="number"
          placeholder={__("amount")}
          className="transfer-input"
          value={amount}
          onChange={onChange}
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

const BurnCompleteConfirmation = ({ willRedirect }) => {
  const redirect = () => {
    if (willRedirect) return window.location.replace(SITE_ROOT);
    window.location.reload();
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

export const Erc1155BurnComponent = ({ data, isOpen, setIsOpen }) => {
  const [isLoading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const { nftInfo, web3Provider, nftOwners } = data;
  const address = web3Provider.account[0].toLowerCase();
  const token = { ...nftOwners[address], address };

  const burn = async (amount) => {
    try {
      setIsOpen(false);
      setLoading(true);
      const { tx, willRedirect } = await erc_1155_burn_token(
        nftInfo,
        web3Provider,
        nftOwners,
        amount,
        token
      );
      setRedirect(willRedirect);
      setComplete(true);
    } catch (err) {
      setLoading(false);
      setComplete(false);
      errorMessage(__("Cant burn this token something is wrong.", SLUG));
      console.log("erc_1155_burn_token_err---->", err);
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
        <BurnConfirmPopup
          isOpen={isOpen}
          confirmFn={burn}
          cancelFn={cancel}
          maxAmount={parseInt(token.amount)}
        />
      )}
      {isLoading && (
        <NormalLoaderPopup
          isOpen={true}
          message={__("Burning token wait", SLUG)}
        />
      )}
      {isComplete && <BurnCompleteConfirmation willRedirect={redirect} />}
    </>
  );
};
