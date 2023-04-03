import React, { useContext, useState } from "react";
import { CreateNftContext } from "./state";
import { SLUG, SETTINGS } from "../../../../common/store";
import { errorMessage } from "../../../../common/component/message/error";
const { __ } = wp.i18n;

const royaltyCalculate = (amount) => {
  const royaltyValue = parseFloat(amount);

  if (isNaN(royaltyValue)) {
    return errorMessage(__("Give a valid royalties percentage.", SLUG));
  }

  // royality cant be grater then 50%
  if (royaltyValue < 0 || royaltyValue > 50) {
    return errorMessage(__("Give a valid royalties percentage.", SLUG));
  }

  const royaltyWithOnlyTwoFlotPoinNumber = royaltyValue.toFixed(2);
  const royaltyWithoutFloatPoint = royaltyWithOnlyTwoFlotPoinNumber * 100;
  console.log(royaltyWithOnlyTwoFlotPoinNumber, royaltyWithoutFloatPoint);

  return royaltyWithoutFloatPoint;
};

const Royalty = () => {
  if (
    SETTINGS.nftpages?.create?.royalty === "false" ||
    !SETTINGS.nftpages?.create?.royalty
  )
    return null;

  const { state, dispatch } = useContext(CreateNftContext);

  const [royaltyActive, setRoyaltyActive] = useState(false);

  const onChange = (e) => {
    const value = e.target.value;
    if (!value) return dispatch({ type: "CHANGE_ROYALTY", payload: 0 });
    const royalty = royaltyCalculate(value);
    dispatch({ type: "CHANGE_ROYALTY", payload: royalty });
  };

  const onActiveOrDeactive = (e) => {
    setRoyaltyActive(!royaltyActive);
    if (!e.target.checked) dispatch({ type: "CHANGE_ROYALTY", payload: 0 });
  };

  return (
    <div>
      <div className="create-nft-form__switcher-section">
        <p className="header-two">{__("Royalties", SLUG)}</p>
        <label className="switch">
          <input type="checkbox" onChange={onActiveOrDeactive} />
          <span className="slider round"></span>
        </label>
        <p className="pra-one ">{__("Earn a % on secondary sales.", SLUG)}</p>
      </div>
      {royaltyActive ? (
        <label className="header-two" htmlFor="royalty">
          <input
            placeholder={__("Enter royalty %", SLUG)}
            onChange={onChange}
            type="number"
            id="royalty"
          />
          <p className="pra-one">
            {__("Suggested: 0%, 10%, 20%, 30%. Maximum is 50%", SLUG)}
          </p>
        </label>
      ) : null}
    </div>
  );
};

export default Royalty;
