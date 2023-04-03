import React, { useContext } from "react";
import { SettingsContext } from "../state";
import { SLUG } from "../../../../../../../common/store";
import Switch from "../../../../../../../common/component/switcher";
const { __ } = wp.i18n;
export const AllNfts = () => {
  const { state, dispatch } = useContext(SettingsContext);
  const defaultState = state.nftpages.all;

  console.log(state);

  const changeState = (property, value) => {
    const temp = {};
    temp[property] = value;
    const newState = { ...defaultState, ...temp };
    dispatch({ type: "CHANGE_NFTS_ALL", payload: newState });
  };

  return (
    <>
      <h2 className="settings-page__list-settings__section-heading">
        {__("All NFT page", SLUG)}
      </h2>
      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Columns Settings", SLUG)}</h4>
          <p>{__("Select number of columns to show on All NFT page", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <select
            value={defaultState.cols}
            onChange={(e) => changeState("cols", parseInt(e.target.value))}
          >
            <option value={1}>{__("1 column", SLUG)}</option>
            <option value={2}>{__("2 columns", SLUG)}</option>
            <option value={3}>{__("3 columns", SLUG)}</option>
            <option value={4}>{__("4 columns", SLUG)}</option>
            <option value={5}>{__("5 columns", SLUG)}</option>
            <option value={6}>{__("6 columns", SLUG)}</option>
            <option value={7}>{__("7 columns", SLUG)}</option>
            <option value={8}>{__("9 columns", SLUG)}</option>
            <option value={9}>{__("10 columns", SLUG)}</option>
          </select>
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Show NFTs per page", SLUG)}</h4>
          <p>{__("Input the number of nts to show per page", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <input
            onChange={(e) => changeState("perpage", parseInt(e.target.value))}
            type="number"
            name="nft-per-page"
            value={defaultState.perpage}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Page width", SLUG)}</h4>
          <p>{__("Input the value of page width in px", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <input
            onChange={(e) => changeState("width", parseInt(e.target.value))}
            type="number"
            name="width"
            value={defaultState.width}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Searchbar", SLUG)}</h4>
          <p>{__("Show nft searchbar", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.search}
            handleToggle={(e) => changeState("search", e.target.checked)}
            id={"all-nft-search"}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Filter controls", SLUG)}</h4>
          <p>{__("Show nft filters", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.filter}
            handleToggle={(e) => changeState("filter", e.target.checked)}
            id={"all-nft-filter"}
          />
        </div>
      </div>

      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Filter toggle", SLUG)}</h4>
          <p>{__("Set filter toggle open/closed. Default is open", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <Switch
            isOn={defaultState.filterToggle}
            handleToggle={(e) => changeState("filterToggle", e.target.checked)}
            id={"all-nft-filterToggle"}
          />
        </div>
      </div>
    </>
  );
};
