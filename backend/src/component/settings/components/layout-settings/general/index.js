import React, { useContext } from "react";
import { SettingsContext } from "../state";
import { SLUG } from "../../../../../../../common/store";
const { __ } = wp.i18n;

export const GeneralLayout = () => {
  const { state, dispatch } = useContext(SettingsContext);
  const defaultState = state.general;

  const changeState = (property, value) => {
    console.log(value);
    const temp = {};
    temp[property] = value;
    const newState = { ...defaultState, ...temp };
    dispatch({ type: "CHANGE_GENERAL_STATE", payload: newState });
  };

  return (
    <>
      <h2 className="settings-page__list-settings__section-heading">
        {__("General Settings", SLUG)}
      </h2>
      <div className="settings-page__list-settings-single">
        <div className="settings-page__list-settings-single__headings">
          <h4>{__("Load more type", SLUG)}</h4>
          <p>{__("Select method for loading more items", SLUG)}</p>
        </div>
        <div className="settings-page__list-settings-single__controls">
          <select
            value={defaultState.loadmore}
            onChange={(e) => changeState("loadmore", e.target.value)}
          >
            <option value={"pagination"}>{__("Pagination", SLUG)}</option>
            <option value={"infinite"}>{__("Infinite scroll", SLUG)}</option>
          </select>
        </div>
      </div>
    </>
  );
};
