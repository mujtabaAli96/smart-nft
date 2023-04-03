import { createContext } from "react";
//import { ACTIVE_CONTRACT } from "./../../../../common/store";

export const CreateCollectionContext = createContext();

export const INISIAL_STATE = {
  bannerImg: "",
  bannerMimeType: "",
  profileImg: "",
  profileMimeType: "",
  thumbImg: "",
  thumbMimeType: "",
  name: "",
  symbol: "",
  description: "",
  socialProfiles: "",
  creator: null, //creator gets replaced when first use in REDUCER
  standard: null,
  collectionExist: false,
  contractAddress: null,
  deployedContracts: [],
  selectedContract: null,
  component: 0,
  isFree: false,
};

export const STATE = { ...INISIAL_STATE };

export const REDUCER = (state, action) => {
  switch (action.type) {
    case "CHANGE_BANNER_IMG":
      return {
        ...state,
        bannerImg: action.payload.base64Img,
        bannerMimeType: action.payload.bannerMimeType,
      };

    case "CHANGE_PROFILE_IMG":
      return {
        ...state,
        profileImg: action.payload.base64Img,
        profileMimeType: action.payload.profileMimeType,
      };

    case "CHANGE_THUMB_IMG":
      return {
        ...state,
        thumbImg: action.payload.base64Img,
        thumbMimeType: action.payload.profileMimeType,
      };

    case "CHANGE_NAME":
      return { ...state, name: action.payload };

    case "CHANGE_FREE":
      return { ...state, isFree: action.payload };

    case "CHANGE_SYMBOL":
      return { ...state, symbol: action.payload };

    case "CHANGE_CONTRACT_ADDRESS":
      return { ...state, contractAddress: action.payload };

    case "CHANGE_DESCRIPTION":
      return { ...state, description: action.payload };

    case "CHANGE_SOCIAL_PROFILES":
      return { ...state, socialProfiles: action.payload };

    case "CHANGE_COLLECTION_EXIST":
      return { ...state, collectionExist: action.payload };

    case "SET_SELECTED_CONTRACT":
      return { ...state, selectedContract: action.payload };

    case "SET_DEPLOYED_CONTRACT":
      return { ...state, deployedContracts: action.payload };

    case "SET_STANDARD":
      return { ...state, standard: action.payload };

    case "CHANGE_COMPONENT":
      return { ...state, component: action.payload };

    default:
      return { ...state };
  }
};
