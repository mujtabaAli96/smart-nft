import React, { useContext } from "react";
import { CreateCategoryContext } from "./state";

const NoProfile = () => (
  <div className="create-category__profile-loading"></div>
);
const NoBanner = () => <div className="create-category__banner-loading"></div>;

const Header = () => {
  const { state, dispatch } = useContext(CreateCategoryContext);

  return (
    <div className="create-category__header">
      {state.bannerImg ? (
        <img className="create-category__header-banner" src={state.bannerImg} />
      ) : (
        <NoBanner />
      )}
      {state.profileImg ? (
        <img
          className="create-category__header-profile"
          src={state.profileImg}
        />
      ) : (
        <NoProfile />
      )}
    </div>
  );
};

export default Header;
