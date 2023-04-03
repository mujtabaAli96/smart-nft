import React, { useState, useEffect } from "react";
import { SLUG } from "../../../../../common/store";
import useSettings from "../../../../../common/hook/useSettings.hook";
import { successMessage } from "../../../../../common/component/message/success";
const { __ } = wp.i18n;


export const Styling = () => {
  const [pluginmode, setpluginmode] = useState('light');

  const settingProvider = useSettings();

  const saveSettings = async () => {
    await settingProvider.saveSettings({
        pluginmode,
    });
    successMessage(__("Settings saved success fully.", SLUG));
  };

  useEffect(() => {
    setpluginmode(settingProvider.settings.pluginmode || 'light');
  }, [settingProvider.loading]);

  if (settingProvider.loading) return <h2>Loading...</h2>;
  return (
    <>
      <div className="settings-page__container">
        <div className="settings-page__heading">
          <div>
            <h4>{__("Plugin styling settings", SLUG)}</h4>
            <p>
              {__(
                "You can configure your plugin styling from here",
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
                    <h4>{__("Select plugin mode", SLUG)}</h4>
                    <p>
                    {__(
                        "Choose from the options aside",
                        SLUG
                    )}
                    </p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <select
                        value={pluginmode}
                        onChange={(e) => setpluginmode(e.target.value)}
                        >
                        <option value={"light"}>{__("Light Mode", SLUG)}</option>
                        <option value={"dark"}>{__("Dark Mode", SLUG)}</option>
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
