import React from "react";
import useProfile from "../../../hooks/useProfile";
import { OwnersLoader } from "./loader";
import { Profile } from "./profile-markup";

export const Erc721Owners = ({ accountHash }) => {
  const profile = useProfile(accountHash);

  if (profile.isLoading)
    return (
      <div className="owners">
        <OwnersLoader />
      </div>
    );

  return <Profile profile={profile} />;
};
