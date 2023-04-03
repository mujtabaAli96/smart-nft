import React from "react";
import { SLUG } from "../store";
const { __ } = wp.i18n;

export const NoNftFound = () => {
  return (
    <div className="nonft-found">
      <h3>{__("No NFTs Found", SLUG)}</h3>
      <p>{__("No nft has been found in your search criteria. Please try again", SLUG)}</p>
    </div>
  );
};

export const NoCollectionFound = () => {
  return (
    <div className="nonft-found">
      <h3>{__("No Collections Found", SLUG)}</h3>
      <p>{__("No collection has been found here.", SLUG)}</p>
    </div>
  );
};
