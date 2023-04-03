import React from "react";

const NoProfile = () => (
  <div className="edit-profile-header__profile-loading"></div>
);
const NoBanner = () => (
  <div className="edit-profile-header__banner-loading"></div>
);

const Profile = ({ img }) => (
  <figure
    className="edit-profile-header__profile"
    style={{ background: `url(${img})` }}
  ></figure>
);

const Banner = ({ img }) => (
  <figure
    className="edit-profile-header__banner"
    style={{ background: `url(${img})` }}
  ></figure>
);

const Header = ({ editeProfileProvider }) => {
  return (
    <div className="edit-profile-header">
      {editeProfileProvider.profileImg ? (
        <Profile img={editeProfileProvider.profileImg} />
      ) : (
        <NoProfile />
      )}

      {editeProfileProvider.bannerImg ? (
        <Banner img={editeProfileProvider.bannerImg} />
      ) : (
        <NoBanner />
      )}
    </div>
  );
};

export { Header };
