import React, { useState, useEffect, useContext } from "react";
import { SLUG } from "../../../../../common/store";
import Switch from "../../../../../common/component/switcher";
import useSettings from "../../../../../common/hook/useSettings.hook";
import { successMessage } from "../../../../../common/component/message/success";
const { __ } = wp.i18n;

export const MediaAndUploads = () => {
  const [ collectionImageSize, setCollectionImageSize ] = useState(2)
  const [ profileImageSize, setProfileImageSize] = useState(2);
  const [ nftImageSize, setNftImageSize] = useState(12);
  const [ thumbQuality, setNftthumbQuality] = useState('medium');

  const settingProvider = useSettings();
  
  const saveSettings = async () => {
    await settingProvider.saveSettings({
        collectionImageSize,
        profileImageSize,
        nftImageSize,
        thumbQuality
    });
    successMessage(__("Settings saved success fully.", SLUG));
  };

  useEffect(() => {
    setCollectionImageSize(parseInt(settingProvider.settings.collectionImageSize || 2));
    setProfileImageSize(parseFloat(settingProvider.settings.profileImageSize || 2));
    setNftImageSize(parseFloat(settingProvider.settings.nftImageSize || 20));
    setNftthumbQuality( settingProvider.settings.thumbQuality || 'medium' );
  }, [settingProvider.loading]);

  if (settingProvider.loading) return <h2>Loading...</h2>;

  return (
    <>
      <div className="settings-page__container">
        <div className="settings-page__heading">
          <div>
            <h4>{__("Media and uploads", SLUG)}</h4>
            <p>
              {__(
                "You can set media settings and upload sizes from here.",
                SLUG
              )}
            </p>
          </div>
          <button
            onClick={(e) => saveSettings()}
            className="button button-primary"
          >
            {__("Save Settings", SLUG)}
          </button>
        </div>

        <div className="settings-page__list-settings">
          <div className="settings-page__list-settings-single">
            <div className="settings-page__list-settings-single__headings">
              <h4>{__("Collection upload sizes", SLUG)}</h4>
              <p>{__("Input colection profile and cover upload sizes in MB (MegaBytes)", SLUG)}</p>
            </div>
            <div className="settings-page__list-settings-single__controls">
                <input
                    onChange={(e) => setCollectionImageSize(e.target.value)}
                    type="text"
                    name="nft-listing-price"
                    value={collectionImageSize}
                />
                  <span className="input-unit">MB</span>

            </div>
          </div>
          <div className="settings-page__list-settings-single">
            <div className="settings-page__list-settings-single__headings">
              <h4>{__("Profile upload sizes", SLUG)}</h4>
              <p>{__("Input profile and cover upload sizes in MB (MegaBytes)", SLUG)}</p>
            </div>
            <div className="settings-page__list-settings-single__controls">
                <input
                    onChange={(e) => setProfileImageSize(e.target.value)}
                    type="text"
                    name="nft-listing-price"
                    value={profileImageSize}
                />
                <span className="input-unit">MB</span>
            </div>
          </div>
          <div className="settings-page__list-settings-single">
            <div className="settings-page__list-settings-single__headings">
              <h4>{__("NFTs upload sizes", SLUG)}</h4>
              <p>{__("Input nfts upload sizes in MB (MegaBytes)", SLUG)}</p>
            </div>
            <div className="settings-page__list-settings-single__controls">
                <input
                    onChange={(e) => setNftImageSize(e.target.value)}
                    type="text"
                    name="nft-listing-price"
                    value={nftImageSize}
                />
                <span className="input-unit">MB</span>
            </div>
          </div>
          <div className="settings-page__list-settings-single">
            <div className="settings-page__list-settings-single__headings">
              <h4>{__("NFT thumbnail quality", SLUG)}</h4>
              <p>{__("Select thumbnail image quality in ALL NFT pages", SLUG)}</p>
            </div>
            <div className="settings-page__list-settings-single__controls">
              <select
                value={thumbQuality}
                onChange={(e) => setNftthumbQuality(e.target.value)}
              >
                <option value={"thumbnail"}>{__("Low - 150x150", SLUG)}</option>
                <option value={"medium"}>{__("Meidum - 300x300", SLUG)}</option>
                <option value={"large"}>{__("High - 1024x1024", SLUG)}</option>
                <option value={"full"}>{__("Best - Actual image", SLUG)}</option>
              </select>
            </div>
          </div>

          {/* Save buttton */}
          <div className="settings-page__list-settings-single">
            <div className="settings-page__list-settings-single__headings"></div>
            <div className="settings-page__list-settings-single__controls">
              <button
                onClick={(e) => saveSettings()}
                className="button button-primary"
              >
                {__("Save Settings", SLUG)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
