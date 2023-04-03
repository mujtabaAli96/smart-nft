import React, { useState } from "react";
import { SharePopup } from "../../../../common/component/popup";
import { FRONTENDMEDIAURL, SLUG, SETTINGS } from "../../../../common/store";
import { Icons } from "../../../../common/component/icons";
const { __ } = wp.i18n;

export const ShareComponent = ({ data }) => {
  //gurd close for dashborad controll
  //if (SETTINGS.nftpages?.single?.sharebtn === "false") return;

  //main component code
  const [shareOpen, setShareOpen] = useState(false);

  if (data.loading)
    return (
      <span
        className="skeleton-box"
        style={{ width: 50, borderRadius: 10, marginLeft: 20 }}
      ></span>
    );

  return (
    <div className="single-nft__share-section">
      <SharePopup
        setShareOpen={setShareOpen}
        isOpen={shareOpen}
        nftInfo={data.nftInfo}
      />
      <span onClick={(e) => setShareOpen(true)}>
        {Icons.share}
        {__(" Share", SLUG)}
      </span>
    </div>
  );
};
