import React, { useContext } from "react";
import { SettingsContext } from "../state";
import { SLUG } from "../../../../../../../common/store";
import Switch from "../../../../../../../common/component/switcher";
const { __ } = wp.i18n;

export const CreateNft = () => {
  const { state, dispatch } = useContext(SettingsContext);
  const defaultState = state.nftpages.create;

  const changeState = (property, value) => {
    const temp = {};
    temp[property] = value;
    const newState = { ...defaultState, ...temp };
    dispatch({ type: "CHANGE_NFTS_CREATE", payload: newState });
  };

  return (
    <>
      <h2 className="settings-page__list-settings__section-heading">
        {__("Create NFT page", SLUG)}
      </h2>
      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Free Minting", SLUG)}</h4>
          <p>{__("Allow Users to do free minting", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.freeminting}
            handleToggle={(e) => changeState("freeminting", e.target.checked)}
            id={"freeminting"}
          />
        </div>
      </div>
      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Unlockable Content", SLUG)}</h4>
          <p>{__("Allow users to create unlockable content", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.unlockable}
            handleToggle={(e) => changeState("unlockable", e.target.checked)}
            id={"unlockable"}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Split Payment", SLUG)}</h4>
          <p>{__("Enable/Disable split payment system.", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.splitPayment}
            handleToggle={(e) => changeState("splitPayment", e.target.checked)}
            id={"splitPayment"}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Royalty", SLUG)}</h4>
          <p>{__("Enable/Disable royalty system.", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.royalty}
            handleToggle={(e) => changeState("royalty", e.target.checked)}
            id={"royalty"}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Categories", SLUG)}</h4>
          <p>{__("Enable/Disable categories system.", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.category}
            handleToggle={(e) => changeState("category", e.target.checked)}
            id={"category"}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Collection", SLUG)}</h4>
          <p>{__("Enable/Disable collection.", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.collection}
            handleToggle={(e) => changeState("collection", e.target.checked)}
            id={"collection"}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Properties", SLUG)}</h4>
          <p>{__("Show/hide properties options", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.properties}
            handleToggle={(e) => changeState("properties", e.target.checked)}
            id={"properties"}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Labels", SLUG)}</h4>
          <p>{__("Show/hide labels options", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.labels}
            handleToggle={(e) => changeState("labels", e.target.checked)}
            id={"labels"}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Stats", SLUG)}</h4>
          <p>{__("Show/hide stats options", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.stats}
            handleToggle={(e) => changeState("stats", e.target.checked)}
            id={"stats"}
          />
        </div>
      </div>
    </>
  );
};

