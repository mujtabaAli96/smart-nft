import React from "react";
import { createPortal } from "react-dom";
import { SLUG, BACKENDMEDIAURL } from "../../../../common/store";
const { __ } = wp.i18n;

const LoadingPopup = ({ isLoading }) => {
  return createPortal(
    <div className="smart-nft-popup__container open">
      <div className="smart-nft-popup__inner">
        <div className="create-coll-loader-con">
          {isLoading ? (
            <>
              <img
                className="rotating"
                src={`${BACKENDMEDIAURL}loaders/loading.svg`}
              />
              <h3>{__("Creating your collection wait!", SLUG)}</h3>
            </>
          ) : (
            <>
              <h3>{__("Your collection is created successfully.", SLUG)}</h3>
              <img src={`${BACKENDMEDIAURL}loaders/done.svg`} />
            </>
          )}
        </div>
      </div>
    </div>,
    document.querySelector("body")
  );
};

export default LoadingPopup;
