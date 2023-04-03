import React from "react";
import { successMessage } from "../../../../common/component/message/success";
import {
  SLUG,
  FRONTENDMEDIAURL,
  SITE_ROOT,
  SETTINGS,
} from "../../../../common/store";
import useWeb3provider from "../../../../common/hook/wallet.hook";
import { Icons } from "../../../../common/component/icons";
const { __ } = wp.i18n;

const NoProfile = () => <div className="profile-header__profile-loading"></div>;
const NoBanner = () => <div className="profile-header__banner-loading"></div>;

const Profile = ({ img }) => (
  <figure
    className="profile-header__profile"
    style={{ background: `url(${img})` }}
  ></figure>
);

const Banner = ({ img }) => (
  <figure
    className="profile-header__banner"
    style={{ background: `url(${img})` }}
  ></figure>
);

const Name = ({ name, accountAdd }) => {
  if (!name && accountAdd) {
    return (
      <h2 className="profile-header__accAdd">
        {accountAdd?.substring(0, 5)}...
        {accountAdd?.substring(accountAdd.length - 4)}
      </h2>
    );
  }
  return <h2 className="profile-header__name">{name}</h2>;
};

const AccountAddress = ({ address }) => {
  //gurd close for dashboard controll
  if (SETTINGS.profile?.single?.address === "false") return null;

  const copyaddress = (address) => {
    navigator.clipboard.writeText(address);
    successMessage(__("Address copied to clipboard", SLUG));
  };

  return (
    <p className="profile-header__address">
      {address && (
        <p>
          {__("Address: ", SLUG)}
          {address.substring(0, 5)}...{address.substring(address.length - 4)}
          <img
            src={`${FRONTENDMEDIAURL}copy.svg`}
            onClick={(e) => copyaddress(address)}
            alt="copy icon"
          />
        </p>
      )}
    </p>
  );
};

const EditOption = () => {
  return (
    <div className="profile-header__edit">
      <a href={`${SITE_ROOT}/edit-profile/`}>
        <button className="profile-header__edit-btn">
          {__("Edit Profile")}
        </button>
      </a>
    </div>
  );
};

const SocialIcons = ({ socialprofiles }) => {
  //gurd close for dashboard controll
  if (SETTINGS.profile?.single?.links === "false") return null;

  if (!socialprofiles || undefined == socialprofiles || socialprofiles == "")
    return;

  return (
    <div className="profile-header__socials">
      {socialprofiles.map(
        (elem, index) =>
          elem.url !== "" && (
            <a href={elem.url} target="_blank">
              <span className="social-profiles-tooltip">{elem.name}</span>
              {Icons[elem.name]}
            </a>
          )
      )}
    </div>
  );
};

const Header = ({ profileProvider, address }) => {
  const web3Provider = useWeb3provider();

  if (profileProvider.isLoading || web3Provider.loading)
    return (
      <div className="profile-header" style={{ marginBottom: 70 }}>
        <div>
          <NoProfile />
          <NoBanner />
        </div>
      </div>
    );

  const hasEditPermision =
    profileProvider.accountHash.toLowerCase() ===
    web3Provider.account[0]?.toLowerCase();

  return (
    <div className="profile-header">
      <div>
        {profileProvider.profileImg ? (
          <Profile img={profileProvider.profileImg} />
        ) : (
          <NoProfile />
        )}

        {profileProvider.bannerImg ? (
          <Banner img={profileProvider.bannerImg} />
        ) : (
          <NoBanner />
        )}
        <div className="profile-header__accAndEdit">
          <div>{hasEditPermision ? <EditOption /> : ""}</div>
          <SocialIcons socialprofiles={profileProvider.socialProfiles} />
        </div>
      </div>
      <div className="profile-header__name-acc-con">
        <Name
          name={profileProvider.name}
          accountAdd={web3Provider.account[0]}
        />
        {profileProvider.shortBio && profileProvider.shortBio != "" && (
          <p style={{ marginBottom: "20px" }}>{profileProvider.shortBio}</p>
        )}
        <AccountAddress address={address} />
      </div>
    </div>
  );
};

export { Header };
