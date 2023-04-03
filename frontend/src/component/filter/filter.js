import React, { useContext, useState } from "react";
import { parseEther } from "ethers/lib/utils";
import { FilterContext } from "../../allnft";
import { FRONTENDMEDIAURL, SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

export const PriceRange = ({ setLoading, setIsCurNftReasultForFilter }) => {
  const { _state, dispatch } = useContext(FilterContext);

  const [_startPrice, _setStartPrice] = useState(0);
  const [_endPrice, _setEndPrice] = useState(0);

  const [showPrice, setShowPrice] = useState(true);

  const handlePriceRange = () => {
    if (parseFloat(_startPrice) < 0 || parseFloat(_endPrice) <= 0) return;

    const a = parseEther(_startPrice).toString();
    const b = parseEther(_endPrice).toString();

    dispatch({ type: "CHANGE_PRICE_RANGE", payload: [a, b] });
    setIsCurNftReasultForFilter(true);
    setLoading(true);
  };

  return (
    <>
      <div
        onClick={(e) => setShowPrice(!showPrice)}
        className={`filter-section-heading ${showPrice ? "showing" : ""}`}
      >
        <h6>{__("Price", SLUG)}</h6>
        <img
          className="arrow-bottom"
          src={`${FRONTENDMEDIAURL}left-arrow.svg`}
        />
      </div>
      {showPrice && (
        <div className="price-range">
          <div className="input-range">
            <input
              type="text"
              min="0"
              placeholder={__("Min...", SLUG)}
              onChange={(e) => {
                _setStartPrice(e.target.value);
              }}
            />
            <input
              type="text"
              min="0"
              placeholder={__("Max...", SLUG)}
              onChange={(e) => {
                _setEndPrice(e.target.value);
              }}
            />
          </div>
          <button onClick={handlePriceRange}>{__("Apply", SLUG)}</button>
        </div>
      )}
    </>
  );
};

export const Status = ({ setLoading, setIsCurNftReasultForFilter }) => {
  const { state, dispatch } = useContext(FilterContext);
  const [showStatus, setShowStatus] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("1");
  console.log(state);
  const changeStatus = (value) => {
    if (value === "1") {
      if (state.status === "") return;
      dispatch({ type: "CHANGE_STATUS", payload: "" });
      setIsCurNftReasultForFilter(true);
      setCurrentStatus(value);
      setLoading(true);
      return;
    }

    if (value === "2") {
      if (state.status === "false") return;
      dispatch({ type: "CHANGE_STATUS", payload: "false" });
      setIsCurNftReasultForFilter(true);
      setCurrentStatus(value);
      setLoading(true);
    }

    if (value === "3") {
      if (state.status === "true") return;
      dispatch({ type: "CHANGE_STATUS", payload: "true" });
      setIsCurNftReasultForFilter(true);
      setCurrentStatus(value);
      setLoading(true);
    }
  };

  return (
    <>
      <div
        onClick={(e) => setShowStatus(!showStatus)}
        className={`filter-section-heading ${showStatus ? "showing" : ""}`}
      >
        <h6>{__("Status", SLUG)}</h6>
        <img
          className="arrow-bottom"
          src={`${FRONTENDMEDIAURL}left-arrow.svg`}
        />
      </div>
      {showStatus && (
        <div className="status">
          <span
            className={currentStatus == "1" ? "active" : ""}
            onClick={(e) => changeStatus("1")}
          >
            {__("All", SLUG)}
          </span>
          <span
            className={currentStatus == "2" ? "active" : ""}
            onClick={(e) => changeStatus("2")}
          >
            {__("Not for sell", SLUG)}
          </span>
          <span
            className={currentStatus == "3" ? "active" : ""}
            onClick={(e) => changeStatus("3")}
          >
            {__("Buy Now", SLUG)}
          </span>
        </div>
      )}
    </>
  );
};
