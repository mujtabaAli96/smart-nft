import React from "react";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

export const SettingsCards = ({ content, type, name, value }) => {
  return (
    <div className="settings-card__container">
      <div className="settings-card__inner">
        <h4 className="settings-card__heading">Infura Project key secret</h4>
        <p className="settings-card__desc">
          Keep your project secret hidden. This should never be human-readable
          in your application.
        </p>
        <input
          type="text"
          className="settings-card__input"
          name="settings-name"
          value="value"
        />
        <button className="settings-card__save" onClick={(e) => saveSettings()}>
          Save
        </button>
        <p className="settings-card__instructions">
          {__("Don't have infura credentials?", SLUG)}
          <a href="#">{__("Get It From Here", SLUG)}</a>
        </p>
      </div>
    </div>
  );
};

const saveSettings = () => {};

const SettingsInputType = ({ type, name, value }) => {
  switch (type) {
    case "text":
      return <input type="text" name={key} value={value} />;
    case "toggle":
      return (
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
      );
    case "dropdown":
      return (
        <select>
          <option>options 1</option>
          <option>options 2</option>
          <option>options 3</option>
          <option>options 4</option>
        </select>
      );
  }
};
export const SectionHeading = ({ content }) => {
  return <h3 className="settings-page__section-heading">{content}</h3>;
};
