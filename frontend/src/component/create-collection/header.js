import React, { useContext } from "react";
import { CreateCollectionContext } from "./state";

const NoProfile = () => (
  <div className="create-collection__profile-loading"></div>
);
const NoBanner = () => (
  <div className="create-collection__banner-loading"></div>
);

const Header = () => {
  const { state, dispatch } = useContext(CreateCollectionContext);

  return (
    <div className="create-collection__header">
      {state.bannerImg ? (
        <figure
          className="create-collection__header-banner"
          style={{ backgroundImage: `url(${state.bannerImg})` }}
        ></figure>
      ) : (
        <NoBanner />
      )}
      {state.profileImg ? (
        <figure
          className="create-collection__header-profile"
          style={{ backgroundImage: `url(${state.profileImg})` }}
        ></figure>
      ) : (
        <NoProfile />
      )}
    </div>
  );
};

export default Header;
