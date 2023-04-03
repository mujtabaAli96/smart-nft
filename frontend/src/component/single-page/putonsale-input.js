import React from "react";
import { SLUG, SETTINGS } from "../../../../common/store";
import { errorMessage } from "../../../../common/component/message/error";
const { __ } = wp.i18n;
import Switch from "../../../../common/component/switcher";
import {Icons} from "../../../../common/component/icons"

const SplitPayment = ({
  splitPayments,
  setSplitPayments,
  hasSplitPayment,
  setHasSplitPayment,
}) => {
  if (
    SETTINGS.nftpages?.create?.splitPayment === "false" ||
    !SETTINGS.nftpages?.create?.splitPayment
  )
    return null;

  const addSplitPayments = () => {
    const newSplitPayments = [...splitPayments, { address: "", percentage: 0 }];
    setSplitPayments(newSplitPayments);
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

      const newSplitPayments = [...splitPayments];
      newSplitPayments[index].percentage = parseFloat(
        percentageWithOnlyTwoFlotPoinNumber
      );
      console.log(newSplitPayments);

      setSplitPayments(newSplitPayments);
    }

    if (property === "address") {
      const newSplitPayments = [...splitPayments];
      newSplitPayments[index].address = value;
      setSplitPayments(newSplitPayments);
    }
  };

  const removeSplitPayments = (index) => {
    if (splitPayments.length < index) {
      errorMessage(__("Cant remove. Try again or reload the page.", SLUG));
      throw new Error(__("Cant remove. Try again or reload the page.", SLUG));
    }

    console.log(index);

    const newSplitPayments = [...splitPayments];

    newSplitPayments.splice(index, 1);
    console.log(newSplitPayments);

    if (!newSplitPayments.length) {
      setSplitPayments([]);
      setHasSplitPayment(false);
      return;
    }

    setSplitPayments(newSplitPayments);
  };

  const calculatePercentage = () =>
    splitPayments.reduce((perValue, curEl) => perValue + curEl.percentage, 0);

  const changeSplitPaymentActivation = (hasSplitPayment = false) => {
    if (hasSplitPayment === false) {
      setSplitPayments([]);
      setHasSplitPayment(false);
    }

    if (hasSplitPayment === true) {
      setSplitPayments([{ address: "", percentage: 0 }]);
      setHasSplitPayment(true);
    }
  };

  return (
    <>
      <div className="putonsale-split">
        <div className="putonsale-split__switcher">
          <p className="header-two">{__("Split Payments", SLUG)}</p>
          <Switch 
            id={"put-on-split"}
            isOn={hasSplitPayment}
            handleToggle={(e) => {
              changeSplitPaymentActivation(e.target.checked);
            }}
          />
        </div>
        {splitPayments.map((_cur, index) => (
          <div key={index} className="putonsale-split__input-fields">
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
                <span onClick={e => removeSplitPayments(index)}>
                  {Icons.delete}
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>


      <>
        {calculatePercentage() > 100 && (
          <p className="split-payments__error pra-one">
            {__("Total payments must be 100%", SLUG)}
          </p>
        )}
      </>

      {hasSplitPayment && (
        <a
          onClick={(e) => {
            e.preventDefault();
            addSplitPayments();
          }}
          className="pra-one putonsale-split__btn"
          disabled={calculatePercentage() >= 100 ? true : false}
        >
          {__("Add more", SLUG)}
        </a>
      )}
    </>
  );
};

export default SplitPayment;