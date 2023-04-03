import { createContext } from "react";
import { SETTINGS } from "../../../../common/store";
export const FilterContext = createContext();

export const INISIAL_STATE = {
  tab: "ALL_TAB",
  status: "",
  priceRange: [],
  loading: true,
  collectionloading: false,
  nfts: [],
  collections: [],
  totalNfts: 0,
  limit: parseInt(SETTINGS.profile?.nfts?.perpage || 12),
  accAdd: "", //accAdd gets replaced when 1st inisialize in the reducer.
  curPage: 1,
  search: "",
  priceOrder: "",
  filterOpen: window.screen.width >= 700, //below 700px filter will be closed by default
};

export const STATE = { ...INISIAL_STATE };

export const REDUCER = (state, action) => {
  //console.log(action, state);
  switch (action.type) {
    case "TAB_CHANGE":
      return { ...state, tab: action.payload, curPage: 1 };
    case "CHANGE_STATUS":
      return { ...state, status: action.payload, curPage: 1 };
    case "CHANGE_PRICE_RANGE":
      return { ...state, priceRange: action.payload, curPage: 1 };
    case "LOADING":
      return { ...state, loading: action.payload };
    case "COLLECTIONS_LOADING":
      return { ...state, collectionloading: action.payload };
    case "CHANGE_NFTS":
      return { ...state, nfts: action.payload };
    case "CHANGE_COLLECTIONS":
      return { ...state, collections: action.payload };
    case "CHANGE_TOTAL_NFTS":
      return { ...state, totalNfts: action.payload };
    case "CHANGE_PAGE":
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
