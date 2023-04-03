import React from "react";
import { Popup } from "../../../../common/component/popup";
import { SLUG, BACKENDMEDIAURL } from "../../../../common/store";
const { __ } = wp.i18n;

export const BuyLoadingPopup = ({
  isOpen,
  setIsOpen,
  data,
  isComplete,
  tx,
}) => {
  return (
    <Popup isOpen={isOpen} setIsOpen={setIsOpen}>
      {isComplete ? (
        <LoadingComplete data={data} tx={tx} />
      ) : (
        <Loading data={data} />
      )}
    </Popup>
  );
};

const LoadingComplete = ({ data, tx }) => {
  const { nftInfo } = data;

  const reload = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <div>
      <div className="steps-sections" style={{ paddingTop: 0 }}>
        <div
          className="popup-image"
          style={{ backgroundImage: `url(${nftInfo?.mediaUrl})` }}
        ></div>
      </div>
      <h5 className="heading-confirm">
        <img src={`${BACKENDMEDIAURL}/loaders/done.svg`} />
        {__("You have successfully purchased this NFT", SLUG)}
      </h5>
      <div className="tx-section">
        <div className="tx-from">
          <h6>{__("From", SLUG)}</h6>
          <p>
            {nftInfo.owners[0].slice(0, 7)} ...
            {nftInfo.owners[0].slice(nftInfo.owners[0].length - 4)}
          </p>
        </div>
        <div className="tx-id">
          <h6>{__("Tx", SLUG)}</h6>
          <p>
            {tx?.hash.slice(0, 7)}...
            {tx?.hash.slice(tx?.hash.length - 4)}
          </p>
        </div>
      </div>
      <a className="close-button" onClick={reload}>
        {__("Close", SLUG)}
      </a>
    </div>
  );
};

const Loading = ({ data }) => {
  const loading = `${BACKENDMEDIAURL}/loaders/loading.svg`;
  return (
    <>
      <img className="rotating" src={loading} style={{ marginTop: 20 }} />
      <h2>{__("Please wait while purchasing this nft", SLUG)}</h2>
    </>
  );
};
