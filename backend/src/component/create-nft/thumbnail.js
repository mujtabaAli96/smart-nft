import React, { useContext } from "react";
import { CreateNftContext } from "./state";
import { SLUG } from "../../../../common/store";
import { errorMessage } from "../../../../common/component/message/error";
import { ThumbnailMedia, CloseThumbnail } from "./media";
const { __ } = wp.i18n;

const maxuploadsize = 200 * 1024;

const Thumbnail = () => {
  const { state, dispatch } = useContext(CreateNftContext);
  console.log(state);

  const processFile = (e) => {
    const file = e.target.files[0];

    if (!file) return null;

    if (file.size > maxuploadsize) {
      errorMessage(__(`Please upload a file less then 200kb.`, SLUG));
      return null;
    }

    if (!file.type.startsWith("image")) {
      errorMessage(__(`Please upload an image file.`, SLUG));
      return null;
    }
    
    dispatch({ type: "SET_FILE", payload: file });

    const binaryReader = new FileReader();
    const dataUrlReader = new FileReader();
    binaryReader.readAsArrayBuffer(file);
    dataUrlReader.readAsDataURL(file);

    binaryReader.addEventListener("load", () => {
      dispatch({ type: "SET_THUMBNAIL_BINARY", payload: binaryReader.result });
    });

    dataUrlReader.addEventListener("load", () => {
      dispatch({
        type: "SET_THUMBNAIL_MEDIA_URL",
        payload: dataUrlReader.result,
      });
    });
  };

  return (
    <>
      { 
        (state.fileType?.startsWith("audio") || state.fileType?.startsWith("glb")) && 
        <>
          <p className="form-wallet__title header-two">
            {__("Thumbnail image", SLUG)}
          </p>
          <div className="form-img-upload__upload-box thumbnail">
            <ThumbnailMedia />
            <CloseThumbnail />

            {!state.thumbnailMediaUrl && (
              <div className="thumbnail__file">
                <p className="pra-one">{__("JPG, PNG,. Max 200kb.", SLUG)}</p>
                <label htmlFor="upload-btn-thumb">
                  {__("Choose file", SLUG)}
                  <input
                    className="form-img-upload__file-input"
                    type="file"
                    id="upload-btn-thumb"
                    onChange={processFile}
                  />
                </label>
              </div>
            )}
          </div>
        </>
      }
    </>
  );
};

export default Thumbnail;
