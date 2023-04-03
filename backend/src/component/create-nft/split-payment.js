import React, { useContext } from "react";
import { CreateNftContext } from "./state";
import { SLUG, SETTINGS, BACKENDMEDIAURL } from "../../../../common/store";
import { errorMessage } from "../../../../common/component/message/error";
const { __ } = wp.i18n;

const SplitPayment = () => {
  if (
    SETTINGS.nftpages?.create?.splitPayment === "false" ||
    !SETTINGS.nftpages?.create?.splitPayment
  )
    return null;

  const { state, dispatch } = useContext(CreateNftContext);

  //when auction is set then hide the splitPayments
  if (state.auction.isAuctionSet) return null;

  const addSplitPayments = () => {
    const newSplitPayments = [
      ...state.splitPayments,
      { address: "", percentage: 0 },
    ];

    dispatch({ type: "CHANGE_SPLIT_PAYMENT", payload: newSplitPayments });
  };

  const changeSplitPayments = (index, property, value) => {
    if (property === "percentage") {
      const percentage = parseFloat(value);

      if (isNaN(percentage)) {
        errorMessage(__("Give a valid percentage.", SLUG));
        return;
      }

      const percentageWithOnlyTwoFlotPoinNumber = percentage.toFixed(2);

      if (percentageWithOnlyTwoFlotPoinNumber > 100) {
        errorMessage(__("Total payments must be 100%", SLUG));
        throw new Error(__("Total payments must be 100%", SLUG));
      }

      const newSplitPayments = [...state.splitPayments];
      newSplitPayments[index].percentage = parseFloat(
        percentageWithOnlyTwoFlotPoinNumber
      );
      console.log(newSplitPayments);

      dispatch({ type: "CHANGE_SPLIT_PAYMENT", payload: newSplitPayments });
    }

    if (property === "address") {
      const newSplitPayments = [...state.splitPayments];
      newSplitPayments[index].address = value;
      dispatch({ type: "CHANGE_SPLIT_PAYMENT", payload: newSplitPayments });
    }
  };

  const removeSplitPayments = (index) => {
    if (state.splitPayments.length < index) {
      errorMessage(__("Cant remove. Try again or reload the page.", SLUG));
      throw new Error(__("Cant remove. Try again or reload the page.", SLUG));
    }

    console.log(index);

    const newSplitPayments = [...state.splitPayments];

    newSplitPayments.splice(index, 1);
    console.log(newSplitPayments);

    if (!newSplitPayments.length) {
      dispatch({ type: "CHANGE_SPLIT_PAYMENT", payload: [] });
      dispatch({ type: "CHANGE_HAS_SPLIT_PAYMENT", payload: false });
      return;
    }

    dispatch({ type: "CHANGE_SPLIT_PAYMENT", payload: newSplitPayments });
  };

  const calculatePercentage = () =>
    state.splitPayments.reduce(
      (perValue, curEl) => perValue + curEl.percentage,
      0
    );

  const changeSplitPaymentActivation = (hasSplitPayment = false) => {
    if (hasSplitPayment === false) {
      dispatch({ type: "CHANGE_SPLIT_PAYMENT", payload: [] });
      dispatch({ type: "CHANGE_HAS_SPLIT_PAYMENT", payload: false });
    }

    if (hasSplitPayment === true) {
      dispatch({
        type: "CHANGE_SPLIT_PAYMENT",
        payload: [{ address: "", percentage: 0 }],
      });
      dispatch({ type: "CHANGE_HAS_SPLIT_PAYMENT", payload: true });
    }
  };

  return (
    <>
      <div className="create-nft-form__switcher-section">
        <p className="header-two">{__("Split Payments", SLUG)}</p>
        <label className="switch">
          <input
            type="checkbox"
            checked={state.hasSplitPayment}
            onChange={(e) => {
              changeSplitPaymentActivation(e.target.checked);
            }}
          />
          <span className="slider round"></span>
        </label>

        <p className="pra-one">
          {__(
            "Add multiple address to receive your payments.Only Creator will be able to see it. Must total 100%",
            SLUG
          )}
        </p>
      </div>

      {state.splitPayments.map((_cur, index) => (
        <div key={index}>
          <label htmlFor="split-payments__label">
            <div className="split-payments__flex">
              <input
                type="text"
                placeholder={__("Address", SLUG)}
                onChange={(e) => {
                  changeSplitPayments(index, "address", e.target.value);
                }}
              />
              <input
                type="number"
                placeholder={__("%", SLUG)}
                onChange={(e) => {
                  if (!e.target.value) {
                    return changeSplitPayments(index, "percentage", 0);
                  }
                  changeSplitPayments(index, "percentage", e.target.value);
                }}
              />
              <img
                src={`${BACKENDMEDIAURL}delete.svg`}
                onClick={(e) => {
                  removeSplitPayments(index);
                }}
              />
            </div>
          </label>
        </div>
      ))}

      <>
        {calculatePercentage() > 100 && (
          <p className="split-payments__error pra-one">
            {__("Total payments must be 100%", SLUG)}
          </p>
        )}
      </>

      {state.hasSplitPayment && (
        <button
          onClick={(e) => {
            e.preventDefault();
            addSplitPayments();
          }}
          className="pra-one split-payments__btn"
          disabled={calculatePercentage() >= 100 ? true : false}
        >
          {__("+ add more", SLUG)}
        </button>
      )}
    </>
  );
};

export default SplitPayment;
