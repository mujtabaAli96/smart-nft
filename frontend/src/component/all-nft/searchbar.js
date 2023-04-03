import React, { useContext, useState } from "react";
import { FilterContext } from "./state";
import { SETTINGS, SLUG, FRONTENDMEDIAURL } from "../../../../common/store";
import ResetFilter from "./filterReset";
import { Icons } from "../../../../common/component/icons";
const { __ } = wp.i18n;

const SeachBar = () => {
  //checking if searchbar is enable from dashboard
  if (SETTINGS.nftpages?.all?.search === "false") return;

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
    if (state.priceOrder == priceOrder[value]) return null;

    setDropDownOpen(false);
    setCurrentDropDown(value);
    setDropDownHeadText(priceOrderHeaderText[value]);
    dispatch({ type: "LOADING", payload: true });
    dispatch({ type: "CHANGE_PRICE_ORDER", payload: priceOrder[value] });
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
      {SETTINGS.nftpages?.all?.filter === "false" ? null : (
        <a
          className="header-three toggle-filter"
          onClick={(e) => {
            dispatch({
              type: "CHANGE_FILTER_VISISBILITY",
              payload: !state.filterOpen,
            });
          }}
        >
          {state.filterOpen && Icons.leftArrow}
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
      {state.filterObjects.length > 0 && <ResetFilter />}
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
            {priceOrderHeaderText.map((cur, index) => (
              <li
                className={currentDropdown == index ? "active" : ""}
                onClick={(e) => changePriceOrder(index)}
              >
                {cur}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SeachBar;
