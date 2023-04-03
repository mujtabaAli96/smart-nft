import React, { useContext, useEffect, useState } from "react";
import { formatEther } from "ethers/lib/utils";
import { FilterContext } from "../../allnft";
import {
  SLUG,
  BACKEND_AJAX_URL,
  SETTINGS,
  FRONTENDMEDIAURL,
  ACTIVE_CONTRACT,
} from "../../../../common/store";
const { __ } = wp.i18n;

const convertPriceToEther = (price) => formatEther(price);
const SeachBar = ({
  setLoading,
  setNfts,
  isFetchAllow,
  setIsCurNftReasultForFilter,
  setFilterOpen,
  filterOpen,
}) => {
  //checking if searchbar is enable from dashboard
  if (SETTINGS.search === "false") return;

  //main component code
  const { state, dispatch } = useContext(FilterContext);
  const [currentDropdown, setCurrentDropDown] = useState();
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const [dropdownHeadtext, setDropDownHeadText] = useState(
    __("Select an option", SLUG)
  );

  const changePriceOrder = (value) => {
    if (value === "1") {
      if (state.priceOrder === "pricedesc") {
        setDropDownOpen(false);
        setCurrentDropDown(value);
        setDropDownHeadText(__("Price : High to low", SLUG));
        return;
      }
      dispatch({ type: "PRICE_ORDER_CHANGE", payload: "pricedesc" });
      setIsCurNftReasultForFilter(true);
      setLoading(true);
      setDropDownOpen(false);
      setCurrentDropDown(value);
      setDropDownHeadText(__("Price : High to low", SLUG));
      return;
    }

    if (value === "2") {
      if (state.priceOrder === "priceasc") {
        setDropDownOpen(false);
        setDropDownHeadText(__("Price : Low to High", SLUG));
        setCurrentDropDown(value);
        return;
      }
      dispatch({ type: "PRICE_ORDER_CHANGE", payload: "priceasc" });
      setIsCurNftReasultForFilter(true);
      setLoading(true);
      setDropDownOpen(false);
      setCurrentDropDown(value);
      setDropDownHeadText(__("Price : Low to high", SLUG));
    }
  };

  const handleSearchEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      dispatch({ type: "SEARCH_TEXT_CHANGE", payload: e.target.value });
      setIsCurNftReasultForFilter(true);
      setLoading(true);
    }
  };

  const handleEmptySearch = (e) => {
    const value = e.target.value;
    if (value === "" && value !== state.searchText) {
      dispatch({ type: "SEARCH_TEXT_CHANGE", payload: e.target.value });
      setIsCurNftReasultForFilter(true);
      setLoading(true);
    } else {
      dispatch({ type: "SEARCH_TEXT_CHANGE", payload: e.target.value });
      setIsCurNftReasultForFilter(true);
      setLoading(true);
    }
  };

  useEffect(() => {
    if (!isFetchAllow) return;
    const fetchData = async () => {
      try {
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: {
            filters: {
              text: state.searchText,
              price_range: state.priceRange,
              status: state.status,
              price_order: state.priceOrder,
            },
            action: "filter_nfts",
            contract_addr: ACTIVE_CONTRACT.address,
          },
        });

        const priceFormatedNfts = res.data.nfts.map((cur) => ({
          ...cur,
          price: convertPriceToEther(cur.price),
        }));
        setNfts(priceFormatedNfts);
        setLoading(false);

        console.log("filter-res------------------------------", res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [state.searchText, state.status, state.priceOrder, state.priceRange]);
  return (
    <div className="search-bar all-nft-page">
      {SETTINGS.filter === "false" ? null : (
        <a
          className="header-three toggle-filter"
          onClick={(e) => setFilterOpen(!filterOpen)}
        >
          {filterOpen && (
            <img
              className="arrow"
              src={`${FRONTENDMEDIAURL}left-arrow.svg`}
              alt="filter icon"
            />
          )}
          {!filterOpen && (
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
          placeholder={__("Seach by NFTS", SLUG)}
          id="search"
          onChange={(e) => {
            handleEmptySearch(e);
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
          {dropdownHeadtext}{" "}
          <img
            className="arrow-bottom"
            src={`${FRONTENDMEDIAURL}left-arrow.svg`}
          />
        </span>

        {dropdownOpen && (
          <ul className="smartnft-dropdown__options">
            <li
              className={currentDropdown == "1" ? "active" : ""}
              onClick={(e) => changePriceOrder("1")}
            >
              {__("Price: High to low", SLUG)}
            </li>
            <li
              className={currentDropdown == "2" ? "active" : ""}
              onClick={(e) => changePriceOrder("2")}
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
