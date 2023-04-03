import React from "react";
import { Popup } from "../../../../common/component/popup";
import { SLUG, BACKENDMEDIAURL } from "../../../../common/store";
const { __ } = wp.i18n;

export const PutOnSaleLoadingPopup = ({ isOpen, setIsOpen }) => {
  return (
    <Popup isOpen={isOpen} setIsOpen={setIsOpen}>
      <PutOnSalePopup />
    </Popup>
  );
};

const PutOnSalePopup = () => {
  const loading = `${BACKENDMEDIAURL}/loaders/loading.svg`;
  return (
    <>
      <img className="rotating" src={loading} style={{ marginTop: 20 }} />
      <h2>{__("Please wait while we put it on Sale", SLUG)}</h2>
    </>
  );
};
