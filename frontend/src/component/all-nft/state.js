import { createContext } from "react";
import { SETTINGS } from "../../../../common/store";

export const FilterContext = createContext();
export const INISIAL_STATE = {
  status: "",
  clearOpen: false,
  filterObjects: [],
  priceRange: [],
  loading: true,
  nfts: [],
  totalNfts: 0,
  limit: parseInt(SETTINGS.nftpages?.all?.perpage || 12),
  curPage: 1,
  search: "",
  priceOrder: "",
  collection: "",
  activeCollection: null,
  category: "",
  collections: [],
  collectionSearchKey: "",
  filteredCollections: [],
  filterOpen: window.screen.width >= 700, //below 700px filter will be closed by default
};

export const STATE = { ...INISIAL_STATE };

export const REDUCER = (state, action) => {
  //console.log(action, state);
  switch (action.type) {
    case "CHANGE_STATUS":
      return {
        ...state,
        status: action.payload,
        curPage: 1,
        //filterObjects: status,
      };
    case "CHANGE_PRICE_RANGE":
      const price =
        action.payload.length == 0
          ? state.filterObjects.filter((i) => i != "price")
          : state.filterObjects.includes("price")
          ? state.filterObjects
          : state.filterObjects.concat(["price"]);
      return {
        ...state,
        priceRange: action.payload,
        curPage: 1,
        filterObjects: price,
      };
    case "CHANGE_CUR_PAGE":
      return { ...state, curPage: action.payload };
    case "LOADING":
      return { ...state, loading: action.payload };
    case "CHANGE_NFTS":
      return { ...state, nfts: action.payload };
    //case "INSERT_NFTS":
    //const temp = [...state.nfts, ...action.payload];
    //return { ...state, nfts: temp };
    case "CHANGE_TOTAL_NFTS":
      return { ...state, totalNfts: action.payload };
    //case "CHANGE_PAGE":
    //return { ...state, curPage: action.payload };
    case "CHANGE_FILTER_VISISBILITY":
      return { ...state, filterOpen: action.payload };
    case "CHANGE_SEARCH":
      const search =
        action.payload.length == 0
          ? state.filterObjects.filter((i) => i != "search")
          : state.filterObjects.includes("search")
          ? state.filterObjects
          : state.filterObjects.concat(["search"]);
      return {
        ...state,
        search: action.payload,
        curPage: 1,
        filterObjects: search,
      };
    case "CHANGE_PRICE_ORDER":
      return {
        ...state,
        priceOrder: action.payload,
        curPage: 1,
        clearOpen: true,
      };
    case "CHANGE_COLLECTION":
      return { ...state, collection: action.payload, curPage: 1 };
    case "CHANGE_COLLECTIONS":
      return { ...state, collections: action.payload };
    case "CHANGE_FILTERED_COLLECTION":
      return { ...state, filteredCollections: action.payload };
    case "CHANGE_CATEGORY":
      return { ...state, category: action.payload, curPage: 1 };
    case "CHANGE_ACTIVE_COLLECTION":
      return { ...state, activeCollection: action.payload, curPage: 1 };
    case "CHANGE_COLLECTION_SEATCH_KEY":
      return { ...state, collectionSearchKey: action.payload };
    case "RESET_FILTER":
      return { ...INISIAL_STATE };

    default:
      return { ...state };
  }
};
