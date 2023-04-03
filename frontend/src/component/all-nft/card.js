import React from "react";
import useProfile from "../../hooks/useProfile";
const { __ } = wp.i18n;
import { SLUG } from "../../../../common/store";

const Card = ({ data }) => {
  const profileProvider = useProfile(data.creator, { name: "" });

  const currencySymbol =
    data?.customCoin?.isCustomCoin == "true"
      ? data?.customCoin?.contract?.symbol
      : data?.selectedContract?.network?.currencySymbol;

  const mediaSrc = data?.thumbnailMediaUrl?.attach_url;
  return (
    <div className="card">
      <figure>
        <a href={data.permalink}>
          {data?.fileType?.startsWith("video") && (
            <div className="video-preview">
              <video
                className="card__img"
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
                src={data?.mediaUrl}
                alt={data?.meta?.name}
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
          {data?.fileType?.startsWith("audio") && (
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
              {mediaSrc && <img src={mediaSrc} />}
            </div>
          )}
          {(data?.fileType?.startsWith("glb") ||
            data?.fileType?.startsWith("gltf")) && (
            <div className="audio-preview">
              <span className="form-preview-icon">
                <span>{__("3D", SLUG)}</span>
              </span>
              {mediaSrc !== null && <img src={mediaSrc} />}
            </div>
          )}
          {data?.fileType?.startsWith("image") && (
            <img src={mediaSrc} alt="preview" />
          )}
        </a>
      </figure>
      <a href={data.permalink}>
        <div className="card__info">
          {profileProvider.name ? (
            <p className=" meta-font card__creator">{profileProvider.name}</p>
          ) : (
            <p className="meta-font card__creator">
              {data.creator?.slice(0, 7)}....
              {data?.creator?.slice(data?.creator?.length - 4)}
            </p>
          )}
          <p className="header-three card__name">{data?.meta?.name}</p>
          <span className="meta-font">{__("Price", SLUG)}</span>
          {data.isListed == "true" ? (
            <p className="header-three card__price">
              {data.price} {currencySymbol}
            </p>
          ) : (
            <p className="header-three card__price">
              {__("Not for sale", SLUG)}
            </p>
          )}
        </div>
      </a>
    </div>
  );
};

export { Card };

