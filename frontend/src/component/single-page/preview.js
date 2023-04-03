import React from "react";

export const NftPreview = ({ data }) => {
  if (data.loading) return <NftPreviewSkelltonLoader nftInfo={data.nftInfo} />;

  return (
    <figure className="single-nft__img-con">
      <ImageMedia nftInfo={data.nftInfo} />
      <AudioMedia nftInfo={data.nftInfo} />
      <VideoMedia nftInfo={data.nftInfo} />
    </figure>
  );
};

const NftPreviewSkelltonLoader = ({ nftInfo }) => {
  return (
    <figure className="single-nft__img-con">
      <span className="skeleton-box single-nft-skeleton__mainimage"></span>
    </figure>
  );
};

const ImageMedia = ({ nftInfo }) => {
  if (!nftInfo.fileType?.startsWith("image")) return null;

  return <img className="single-nft__img" src={nftInfo.mediaUrl} />;
};

const AudioMedia = ({ nftInfo }) => {
  if (!nftInfo.fileType?.startsWith("audio")) return null;

  return (
    <div className="audio-preview">
      <audio
        controlsList="nodownload noplaybackrate"
        controls
        className="single-nft__audio"
        src={nftInfo.mediaUrl}
      />
      <img className="audio-optional-preview" src={nftInfo?.thumbnailMediaUrl?.attach_url} />
    </div>
  );
};

const VideoMedia = ({ nftInfo }) => {
  if (!nftInfo.fileType?.startsWith("video")) return null;

  return (
    <video
      controlsList="nodownload"
      autoPlay
      controls
      className="single-nft__video"
      src={nftInfo.mediaUrl}
    />
  );
};
