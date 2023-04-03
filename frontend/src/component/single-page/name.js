import React from "react";

export const NftName = ({ data }) => {
  if (data.loading) return <NftNameLoader />;

  const { nftCollection } = data;
  const { nftInfo } = data;

  return (
    <div className="single-nft-pro-info">
      <div className="single-nft__name-con">
        <a href={nftCollection?.link}>{nftCollection?.name}</a>
        <h3 className="header-one single-nft__name">{nftInfo?.meta?.name}</h3>
      </div>
    </div>
  );
};

const style = { marginBottom: "10px" };

const NftNameLoader = () => {
  return (
    <div className="single-nft-pro-info">
      <div className="single-nft__name-con">
        <span
          style={style}
          className="skeleton-box single-nft-skeleton__creator-name"
        ></span>
        <span className="skeleton-box single-nft-skeleton__name"></span>
      </div>
    </div>
  );
};
