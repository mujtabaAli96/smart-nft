import React from "react";
import { Icons } from "../../../../../common/component/icons";
import { SLUG } from "../../../../../common/store";
const { __ } = wp.i18n;

export const Overview = ({ data }) => {
  if (data.loading) return null;
  const nftInfo = data.nftInfo;
  let mintHash = data.nftTxHash?.find((cur) => cur.hash != "0x000000000000");
  const network = nftInfo.selectedContract?.network;

  if (nftInfo.isFreeMinting === "true") {
    mintHash = null;
  }

  return (
    <div className="des-tab">
      {nftInfo?.meta?.description && (
        <h4 className="header-one des-tab__title">{__("Description", SLUG)}</h4>
      )}

      <p className="des-tab__des">{nftInfo?.meta?.description}</p>

      {nftInfo?.royalty !== "0" && (
        <h4 className="header-one des-tab__title royalties">
          {__("Royalties ", SLUG)}
          <span>{parseInt(nftInfo.royalty) / 100}%</span>
        </h4>
      )}

      <div className="des-tab__details-box">
        <h4 className="header-two" style={{ marginBottom: 15 }}>
          {__("Details", SLUG)}
        </h4>
        <ul>
          <li>
            {Icons.ether}
            <p>{nftInfo.standard}</p>
          </li>

          {mintHash ? (
            <li>
              {Icons.etherscan}
              <a
                href={`${network.blockUrl}tx/${mintHash?.hash}`}
                target="_blank"
              >
                {__(`View on ${network.scanName}`, SLUG)}
              </a>
              {Icons.arrowout}
            </li>
          ) : null}
          <li>
            {Icons.eye}
            <a href={nftInfo?.mediaUrl} target="_blank">
              {__("Open original on IPFS", SLUG)}
            </a>
            {Icons.arrowout}
          </li>
        </ul>
      </div>
    </div>
  );
};
