import { createContext } from "react";
import { SETTINGS } from "../../../../common/store";

export const AllCollectionContext = createContext();
export const INISIAL_STATE = {
  loading: true,
  collections: [],
  totalCollections: 0,
  limit: parseInt(SETTINGS.collections?.all?.perpage || 12),
  perColumn: parseInt(SETTINGS.collections?.all?.cols || 4),
  isInfinitePagination: SETTINGS?.general?.loadmore == "infinite",
  curPage: 1,
  style: SETTINGS.collections?.all?.view || "list",
};

export const STATE = { ...INISIAL_STATE };

export const REDUCER = (state, action) => {
  //console.log(action, state);
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: action.payload };
    case "CHANGE_COLLECTIONS":
      return { ...state, collections: action.payload };
    case "CHANGE_TOTAL_COLLECTIONS":
      return { ...state, totalCollections: action.payload };
    case "CHANGE_PAGE":
      return { ...state, curPage: action.payload };
    case "CHANGE_COLLECTION_TABS":
      return { ...state, tab: action.payload };
    case "CHANGE_TIME_FRAME":
      return { ...state, timeframe: action.payload };

    default:
      return { ...state };
  }
};
