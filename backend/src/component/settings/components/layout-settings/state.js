import { createContext } from "react";

export const SettingsContext = createContext();

export const INITIAL_STATE = {
  fixedListingPriceForCustomCoin: 0,
  general: {
    loadmore: "infinite",
  },
  nftpages: {
    all: {
      cols: 3,
      width: 1000,
      perpage: 12,
      search: true,
      filter: true,
      filterToggle: true,
    },
    single: {
      likebtn: true,
      sharebtn: true,
      infotabs: true,
      width: 1000,
    },
    create: {
      splitPayment: true,
      royalty: true,
      unlockable: true,
      properties: true,
      freeminting: true,
      width: 900,
      uploadsize: 2,
      category: true,
      collection: true,
      labels: true,
      stats: true,
    },
  },
  collections: {
    all: {
      cols: 5,
      width: 1000,
      perpage: 12,
      view: "grid",
    },
    create: {
      width: 991,
      thumb: false,
    },
    single: {
      cols: 5,
      width: 1000,
      perpage: 12,
      desc: true,
      creator: true,
      links: true,
      search: true,
      filter: true,
      filterToggle: true,
    },
  },
  categories: {
    all: {
      cols: 5,
      width: 1000,
      perpage: 12,
    },
    create: {
      width: 991,
    },
    single: {
      cols: 5,
      width: 1000,
      perpage: 12,
      desc: true,
      search: true,
      filter: true,
      filterToggle: true,
    },
  },
  profile: {
    single: {
      width: 1000,
      address: true,
      desc: true,
      links: true,
      filterToggle: true,
    },
    edit: {
      width: 990,
    },
    nfts: {
      cols: 4,
      perpage: 12,
      filter: true,
      search: true,
    },
    collections: {
      cols: 5,
      perpage: 12,
    },
  },
};

export const STATE = { ...INITIAL_STATE };

export const REDUCER = (state, action) => {
  switch (action.type) {
    case "CHANGE_GENERAL_STATE":
      return { ...state, general: action.payload };

    case "CHANGE_NFTS_ALL":
      return { ...state, nftpages: { ...state.nftpages, all: action.payload } };
    case "CHANGE_NFTS_SINGLE":
      return {
        ...state,
        nftpages: { ...state.nftpages, single: action.payload },
      };
    case "CHANGE_NFTS_CREATE":
      return {
        ...state,
        nftpages: { ...state.nftpages, create: action.payload },
      };

    case "CHANGE_COLLECTIONS_ALL":
      return {
        ...state,
        collections: { ...state.collections, all: action.payload },
      };
    case "CHANGE_COLLECTIONS_SINGLE":
      return {
        ...state,
        collections: { ...state.collections, single: action.payload },
      };
    case "CHANGE_COLLECTIONS_CREATE":
      return {
        ...state,
        collections: { ...state.collections, create: action.payload },
      };

    case "CHANGE_CATEGORIES_ALL":
      return {
        ...state,
        categories: { ...state.categories, all: action.payload },
      };
    case "CHANGE_CATEGORIES_SINGLE":
      return {
        ...state,
        categories: { ...state.categories, single: action.payload },
      };
    case "CHANGE_CATEGORIES_CREATE":
      return {
        ...state,
        categories: { ...state.categories, create: action.payload },
      };

    case "CHANGE_PROFILE_SINGLE":
      return {
        ...state,
        profile: { ...state.profile, single: action.payload },
      };
    case "CHANGE_PROFILE_EDIT":
      return { ...state, profile: { ...state.profile, edit: action.payload } };
    case "CHANGE_PROFILE_NFTS":
      return { ...state, profile: { ...state.profile, nfts: action.payload } };
    case "CHANGE_PROFILE_COLLECTION":
      return {
        ...state,
        profile: { ...state.profile, collections: action.payload },
      };

    case "LOAD_ALL_SETTINGS":
      return { ...state, ...action.payload };

    default:
      return { ...state };
  }
};
