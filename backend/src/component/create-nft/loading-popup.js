import React, { useContext } from "react";
import { createPortal } from "react-dom";
import { SLUG, BACKENDMEDIAURL } from "../../../../common/store";
const { __ } = wp.i18n;

const LoadingPopup = ({ state }) => {
  return (
    <div className="smart-nft-popup__container open">
      <div className="smart-nft-popup__inner">
        <div className="create-nft-loading-popup">
          <h2>{__("NFT creation in progress", SLUG)}</h2>
          <Steps
            title={__("Upload NFTs", SLUG)}
            des={__("Uploading of all media assets and metadata to IPFS", SLUG)}
            isDone={state.isMediaUploaded}
            isActive={state.isMediaState}
          />
          <Steps
            title={__("Mint", SLUG)}
            des={__("Send transaction to create your NFT", SLUG)}
            isDone={state.isMintedOnContract}
            isActive={state.isMintingState}
          />
          <Steps
            title={__("Listing for sale", SLUG)}
            des={__("Send transaction to list your NFT", SLUG)}
            isDone={state.isListingComplete}
            isActive={state.isListingState}
          />
        </div>
      </div>
    </div>
  );
};

const LoadingOrDone = ({ isDone, isActive }) => {
  if (!isActive) return <img src={`${BACKENDMEDIAURL}loaders/loading.svg`} />;
  if (isDone) return <img src={`${BACKENDMEDIAURL}loaders/done.svg`} />;
  if (!isDone)
    return (
      <img className="rotating" src={`${BACKENDMEDIAURL}loaders/loading.svg`} />
    );
};

const Steps = ({ title, des, isDone, isActive }) => {
  return (
    <div className="steps-section">
      <div className="section-loader">
        <LoadingOrDone isDone={isDone} isActive={isActive} />
      </div>
      <div className="section-content">
        <h3>{title}</h3>
        <p>{des}</p>
      </div>
    </div>
  );
};

const LoadingPopupPortal = ({ state }) => {
  return createPortal(
    <LoadingPopup state={state} />,
    document.querySelector("body")
  );
};

export default LoadingPopupPortal;
