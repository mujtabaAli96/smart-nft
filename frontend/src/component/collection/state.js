import { createContext } from "react";
import { SETTINGS } from "../../../../common/store";
export const FilterContext = createContext();

export const INISIAL_STATE = {
  status: "",
  priceRange: [],
  loading: true,
  nfts: [],
  totalNfts: 0,
  collectionId: local.tax_id,
  collectionMeta: null,
  collectionStats: null,
  collOwnerProfile: null,
  limit: parseInt(SETTINGS.collections?.single?.perpage || 12),
  tax_id: "", //tax_id gets replaced when 1st inisialize in the reducer.
  curPage: 1,
  search: "",
  priceOrder: "",
  filterOpen: window.screen.width >= 700, //below 700px filter will be closed by default
};

export const STATE = { ...INISIAL_STATE };

export const REDUCER = (state, action) => {
  const type = action.type;
  const payload = action.payload;
  switch (type) {
    case "CHANGE_STATUS":
      return { ...state, status: payload, curPage: 1 };
    case "CHANGE_PRICE_RANGE":
      return { ...state, priceRange: payload, curPage: 1 };
    case "LOADING":
      return { ...state, loading: payload };
    case "CHANGE_NFTS":
      return { ...state, nfts: payload };
    case "CHANGE_TOTAL_NFTS":
      return { ...state, totalNfts: payload };
    case "CHANGE_COLL_META":
      return { ...state, collectionMeta: payload };
    case "CHANGE_COLL_STATS":
      return { ...state, collectionStats: payload };
    case "CHANGE_COLL_OWNER_PROFILE":
      return { ...state, collOwnerProfile: payload };
    case "CHANGE_CUR_PAGE":
      return { ...state, curPage: payload };
    case "CHANGE_FILTER_VISISBILITY":
      return { ...state, filterOpen: action.payload };
    case "CHANGE_SEARCH":
      return { ...state, search: payload, curPage: 1 };
    case "CHANGE_PRICE_ORDER":
      return { ...state, priceOrder: payload, curPage: 1 };
    default:
      return { ...state };
  }
};
