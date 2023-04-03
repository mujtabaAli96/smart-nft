import React from "react";
import { SLUG } from "../../../../common/store";
import { NftList } from "./nft-table";
const { __ } = wp.i18n;

const NftListIndex = ({ setIsFormOpen }) => {
  return (
    <div className="nft-list">
      <div className="nft-list__heading">
        <h2>{__("All NFT", SLUG)}</h2>
        <button onClick={() => setIsFormOpen(true)}>
          + {__("Create New", SLUG)}
        </button>
      </div>
      <NftList createnft={setIsFormOpen} />
    </div>
  );
};

export { NftListIndex };
