import React from "react";
import { errorMessage } from "../../../../common/component/message/error";
import { SLUG, FRONTENDMEDIAURL, SETTINGS } from "../../../../common/store";
const { __ } = wp.i18n;

const ImageUploader = ({ editeProfileProvider }) => {
  return (
    <div>
      <ProfileImgUpload editeProfileProvider={editeProfileProvider} />
      <ProfileBannerUpload editeProfileProvider={editeProfileProvider} />
    </div>
  );
};

const ProfileImgUpload = ({ editeProfileProvider }) => {
  const maxuploadsize = parseInt(SETTINGS?.collectionImageSize || 2) * 1000000;

  const changeProfile = (e) => {
    console.log("file:", e.target.files[0]);
    //sanitize the input
    const file = e.target.files[0];
    if (!file) throw new Error("no file is selected");
    if (file.size > maxuploadsize) {
      errorMessage(
        __(
          `Please upload an image less then ${
            parseInt(maxuploadsize) / 1000000
          }mb.`,
          SLUG
        )
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
      editeProfileProvider.setProfileImg(fileReader.result);
      editeProfileProvider.setProfileMimeType(file.type);
    });
  };

  const style = {
    background: `linear-gradient(#000000ba,#000000ba),url(${editeProfileProvider.profileImg})`,
  };

  return (
    <div className="profile-upload-img">
      <p>{__("Profile Image", SLUG)}</p>
      <label style={style} htmlFor="profile-img">
        <input
          type="file"
          accept="image/*"
          id="profile-img"
          onChange={(e) => changeProfile(e)}
        />
        <img src={`${FRONTENDMEDIAURL}img.svg`} />
      </label>
    </div>
  );
};

const ProfileBannerUpload = ({ editeProfileProvider }) => {
  const changeProfileBanner = (e) => {
    console.log("file:", e.target.files[0]);
    //sanitize the input
    const file = e.target.files[0];
    if (!file) throw new Error("no file is selected");

    if (file.size > 2000000) {
      errorMessage(
        __(
          "File is larger then 2mb. Please upload an image less then 2mb.",
          SLUG
        )
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
      editeProfileProvider.setBannerImg(fileReader.result);
      editeProfileProvider.setBannerMimeType(file.type);
    });
  };

  const style = {
    background: `linear-gradient(#000000ba,#000000ba),url(${editeProfileProvider.bannerImg})`,
  };

  return (
    <div className="profile-upload-banner">
      <p>{__("Profile Banner", SLUG)}</p>
      <label style={style} htmlFor="profile-banner">
        <input
          type="file"
          accept="image/*"
          id="profile-banner"
          onChange={(e) => changeProfileBanner(e)}
        />
        <img src={`${FRONTENDMEDIAURL}img.svg`} alt="img svg icon" />
      </label>
    </div>
  );
};

export { ImageUploader };
