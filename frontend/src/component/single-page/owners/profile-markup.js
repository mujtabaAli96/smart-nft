import React from "react";
import { SITE_ROOT } from "../../../../../common/store";

let randomColor = Math.floor(Math.random()*16777215).toString(16);
let blankStyle = {
  backgroundColor: `#${randomColor}`
};

export const Profile = ({ profile }) => (
  <div className="owner">
    {profile.profileImg ? (
      <img className="single-nft__owner-img" src={profile.profileImg} />
    ) : (
      <span className="single-nft-skeleton__profile-img" style={blankStyle}></span>
    )}
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
);
