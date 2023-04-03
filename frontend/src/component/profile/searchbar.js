import React, { useContext, useState } from "react";
import { FilterContext } from "./state";
import { SETTINGS, SLUG, FRONTENDMEDIAURL } from "../../../../common/store";
import { Icons } from "../../../../common/component/icons";
const { __ } = wp.i18n;

const SeachBar = () => {
  //gurd close for dashboard controll
  if (SETTINGS.profile?.nfts?.search === "false") return null;

  //main component code
  const { state, dispatch } = useContext(FilterContext);
  const [currentDropdown, setCurrentDropDown] = useState();
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const [dropdownHeadtext, setDropDownHeadText] = useState(
    __("Select an option", SLUG)
  );

  const priceOrder = ["pricedesc", "priceasc"];
  const priceOrderHeaderText = [
    __("Price : High to low", SLUG),
    __("Price : Low to high", SLUG),
  ];

  const changePriceOrder = (value) => {
    if (state.priceOrder == priceOrder[value - 1]) return;

    setDropDownOpen(false);
    setCurrentDropDown(value);
    setDropDownHeadText(priceOrderHeaderText[value - 1]);
    dispatch({ type: "LOADING", payload: true });
    dispatch({ type: "CHANGE_PRICE_ORDER", payload: priceOrder[value - 1] });
  };

  const handleSearchEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.value == state.search) return;
      dispatch({ type: "LOADING", payload: true });
      dispatch({ type: "CHANGE_SEARCH", payload: e.target.value });
    }
  };

  const handleChangeEvent = (e) => {
    const value = e.target.value;
    if (state.search === value) return;
    dispatch({ type: "LOADING", payload: true });
    dispatch({ type: "CHANGE_SEARCH", payload: e.target.value });
  };

  return (
    <div className="search-bar all-nft-page">
      {SETTINGS.profile?.nfts?.filter === "false" ? null : (
        <a
          className="header-three toggle-filter"
          onClick={(e) => {
            dispatch({
              type: "CHANGE_FILTER_VISISBILITY",
              payload: !state.filterOpen,
            });
          }}
        >
          {state.filterOpen && (
            Icons.leftArrow
          )}
          {!state.filterOpen && (
            <img
              className="filter"
              src={`${FRONTENDMEDIAURL}filter.svg`}
              alt="filter icon"
            />
          )}
          {__("Filter", SLUG)}
        </a>
      )}
      <label className="search-bar-con" htmlFor="search">
        <img src={`${FRONTENDMEDIAURL}search.svg`} alt="search icon" />
        <input
          className="header-three"
          onKeyDown={(e) => handleSearchEnterKeyPress(e)}
          type="text"
          value={state.search}
          placeholder={__("Seach by NFTS", SLUG)}
          id="search"
          onChange={(e) => {
            handleChangeEvent(e);
          }}
        />
      </label>
      <div className="smartnft-dropdown">
        <span
          className={`smartnft-dropdown__picker ${
            dropdownOpen ? "active" : ""
          }`}
          onClick={(e) => setDropDownOpen(!dropdownOpen)}
        >
          {dropdownHeadtext}
          {Icons.leftArrow}
        </span>

        {dropdownOpen && (
          <ul className="smartnft-dropdown__options">
            <li
              className={currentDropdown == 1 ? "active" : ""}
              onClick={(e) => changePriceOrder(1)}
            >
              {__("Price: High to low", SLUG)}
            </li>
            <li
              className={currentDropdown == 2 ? "active" : ""}
              onClick={(e) => changePriceOrder(2)}
            >
              {__("Price: Low to high", SLUG)}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default SeachBar;
