import React, { useState, useEffect, useContext } from "react";
import { SLUG } from "../../../../../common/store";
import Switch from "../../../../../common/component/switcher";
import useSettings from "../../../../../common/hook/useSettings.hook";
import { successMessage } from "../../../../../common/component/message/success";
const { __ } = wp.i18n;

export const FeeAndCharges = () => {
  const [listingPrice, setListingPrice] = useState(0);
  const [fixedListingPriceForCustomCoin, setFixedListingPriceForCustomCoin] =
    useState(0);
  const [listingType, setListingType] = useState(2); // 2 means fixed price 1 means % price
  const [listingPriceActive, setListingPriceActive] = useState(true);

  const [royalityActive, setRoyalityActive] = useState(true);

  const settingProvider = useSettings();

  const saveSettings = async () => {
    await settingProvider.saveSettings({
      listingType,
      listingPrice,
      fixedListingPriceForCustomCoin,
      royalityActive,
      listingPriceActive,
    });
    successMessage(__("Settings saved success fully.", SLUG));
  };

  useEffect(() => {
    setListingType(parseInt(settingProvider.settings.listingType || 2));
    setListingPrice(parseFloat(settingProvider.settings.listingPrice || 0));
    setFixedListingPriceForCustomCoin(
      settingProvider?.settings?.fixedListingPriceForCustomCoin || 0
    );
    setRoyalityActive(
      settingProvider.settings?.royalityActive === "true" ? true : false
    );
    setListingPriceActive(
      settingProvider.settings?.listingPriceActive === "true" ? true : false
    );
  }, [settingProvider.loading]);

  if (settingProvider.loading) return <h2>Loading...</h2>;

  return (
    <>
      <div className="settings-page__container">
        <div className="settings-page__heading">
          <div>
            <h4>{__("Fees and Charges Settings", SLUG)}</h4>
            <p>
              {__(
                "You can configure and setup your fees add charges from this menu.",
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
              <h4>{__("Listing Price", SLUG)}</h4>
              <p>{__("Start or stop listing price system", SLUG)}</p>
            </div>
            <div className="settings-page__list-settings-single__controls">
              <Switch
                isOn={listingPriceActive}
                handleToggle={(e) => setListingPriceActive(e.target.checked)}
                id={"listingPriceActive"}
              />
            </div>
          </div>

          {listingPriceActive && (
            <>
              <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                  <h4>{__("Nft listing price type", SLUG)}</h4>
                  <p>
                    {__(
                      "Listing price can be fixed price or % (percentage) depend on nft price",
                      SLUG
                    )}
                  </p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(parseInt(e.target.value))}
                  >
                    <option value={2}>{__("Fixed price", SLUG)}</option>
                    <option value={1}>
                      {__("% (percentage) price", SLUG)}
                    </option>
                  </select>
                </div>
              </div>
              {listingType == 2 && (
                <div className="settings-page__list-settings-single">
                  <div className="settings-page__list-settings-single__headings">
                    <h4>{__("Nft listing price", SLUG)}</h4>
                    <p>
                      {__(
                        "Set nft listing price. Fixed price must be in Ether/other default network currency.",
                        SLUG
                      )}
                    </p>
                  </div>
                  <div className="settings-page__list-settings-single__controls">
                    <input
                      onChange={(e) => setListingPrice(e.target.value)}
                      type="text"
                      name="nft-listing-price"
                      value={listingPrice}
                    />
                  </div>
                </div>
              )}

              {listingType == 1 && (
                <div className="settings-page__list-settings-single">
                  <div className="settings-page__list-settings-single__headings">
                    <h4>{__("Nft listing price", SLUG)}</h4>
                    <p>
                      {__(
                        "Set nft listing price. % price will be calculate depending on nft price.",
                        SLUG
                      )}
                    </p>
                  </div>
                  <div className="settings-page__list-settings-single__controls">
                    <input
                      onChange={(e) => setListingPrice(e.target.value)}
                      type="text"
                      name="nft-listing-price"
                      value={listingPrice}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="settings-page__list-settings-single">
            <div className="settings-page__list-settings-single__headings">
              <h4>{__("Nft listing price for bep20/erc-20 token", SLUG)}</h4>
              <p>
                {__(
                  "Set nft listing price. fixed price for bep20/erc-20 coin.",
                  SLUG
                )}
              </p>
            </div>
            <div className="settings-page__list-settings-single__controls">
              <input
                onChange={(e) =>
                  setFixedListingPriceForCustomCoin(e.target.value)
                }
                type="text"
                name="nft-listing-price"
                value={fixedListingPriceForCustomCoin}
              />
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
