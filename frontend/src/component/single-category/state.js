import { createContext } from "react";
import { SETTINGS } from "../../../../common/store";
export const FilterContext = createContext();

export const INISIAL_STATE = {
  status: "",
  priceRange: [],
  loading: true,
  nfts: [],
  totalNfts: 0,
  limit: parseInt(SETTINGS.categories?.single?.perpage || 12),
  categoryId: local.tax_id,
  curPage: 1,
  search: "",
  priceOrder: "",
  filterOpen: window.screen.width >= 700,
  cols: parseInt(SETTINGS.categories?.single?.cols) || 4,
};

export const STATE = { ...INISIAL_STATE };

export const REDUCER = (state, action) => {
  switch (action.type) {
    case "CHANGE_STATUS":
      return { ...state, status: action.payload, curPage: 1 };
    case "CHANGE_PRICE_RANGE":
      return { ...state, priceRange: action.payload, curPage: 1 };
    case "LOADING":
      return { ...state, loading: action.payload };
    case "CHANGE_NFTS":
      return { ...state, nfts: action.payload };
    case "CHANGE_TOTAL_NFTS":
      return { ...state, totalNfts: action.payload };
    case "CHANGE_CUR_PAGE":
      return { ...state, curPage: action.payload };
    case "CHANGE_FILTER_VISISBILITY":
      return { ...state, filterOpen: action.payload };
    case "CHANGE_SEARCH":
      return { ...state, search: action.payload, curPage: 1 };
    case "CHANGE_PRICE_ORDER":
      return { ...state, priceOrder: action.payload, curPage: 1 };
    default:
      return { ...state };
  }
};
