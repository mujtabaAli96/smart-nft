import React, { useEffect, useState, useContext } from "react";
import { FilterContext } from "./state";
import useCollection from "../../../../common/hook/useCollection.hook";
import { SLUG, FRONTENDMEDIAURL, SETTINGS } from "../../../../common/store";
import { successMessage } from "../../../../common/component/message/success";
import { errorMessage } from "../../../../common/component/message/error";
const { __ } = wp.i18n;

export const EditCollectionPopup = ({ isOpen, setOpen }) => {
  const [collData, setCollData] = useState({
    thumbImg: "",
    thumbMimeType: "",
    profileImg: "",
    profileMimeType: "",
    bannerImg: "",
    bannerMimeType: "",
    collectionName: "",
    collectionDesc: "",
  });
  const { updateCollection } = useCollection();
  const { state, dispatch } = useContext(FilterContext);
  const collMeta = state.collectionMeta?.term_meta;
  console.log(state)
  useEffect(() => {
    if (!state.collectionMeta) return;
    setCollData({
      // profileImg: collMeta?.profileImg,
      // profileMimeType: collMeta?.profileMimeType,
      // thumbImg: collMeta?.thumbImg,
      // thumbMimeType: collMeta?.thumbMimeType,
      // bannerImg: collMeta?.bannerImg,
      // bannerMimeType: collMeta?.bannerMimeType,
      collectionName: collMeta?.name,
      collectionDesc: collMeta?.description,
    });
  }, []);

  const updatecollection = async () => {
    console.log(collData)
    const collection_info = { taxID: state.collectionId, ...collData };

    await updateCollection(collection_info);
    successMessage(__("Collection updated successfully.", SLUG));

    window.setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const changeColDP = (e) => {
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
      setCollData((prev) => ({
        ...prev,
        profileImg: fileReader.result,
        profileMimeType: file.type,
      }));
    });
  };

  const changeColThumb = (e) => {
    console.log("Changing thumb...")
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
      setCollData((prev) => ({
        ...prev,
        thumbImg: fileReader.result,
        thumbMimeType: file.type,
      }));
    });
  };

  const changeColCover = (e) => {
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
      setCollData((prev) => ({
        ...prev,
        bannerImg: fileReader.result,
        bannerMimeType: file.type,
      }));
    });
  };

  const ppstyle = {
    background: `linear-gradient(#000000ba,#000000ba),url(${collData.profileImg})`,
  };
  const thumbstyle = {
    background: `linear-gradient(#000000ba,#000000ba),url(${collData.thumbImg})`,
  };
  const bannerstyle = {
    background: `linear-gradient(#000000ba,#000000ba),url(${collData.bannerImg})`,
  };

  return (
    <div className={"collection-editor " + isOpen}>
      <div className="collection-editor__container">
        <div className="collection-editor__profileimage">
          <div className="profile-upload-img">
            <p>{__("Collection Image", SLUG)}</p>
            <label
              className="profile-img"
              style={ppstyle}
              htmlFor="profile-img"
            >
              <input
                type="file"
                accept="image/*"
                id="profile-img"
                className="profile-img"
                onChange={(e) => changeColDP(e)}
              />
              <img src={`${FRONTENDMEDIAURL}img.svg`} alt="img svg icon" />
            </label>
          </div>
          { SETTINGS.collections?.create?.thumb === "true" && <div className="profile-upload-img">
            <p>{__("Collection Thumbnail", SLUG)}</p>
            <label
              className="profile-img"
              style={thumbstyle}
              htmlFor="thumb-img"
            >
              <input
                type="file"
                accept="image/*"
                id="thumb-img"
                className="profile-img"
                onChange={(e) => changeColThumb(e)}
              />
              <img src={`${FRONTENDMEDIAURL}img.svg`} alt="img svg icon" />
            </label>
          </div>}
          <div className="profile-upload-banner">
            <p>{__("Collection Cover", SLUG)}</p>
            <label
              className="profile-banner"
              style={bannerstyle}
              htmlFor="profile-banner"
            >
              <input
                type="file"
                accept="image/*"
                id="profile-banner"
                onChange={(e) => changeColCover(e)}
              />
              <img src={`${FRONTENDMEDIAURL}img.svg`} alt="img svg icon" />
            </label>
          </div>
        </div>
        <div className="collection-editor__coverimage"></div>
        <label
          className="collection-editor__label"
          htmlFor="collection-editor-name"
        >
          {__("Collection name", SLUG)}
        </label>
        <input
          className="collection-editor__name"
          id="collection-editor-name"
          type="text"
          placeholder="Name..."
          value={collData.collectionName}
          onChange={(e) =>
            setCollData((prev) => ({ ...prev, collectionName: e.target.value }))
          }
        />
        <label
          className="collection-editor__label"
          htmlFor="collection-editor-desc"
        >
          {__("Collection description", SLUG)}
        </label>
        <textarea
          id="collection-editor-desc"
          className="collection-editor__desc"
          placeholder="Description"
          onChange={(e) =>
            setCollData((prev) => ({ ...prev, collectionDesc: e.target.value }))
          }
          defaultValue={collData.collectionDesc}
        ></textarea>
        <div className="collection-editor__footer">
          <button
            className="button button-primary"
            onClick={(e) => updatecollection()}
          >
            {__("Save", SLUG)}
          </button>
          <button
            className="button button-secondary"
            onClick={(e) => setOpen(false)}
          >
            {__("Cancel", SLUG)}
          </button>
        </div>
      </div>
    </div>
  );
};
