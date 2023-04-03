import { createContext } from "react";

export const CreateCategoryContext = createContext();
export const INISIAL_STATE = {
  bannerImg: "",
  bannerMimeType: "",
  profileImg: "",
  profileMimeType: "",
  name: "",
  description: "",
  accAdd: "", //accAdd gets replaced when first use in REDUCER
  categoryExist: false,
};

export const REDUCER = (state, action) => {
  switch (action.type) {
    case "CHANGE_BANNER_IMG":
      return {
        ...state,
        bannerImg: action.payload.img,
        bannerMimeType: action.payload.mimeType,
      };
    case "CHANGE_PROFILE_IMG":
      return {
        ...state,
        profileImg: action.payload.img,
        profileMimeType: action.payload.mimeType,
      };
    case "CHANGE_NAME":
      return { ...state, name: action.payload };
    case "CHANGE_DESCRIPTION":
      return { ...state, description: action.payload };
    case "CHANGE_CATEGORY_EXIST":
      return { ...state, categoryExist: action.payload };
    default:
      return { ...state };
  }
};
