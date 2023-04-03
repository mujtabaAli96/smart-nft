import React from "react";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

export const NFTsNotFound = ({ createnft }) => {
  return (
    <div style={{ marginTop: 40, textAlign: "center" }}>
      <h2>{__("No NFTs has been Found", SLUG)}</h2>
      <p>
        {__("No NFTs has been added yet. Please try to create a new", SLUG)}
      </p>
      <button className="sn-action-button" onClick={(e) => createnft(true)}>
        + {__("Create New", SLUG)}
      </button>
    </div>
  );
};

