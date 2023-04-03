import React, { useContext } from "react";
import { CreateNftContext } from "./state";
import { SLUG } from "../../../../common/store";
import { errorMessage } from "../../../../common/component/message/error";
import { ThumbnailMedia, CloseThumbnail } from "./media";
const { __ } = wp.i18n;

const maxuploadsize = 200 * 1024;
const Preview = () => {
    const { state, dispatch } = useContext(CreateNftContext);
    console.log(state);
    let currencySymbol =
    state?.customCoin?.isCustomCoin == true
        ? state?.customCoin?.contract?.symbol
        : state?.selectedContract?.network?.currencySymbol;

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
    <div className="form-img-upload__preview">
        <p className="form-img-upload__title header-two">
          {__("Preview", SLUG)}
        </p>
        <div className="form-img-upload__preview-section">
          {state.mediaUrl ? (
            <>
              {state.fileType?.startsWith("video") && (
                <div className="video-preview">
                  <video
                    className="card__img"
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => e.target.pause()}
                    src={state.mediaUrl}
                    alt="preview"
                  />
                  <span className="video-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-play-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                    </svg>
                  </span>
                </div>
              )}
              {state.fileType?.startsWith("audio") && (
                <div className="audio-preview">
                  <span className="form-preview-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-music-note"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
                      <path fillRule="evenodd" d="M9 3v10H8V3h1z" />
                      <path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z" />
                    </svg>
                  </span>
                  {state.thumbnailMediaUrl !== null && (
                    <img src={state.thumbnailMediaUrl} />
                  )}
                </div>
              )}
              {state.fileType?.startsWith("glb") && (
                <div className="audio-preview">
                  <span className="form-preview-icon">{__("3D", SLUG)}</span>
                  {state.thumbnailMediaUrl !== null && (
                    <img src={state.thumbnailMediaUrl} />
                  )}
                </div>
              )}
              {state.fileType?.startsWith("image") && (
                <img src={state.mediaUrl} alt="preview" />
              )}
            </>
          ) : (
            <span className="preview-skeleton"></span>
          )}
          {state.meta?.name ? (
            <span className="nft-title">{state.meta?.name}</span>
          ) : (
            <span className="title-skeleton"></span>
          )}
          {state.price ? (
            <span className="price-title">{__("Price", SLUG)}</span>
          ) : (
            <span className="price-skeleton"></span>
          )}
          {state.price ? (
            <span className="price">
              {state.price} {currencySymbol}
            </span>
          ) : (
            <span className="price-skeleton"></span>
          )}
        </div>
    </div>
  );
};

export default Preview;
