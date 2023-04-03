import React, { useState } from "react";
import { SLUG } from "../../../../common/store";
import { GeneralSettings } from "./components/general-settings";
import { LayoutSettings } from "./components/layout-settings";
import { APISettings } from "./components/api-settings";
import { FeeAndCharges } from "./components/fees";
import { Tools } from "./components/tools";
import { MediaAndUploads } from "./components/uploads";
import { Styling } from "./components/styling";
const { __ } = wp.i18n;

export const SettingsMain = () => {
  const [tab, setTab] = useState(1);
  const gettabs = () => {
    switch (tab) {
      case 1:
        return <GeneralSettings />;
      case 2:
        return <LayoutSettings />;
      case 21:
        return <Styling />;
      case 3:
        return <APISettings />;
      case 4:
        return <FeeAndCharges />;
      case 5:
        return <Tools />;
      case 6:
        return <MediaAndUploads />;
    }
  };
  return (
    <div>
      <div className="settings-page__tabs">
        <p
          className={`${"tab-single"} ${tab == 1 ? "active" : ""}`}
          onClick={() => {
            setTab(1);
          }}
        >
          {__("General Settings", SLUG)}
        </p>
        <p
          className={`${"tab-single"} ${tab == 2 ? "active" : ""}`}
          onClick={() => {
            setTab(2);
          }}
        >
          {__("Layout Settings", SLUG)}
        </p>
        <p
          className={`${"tab-single"} ${tab == 21 ? "active" : ""}`}
          onClick={() => {
            setTab(21);
          }}
        >
          {__("Styling", SLUG)}
        </p>
        <p
          className={`${"tab-single"} ${tab == 3 ? "active" : ""}`}
          onClick={() => {
            setTab(3);
          }}
        >
          {__("API Settings", SLUG)}
        </p>
        <p
          className={`${"tab-single"} ${tab == 4 ? "active" : ""}`}
          onClick={() => {
            setTab(4);
          }}
        >
          {__("Fees and charges", SLUG)}
        </p>
        <p
          className={`${"tab-single"} ${tab == 5 ? "active" : ""}`}
          onClick={() => {
            setTab(5);
          }}
        >
          {__("Tools", SLUG)}
        </p>
        <p
          className={`${"tab-single"} ${tab == 6 ? "active" : ""}`}
          onClick={() => {
            setTab(6);
          }}
        >
          {__("Media & uploads", SLUG)}
        </p>
      </div>
      <div className="settings-page__tab">{gettabs()}</div>
    </div>
  );
};
