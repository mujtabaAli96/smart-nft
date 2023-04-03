import React, { useState, useEffect } from "react";
import { SLUG } from "../../../../../common/store";
import useSettings from "../../../../../common/hook/useSettings.hook";
import { successMessage } from "../../../../../common/component/message/success";
const { __ } = wp.i18n;

export const APISettings = () => {
  const [infuraIpfsSecret, setInfuraIpfsSecret] = useState("");
  const [infuraProjectId, setInfuraProjectId] = useState("");
  const settingProvider = useSettings();
  console.log(infuraIpfsSecret, infuraProjectId);

  useEffect(() => {
    if (settingProvider.loading) return;

    if (settingProvider.settings.infuraIpfsSecret)
      setInfuraIpfsSecret(settingProvider.settings.infuraIpfsSecret);

    if (settingProvider.settings.infuraProjectId)
      setInfuraProjectId(settingProvider.settings.infuraProjectId);
  }, [settingProvider.loading]);

  if (settingProvider.loading) return <h2>Loading...</h2>;

  const saveSettings = async () => {
    await settingProvider.saveSettings({
      infuraProjectId,
      infuraIpfsSecret,
    });
    successMessage(__("Setting saved successfully.", SLUG));
  };

  return (
    <>
      <h3>{__("Infura API Secrets", SLUG)}</h3>
      <div className="settings-page__main">
        <div className="settings-card__container">
          <div className="settings-card__inner">
            <h4 className="settings-card__heading">
              {__("Infura Project ID", SLUG)}
            </h4>
            <p className="settings-card__desc">
              {__(
                "Keep your project ID hidden. This should never be human-readablein your application.",
                SLUG
              )}
            </p>
            <input
              type="text"
              className="settings-card__input"
              name="settings-name"
              value={infuraProjectId}
              onChange={(e) => setInfuraProjectId(e.target.value)}
            />
            <button
              className="settings-card__save"
              onClick={(e) => saveSettings()}
            >
              {__("Save", SLUG)}
            </button>
            <p className="settings-card__instructions">
              {__("Don't have infura credentials?", SLUG)}{" "}
              <a target="_blank" href="https://infura.io/register">
                {__("Get It From Here", SLUG)}
              </a>
            </p>
          </div>
        </div>
        <div className="settings-card__container">
          <div className="settings-card__inner">
            <h4 className="settings-card__heading">
              {__("Infura Project Secret", SLUG)}
            </h4>
            <p className="settings-card__desc">
              {__(
                "Keep your project ID hidden. This should never be human-readablein your application.",
                SLUG
              )}
            </p>
            <input
              type="text"
              className="settings-card__input"
              name="settings-name"
              value={infuraIpfsSecret}
              onChange={(e) => setInfuraIpfsSecret(e.target.value)}
            />
            <button
              className="settings-card__save"
              onClick={(e) => saveSettings()}
            >
              {__("Save", SLUG)}
            </button>
            <p className="settings-card__instructions">
              {__("Don't have infura credentials?", SLUG)}{" "}
              <a target="_blank" href="https://infura.io/register">
                {__("Get It From Here", SLUG)}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
