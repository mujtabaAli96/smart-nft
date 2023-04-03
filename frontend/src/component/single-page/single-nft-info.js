import React from "react";
import { useNftInfo } from "../../hooks/useNftInfo";
import { setMetaInfoInHeaderForSocialShare } from "../../../../common/utils/utils";
import { NftPreview } from "./preview";
import { NftName } from "./name";
import { OwnerAndCreator, OwnerAndCreatorLoader } from "./creator-owner";
import { SingleNFtInfoTabs } from "./tabs";
import { LikeComponent } from "./like";
import { ShareComponent } from "./share";
import { CategoryComponent } from "./category";
import { Price } from "./price";
import { Erc1155Price } from "./erc1155-price";
import { BuyBtn } from "./buy";
import { BuyBtnErc1155 } from "./buy-1155";
import { Erc1155PutonSell } from "./putonsell-erc1155";
import { OwnerMessage, NotForSaleMessage } from "./message";
import { PutonSell } from "./putonsell";
import { RemoveFromSell } from "./removefromsell";
import { Erc1155RemoveFromSell } from "./erc1155-removefromsell";
import { UnlockableContentPopup } from "./unlockable-content";
import DropDown from "./dropdown";
import { ViewsCountComponent } from "./views";
import { NftSuggestions } from "./nftSuggestions";
import { AuctionIntegrate } from "./auction-integrate";

const SingleNFtInfo = () => {
  const postId = local.postId;

  const data = useNftInfo(postId);
  console.log(data);

  //set meta data in header
  if (!data.loading) {
    setMetaInfoInHeaderForSocialShare({
      imgUrl: data.nftInfo?.thumbnailMediaUrl?.attach_url,
      title: data?.nftInfo?.meta?.name,
    });
  }

  return (
    <>
      <div className="single-nft-info">
        <div className="image-section">
          <NftPreview data={data} />
          <SingleNFtInfoTabs data={data} />
        </div>
        <div className="purchase-section">
          <NftName data={data} />
          {data.loading ? (
            <OwnerAndCreatorLoader />
          ) : (
            <OwnerAndCreator data={data} />
          )}
          <div className="single-nft__like-share">
            <LikeComponent data={data} tokenId={postId} />
            <ShareComponent data={data} />
            <ViewsCountComponent data={data} />
            {!data.loading && <DropDown data={data} />}
          </div>
          <CategoryComponent data={data} />
          {!data.loading && <UnlockableContentPopup data={data} />}
          {!data.loading && data.nftInfo?.auction?.isAuctionSet == "false" ? (
            <div className="buynft">
              <div className="buynft__btns">
                {!data.loading && <Price data={data} />}
                {!data.loading && <Erc1155Price data={data} />}
                {!data.loading && <BuyBtn data={data} />}
                {!data.loading && <PutonSell data={data} />}
                {!data.loading && <RemoveFromSell data={data} />}
                {!data.loading && <BuyBtnErc1155 data={data} />}
                {!data.loading && <Erc1155PutonSell data={data} />}
                {!data.loading && <Erc1155RemoveFromSell data={data} />}
              </div>
            </div>
          ) : null}
          {!data.loading && <AuctionIntegrate data={data} />}
          <OwnerMessage data={data} />
          <NotForSaleMessage data={data} />
        </div>
      </div>
      <div className="single-nft-info nft-suggestions">
        {!data.loading && <NftSuggestions data={data} />}
      </div>
    </>
  );
};

export { SingleNFtInfo };
