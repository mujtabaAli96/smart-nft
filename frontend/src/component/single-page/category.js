import React from "react";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

export const CategoryComponent = ({ data }) => {
  if (data.loading) return;
  const { nftCategory } = data;

  if (!nftCategory.name || !nftCategory.url) return null;
  return (
    <div className="single-nft__category-name">
      <span>{__("Category : ", SLUG)}</span>
      <a href={nftCategory.url}>{nftCategory.name}</a>
    </div>
  );
};
