import { createContext } from "react";
import { ACTIVE_CONTRACT } from "./../../../../common/store";

export const CreateCollectionContext = createContext();

export const INISIAL_STATE = {
  bannerImg: "",
  bannerMimeType: "",
  profileImg: "",
  profileMimeType: "",
  name: "",
  description: "",
  customSite: "",
  discord: "",
  telegram: "",
  accAdd: "", //accAdd gets replaced when first use in REDUCER
  collectionExist: false,
  contract_add: ACTIVE_CONTRACT.address,
};

export const REDUCER = (state, action) => {
  switch (action.type) {
    case "CHANGE_BANNER_IMG":
      console.log(state)
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
    case "CHANGE_NAME":
      return { ...state, name: action.payload };
    case "CHANGE_DESCRIPTION":
      return { ...state, description: action.payload };
    case "CHANGE_CUSTOM_SITE":
      return { ...state, customSite: action.payload };
    case "CHANGE_DISCORD":
      return { ...state, discord: action.payload };
    case "CHANGE_TELEGRAM":
      return { ...state, telegram: action.payload };
    case "CHANGE_COLLECTION_EXIST":
      return { ...state, collectionExist: action.payload };
    default:
      return { ...state };
  }
};
