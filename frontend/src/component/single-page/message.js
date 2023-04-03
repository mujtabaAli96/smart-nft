import React from "react";
import { SLUG } from "../../../../common/store";
import { SuccessNotification } from "../../../../common/component/notification/success";
import { WarningNotification } from "../../../../common/component/notification/warning";
const { __ } = wp.i18n;

export const OwnerMessage = ({ data }) => {
  if (data.loading) return null;

  const { nftInfo, web3Provider } = data;
  let isOwner = nftInfo.owners.includes(web3Provider.account[0]?.toLowerCase());

  if (!isOwner) return null;
  return <SuccessNotification message={__("You already own this NFT", SLUG)} />;
};

export const NotForSaleMessage = ({ data }) => {
  if (data.loading) return null;

  const { nftInfo, web3Provider } = data;
  let isOwner = nftInfo.owners.includes(web3Provider.account[0]?.toLowerCase());

  if (nftInfo.isListed === "true" || isOwner) return null;

  return <WarningNotification message={__("This NFT is not for sell", SLUG)} />;
};
