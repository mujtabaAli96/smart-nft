import React from "react";
import { SLUG, SETTINGS, BACKENDMEDIAURL } from "../../../../common/store";
import { errorMessage } from "../../../../common/component/message/error";
const { __ } = wp.i18n;

const SplitPaymentComponent = ({ web3Provider, metaData, setMetaData }) => {
  if (SETTINGS?.nftpages?.create?.splitPayment === "false") return null;

  const addSplitPayments = () => {
    const newSplitPayments = [
      ...metaData.splitPayments,
      { address: "", percentage: 0 },
    ];

    setMetaData((prev) => ({ ...prev, splitPayments: newSplitPayments }));
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

      const newSplitPayments = [...metaData.splitPayments];
      newSplitPayments[index].percentage = percentageWithOnlyTwoFlotPoinNumber;
      console.log(newSplitPayments);

      setMetaData((prev) => ({ ...prev, splitPayments: newSplitPayments }));
    }

    if (property === "address") {
      const newSplitPayments = [...metaData.splitPayments];
      newSplitPayments[index].address = value;
      setMetaData((prev) => ({ ...prev, splitPayments: newSplitPayments }));
    }
  };

  const removeSplitPayments = (index) => {
    if (metaData.splitPayments.length < index) {
      errorMessage(__("Cant remove. Try again or reload the page.", SLUG));
      throw new Error(__("Cant remove. Try again or reload the page.", SLUG));
    }

    console.log(index);

    const newSplitPayments = [...metaData.splitPayments];

    newSplitPayments.splice(index, 1);
    console.log(newSplitPayments);

    if (!newSplitPayments.length) {
      return setMetaData((prev) => ({
        ...prev,
        splitPayments: [],
        hasSplitPayment: false,
      }));
    }

    setMetaData((prev) => ({ ...prev, splitPayments: newSplitPayments }));
  };

  const calculatePercentage = () =>
    metaData.splitPayments.reduce(
      (perValue, curEl) => perValue + parseFloat(curEl.percentage),
      0
    );

  const changeSplitPaymentActivation = (hasSplitPayment = false) => {
    if (hasSplitPayment === false) {
      setMetaData((prev) => ({
        ...prev,
        hasSplitPayment: false,
        splitPayments: [],
      }));
    }

    if (hasSplitPayment === true) {
      setMetaData((prev) => ({
        ...prev,
        hasSplitPayment: true,
        splitPayments: [
          {
            address: "",
            percentage: 0, //multiple with 100
          },
        ],
      }));
    }
  };

  return (
    <>
      <div className="form-img-upload__collection">
        <p className="header-two">{__("Split Payments", SLUG)}</p>
        <label className="switch">
          <input
            type="checkbox"
            checked={metaData.hasSplitPayment}
            onChange={(e) => {
              changeSplitPaymentActivation(e.target.checked);
            }}
          />
          <span className="slider round"></span>
        </label>
        <p className="pra-one form-img-upload__newline-pra">
          {__(
            "Add multiple address to receive your payments.Only Creator will be able to see it. Must total 100%",
            SLUG
          )}
        </p>
      </div>

      {metaData.hasSplitPayment && (
        <>
          {metaData.splitPayments.map((cur, index) => (
            <label htmlFor="splitPayments" key={index}>
              <div className="form-img-upload__split-payments-input-group">
                <input
                  className="form-img-upload__input"
                  type="text"
                  placeholder={__("Address", SLUG)}
                  onChange={(e) => {
                    changeSplitPayments(index, "address", e.target.value);
                  }}
                />
                <input
                  className="form-img-upload__input"
                  type="text"
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
          ))}
        </>
      )}

      {metaData.hasSplitPayment && (
        <>
          {calculatePercentage() > 100 && (
            <p className="form-img-upload__error-split-payment pra-one">
              {__("Total payments must be 100%", SLUG)}
            </p>
          )}
        </>
      )}

      {metaData.hasSplitPayment && (
        <button
          onClick={(e) => {
            e.preventDefault();
            addSplitPayments();
          }}
          className="pra-one form-img-upload__add-new-split-payment"
          disabled={calculatePercentage() >= 100 ? true : false}
        >
          {__("+ add more", SLUG)}
        </button>
      )}
    </>
  );
};

export default SplitPaymentComponent;
