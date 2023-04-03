import React, { useContext, useState } from "react";
import { isMobileDevice } from "../../../../common/utils/utils";
import { FilterContext } from "./state";
import { FRONTENDMEDIAURL, SETTINGS, SLUG } from "../../../../common/store";
import { parseEther } from "ethers/lib/utils";
import CollectionFilter from "./collection-filter";
import { Icons } from "../../../../common/component/icons";
const { __ } = wp.i18n;


const BlockChainFilter = () => {
  const { state, dispatch } = useContext(FilterContext)
  const [ showBlockchainFilter, setShowBlockchainFilter ] = useState(
    SETTINGS.nftpages?.all?.filterToggle === "true"
  );
  
}
const PriceRange = () => {
  const { state, dispatch } = useContext(FilterContext);

  const [_startPrice, _setStartPrice] = useState(0);
  const [_endPrice, _setEndPrice] = useState(0);

  const [showPrice, setShowPrice] = useState(
    SETTINGS.nftpages?.all?.filterToggle === "true"
  );

  const handlePriceRange = () => {
    const a = _startPrice;
    const b = _endPrice;

    if (!a || !b || parseFloat(a) < 0 || parseFloat(b) <= 0) {
      dispatch({ type: "LOADING", payload: true });
      dispatch({ type: "CHANGE_PRICE_RANGE", payload: [] });
      return null;
    }

    const payload = [parseEther(a).toString(), parseEther(b).toString()];
    console.log(payload);

    dispatch({ type: "LOADING", payload: true });
    dispatch({
      type: "CHANGE_PRICE_RANGE",
      payload,
    });
  };

  return (
    <>
      <div
        onClick={(e) => setShowPrice(!showPrice)}
        className={`filter-section-heading ${showPrice ? "showing" : ""}`}
      >
        <h6>{__("Price", SLUG)}</h6>
        {Icons.leftArrow}
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

const Status = () => {
  const { state, dispatch } = useContext(FilterContext);
  const [showStatus, setShowStatus] = useState(
    SETTINGS.nftpages?.all?.filterToggle === "true"
  );
  const [currentStatus, setCurrentStatus] = useState(0);

  const statusValue = ["", "false", "true"];

  const statusLabel = [
    __("All", SLUG),
    __("Not for sale", SLUG),
    __("Buy Now", SLUG),
  ];

  const changeStatus = (value) => {
    if (state.status == statusValue[value]) return null;

    dispatch({ type: "LOADING", payload: true });
    dispatch({ type: "CHANGE_STATUS", payload: statusValue[value] });
    setCurrentStatus(value);
  };

  return (
    <>
      <div
        onClick={(e) => setShowStatus(!showStatus)}
        className={`filter-section-heading ${showStatus ? "showing" : ""}`}
      >
        <h6>{__("Status", SLUG)}</h6>
        {Icons.leftArrow}
      </div>

      {showStatus && (
        <div className="status">
          {statusLabel.map((cur, index) => (
            <span
              className={currentStatus == index ? "active" : ""}
              key={index}
              onClick={(e) => changeStatus(index)}
            >
              {cur}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

const DummySubmitBtn = () => {
  const { state, dispatch } = useContext(FilterContext);
  if (!isMobileDevice) return null;

  return (
    <button
      onClick={() => {
        dispatch({ type: "CHANGE_FILTER_VISISBILITY", payload: false });
      }}
    >
      {__("Submit", SLUG)}
    </button>
  );
};

const CrossBtn = () => {
  const { state, dispatch } = useContext(FilterContext);
  if (!isMobileDevice) return null;
  return (
    <img
      onClick={() => {
        dispatch({ type: "CHANGE_FILTER_VISISBILITY", payload: false });
      }}
      className="cross"
      src={`${FRONTENDMEDIAURL}cross.svg`}
    />
  );
};

const AllNftFilter = () => {
  //checking if filter is enable from dashboard
  if (SETTINGS.nftpages?.all?.filter === "false") return null;

  //main component code
  const { state, dispatch } = useContext(FilterContext);
  if (!state.filterOpen) return null;
  return (
    <div className="filter">
      <CrossBtn />
      <PriceRange />
      <Status />
      <CollectionFilter />
      <DummySubmitBtn />
    </div>
  );
};

export default AllNftFilter;
