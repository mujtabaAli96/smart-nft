import React from "react";
import useProfile from "../../hooks/useProfile";
import { SITE_ROOT } from "../../../../common/store";

const CreatorOrOwnerLoader = () => {
  return (
    <div className="owner">
      <span className="skeleton-box single-nft-skeleton__profile-img"></span>
      <div>
        <span className="skeleton-box single-nft-skeleton__creator-label"></span>
        <span className="skeleton-box single-nft-skeleton__creator-name"></span>
      </div>
    </div>
  );
};

const ProfileMarkup = ({ profile }) => {
  let randomColor = Math.floor(Math.random()*16777215).toString(16);
  let blankStyle = {
    backgroundColor: `#${randomColor}`
  };
  return (
    <div className="owner">
      {profile.profileImg ? (
        <img className="single-nft__owner-img" src={profile.profileImg} />
      ) : (
        <span className="single-nft-skeleton__profile-img" style={blankStyle}></span>
      )}
      <div>
        <span className="creator-label">{profile.label}</span>

        <a href={`${SITE_ROOT}/profile/${profile.accountHash?.toLowerCase()}`}>
          {profile?.name ? (
            <p className="single-nft__creator-name">{profile?.name}</p>
          ) : (
            <p className="single-nft__creator-name">
              {profile?.accountHash?.slice(0, 7)} ...
              {profile?.accountHash?.slice(profile.accountHash.length - 4)}
            </p>
          )}
        </a>
      </div>
    </div>
  );
};

export const OwnerAndCreatorLoader = () => (
  <div className="creator_and_owner_con">
    <CreatorOrOwnerLoader />
    <CreatorOrOwnerLoader />
  </div>
);

export const OwnerAndCreator = ({ data }) => {
  const { nftInfo } = data;

  const ownerProfile = useProfile(nftInfo.owners[0]);
  const creatorProfile = useProfile(nftInfo.creator);

  return (
    <div className="creator_and_owner_con">
      {nftInfo.standard !== "Erc1155" && (
        <>
          {ownerProfile.isLoading ? (
            <CreatorOrOwnerLoader />
          ) : (
            <ProfileMarkup profile={{ ...ownerProfile, label: "Owner" }} />
          )}
        </>
      )}
      {creatorProfile.isLoading ? (
        <CreatorOrOwnerLoader />
      ) : (
        <ProfileMarkup profile={{ ...creatorProfile, label: "Creator" }} />
      )}
    </div>
  );
};
