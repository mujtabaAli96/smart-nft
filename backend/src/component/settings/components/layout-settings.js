import React, { useState, useEffect, useContext } from "react";
import { SLUG } from "../../../../../common/store";
import useSettings from "../../../../../common/hook/useSettings.hook";
import { successMessage } from "../../../../../common/component/message/success";
import { NftPages } from "./layout-settings/nftpages";
import { CollectionPages } from "./layout-settings/collections";
import { CategoryPages } from "./layout-settings/categories";
import { ProfilePages } from "./layout-settings/profile";
import { SettingsContext } from "./layout-settings/state";
import { GeneralLayout } from "./layout-settings/general";
const { __ } = wp.i18n;

export const LayoutSettings = () => {
  const { state, dispatch } = useContext(SettingsContext)

  // layout settings tab settings
  const [innertab, setInnerTab] = useState(1);
  const [isUseEffectRun, setIsUseEffectRun] = useState(false);
  const settingProvider = useSettings();

  useEffect(() => {
    console.log(settingProvider);
    if (settingProvider.loading) return;
    dispatch( { type: "LOAD_ALL_SETTINGS", payload: settingProvider.settings } )
    setIsUseEffectRun(true);
  }, [settingProvider.loading]);

  if (settingProvider.loading || !isUseEffectRun) return <h2>Loading...</h2>;

  const saveSettings = async () => {
    console.log(state)
    await settingProvider.saveSettings({ ...state });
    successMessage(__("Setting saved successfully.", SLUG));
  };

  return (
    <>
      <div className="settings-page__container">
        <div className="settings-page__heading">
          <div>
            <h4>{__("Layout Settings", SLUG)}</h4>
            <p>
              {__(
                "You can configure and setup your necessary layout settings from this menu.",
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
          <div className="settings-page__tabs inner">
            <p
              className={`${"tab-single"} ${innertab == 1 ? "active" : ""}`}
              onClick={() => {
                setInnerTab(1);
              }}
            >
              {__("General", SLUG)}
            </p>
            <p
              className={`${"tab-single"} ${innertab == 2 ? "active" : ""}`}
              onClick={() => {
                setInnerTab(2);
              }}
            >
              {__("NFT pages", SLUG)}
            </p>
            <p
              className={`${"tab-single"} ${innertab == 3 ? "active" : ""}`}
              onClick={() => {
                setInnerTab(3);
              }}
            >
              {__("Collection pages", SLUG)}
            </p>
            <p
              className={`${"tab-single"} ${innertab == 4 ? "active" : ""}`}
              onClick={() => {
                setInnerTab(4);
              }}
            >
              {__("Categories pages", SLUG)}
            </p>
            <p
              className={`${"tab-single"} ${innertab == 5 ? "active" : ""}`}
              onClick={() => {
                setInnerTab(5);
              }}
            >
              {__("Profile pages", SLUG)}
            </p>
          </div>

          {innertab === 1 ? (
            <>
              <GeneralLayout />
            </>
          ) : null}

          {innertab === 2 ? (
            <>
              <NftPages />
            </>
          ) : null}

          {innertab === 3 ? (
            <>
              <CollectionPages />
            </>
          ) : null}
          {innertab === 4 ? (
            <>
              <CategoryPages />
            </>
          ) : null}

          {innertab === 5 ? (
            <>
              <ProfilePages />
            </>
          ) : null}

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
