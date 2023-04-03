import React, { useContext } from "react";
import { SLUG, FRONTENDMEDIAURL } from "../../../../common/store";
import { CreateCategoryContext } from "./state";
const { __ } = wp.i18n;

const processImage = (e, dispatch, dispatchType) => {
  //sanitize the input
  const file = e.target.files[0];
  if (!file) throw new Error("no file is selected");
  if (file.size > 2000000) {
    errorMessage(
      __("File is larger then 2mb. Please upload an image less then 2mb.", SLUG)
    );
    return;
  }
  if (!file.type.startsWith("image")) {
    errorMessage(__("Please upload an image file", SLUG));
    return;
  }
  //set the state
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.addEventListener("load", () => {
    dispatch({
      type: dispatchType,
      payload: {
        img: fileReader.result,
        mimeType: file.type,
      },
    });
  });
};

const ProfileImgUploader = () => {
  const { state, dispatch } = useContext(CreateCategoryContext);

  const style = {
    background: `linear-gradient(#000000ba,#000000ba),url(${state.profileImg})`,
  };

  return (
    <div className="create-category__profile-uploader">
      <p>{__("Logo Image", SLUG)}</p>
      <label style={style} htmlFor="logo-img">
        <input
          type="file"
          accept="image/*"
          id="logo-img"
          onChange={(e) => processImage(e, dispatch, "CHANGE_PROFILE_IMG")}
        />
        <img src={`${FRONTENDMEDIAURL}img.svg`} />
      </label>
    </div>
  );
};

const BannerImgUploader = () => {
  const { state, dispatch } = useContext(CreateCategoryContext);

  const style = {
    background: `linear-gradient(#000000ba,#000000ba),url(${state.bannerImg})`,
  };

  return (
    <div className="create-category__banner-uploader">
      <p>{__("Banner image", SLUG)}</p>
      <label style={style} htmlFor="banner-img">
        <input
          type="file"
          accept="image/*"
          id="banner-img"
          onChange={(e) => processImage(e, dispatch, "CHANGE_BANNER_IMG")}
        />
        <img src={`${FRONTENDMEDIAURL}img.svg`} alt="img svg icon" />
      </label>
    </div>
  );
};

const ImageUploader = () => {
  return (
    <div>
      <ProfileImgUploader />
      <BannerImgUploader />
    </div>
  );
};

export default ImageUploader;
