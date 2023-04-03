import React, { useState, useEffect } from "react";
import { DeleteCategoryPopup } from "../../../../common/component/popup";
import { FRONTENDMEDIAURL, BACKEND_AJAX_URL } from "../../../../common/store";
import { SLUG } from "../../../../common/store";
import { successMessage } from "../../../../common/component/message/success";
const { __ } = wp.i18n;

export const EditCategory = ({ isOpen, setOpen, taxID }) => {
  const [profileImg, setProfileImg] = useState("");
  const [profileMimeType, setProfileMimeType] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [bannerMimeType, setBannerMimeType] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function feachData() {
      if (!taxID) return;
      try {
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: {
            action: "get_category",
            slug: taxID,
          },
        });

        setProfileImg(res.data.profileImg);
        setCoverImg(res.data.coverImg);
        setCategoryName(res.data.name);
        setCategoryDesc(res.data.description);

        setLoading(false);
      } catch (err) {
        console.error("category fetch error: ", err);
      }
    }
    feachData();
  }, [taxID]);

  const updateCategory = async () => {
    const category_info = {
      taxID,
      categoryName,
      categoryDesc,
      profileImg,
      profileMimeType,
      coverImg,
      bannerMimeType,
    };

    try {
      const res = await jQuery.ajax({
        type: "post",
        url: BACKEND_AJAX_URL,
        data: {
          action: "update_category",
          category_info,
        },
      });
      successMessage(__("Category updated successfully.", SLUG));
    } catch (err) {
      console.log("Update category error: ", err);
    }
    setOpen(false);
    window.location.reload();
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
      setProfileImg(fileReader.result);
      setProfileMimeType(file.type);
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
      setCoverImg(fileReader.result);
      setBannerMimeType(file.type);
    });
  };

  const ppstyle = {
    background: `linear-gradient(#000000ba,#000000ba),url(${profileImg})`,
  };
  const bannerstyle = {
    background: `linear-gradient(#000000ba,#000000ba),url(${coverImg})`,
  };
  const closeEditor = () => {
    setLoading(true);
    setOpen(false);
  };
  const deleteEditor = (tax_id) => {
    setDeletepopOpen(true);
    setDeletetaxid(tax_id);
    setOpen(false);
  };
  const [deletePopOpen, setDeletepopOpen] = useState(false);
  const [deletetaxid, setDeletetaxid] = useState(null);
  return (
    <>
      <DeleteCategoryPopup
        setEditorOpen={setOpen}
        isOpen={deletePopOpen}
        setOpen={setDeletepopOpen}
        taxID={deletetaxid}
      />
      <div className={"collection-editor " + isOpen}>
        <div className="collection-editor__container">
          {loading && <h2>Loading...</h2>}
          {!loading && (
            <>
              <div className="collection-editor__profileimage">
                <div className="profile-upload-banner">
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
                    <img
                      src={`${FRONTENDMEDIAURL}img.svg`}
                      alt="img svg icon"
                    />
                  </label>
                </div>
                <div className="profile-upload-img">
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
                    <img
                      src={`${FRONTENDMEDIAURL}img.svg`}
                      alt="img svg icon"
                    />
                  </label>
                </div>
              </div>
              <div className="collection-editor__coverimage"></div>
              <label
                className="collection-editor__label"
                htmlFor="collection-editor-name"
              >
                {__("Category name", SLUG)}
              </label>
              <input
                className="collection-editor__name"
                id="collection-editor-name"
                type="text"
                placeholder="Name..."
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <label
                className="collection-editor__label"
                htmlFor="collection-editor-desc"
              >
                {__("Category description", SLUG)}
              </label>
              <textarea
                id="collection-editor-desc"
                className="collection-editor__desc"
                placeholder="Description"
                onChange={(e) => setCategoryDesc(e.target.value)}
                defaultValue={categoryDesc}
              ></textarea>
              <div className="collection-editor__footer">
                <div>
                  <button
                    className="button-transparent-footer delete"
                    onClick={(e) => deleteEditor(taxID)}
                  >
                    {__("Delete", SLUG)}
                  </button>
                </div>
                <div>
                  <button
                    style={{ marginRight: 10 }}
                    className="button-transparent-footer"
                    onClick={(e) => closeEditor()}
                  >
                    {__("Cancel", SLUG)}
                  </button>
                  <button
                    className="button button-primary"
                    onClick={(e) => updateCategory()}
                  >
                    {__("Update category", SLUG)}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const deleteCategory = async (taxID) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        action: "delete_category",
        taxID,
      },
    });
    successMessage(__("Category deleted successfully.", SLUG));
    window.location.reload();
  } catch (err) {
    console.log("Update category error: ", err);
  }
  setOpen(false);
  window.location.reload();
};
