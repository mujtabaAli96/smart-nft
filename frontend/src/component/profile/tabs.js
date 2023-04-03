import React, { useState, useContext } from "react";
import { FilterContext } from "./state";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { state, dispatch } = useContext(FilterContext);

  const dispachHelper = (type, payload, tabId) => {
    if (payload === "COLLECTIONS") {
      dispatch({ type: "COLLECTIONS_LOADING", payload: true });
    } else {
      dispatch({ type: "LOADING", payload: true });
    }

    dispatch({ type: type, payload: payload });
    dispatch({ type: "CHANGE_PAGE", payload: 1 });
    setActiveTab(tabId);
  };

  const changeTab = (tabId) => {
    if (activeTab == tabId) return null;
    switch (tabId) {
      case 1:
        dispachHelper("TAB_CHANGE", "ALL_TAB", 1);
        break;
      case 2:
        dispachHelper("TAB_CHANGE", "OWNED", 2);
        break;
      case 3:
        dispachHelper("TAB_CHANGE", "CREATED", 3);
        break;
      case 4:
        dispachHelper("TAB_CHANGE", "COLLECTIONS", 4);
        break;
      default:
        dispachHelper("TAB_CHANGE", "ALL_TAB", 1);
        break;
    }
  };

  return (
    <div className="profile__tabs">
      <span
        onClick={() => changeTab(1)}
        className={activeTab == 1 ? "active" : ""}
      >
        {__("All", SLUG)}
      </span>
      <span
        onClick={() => changeTab(2)}
        className={activeTab == 2 ? "active" : ""}
      >
        {__("Owned", SLUG)}
      </span>
      <span
        onClick={() => changeTab(3)}
        className={activeTab == 3 ? "active" : ""}
      >
        {__("Created", SLUG)}
      </span>
      <span
        onClick={() => changeTab(4)}
        className={activeTab == 4 ? "active" : ""}
      >
        {__("Collections", SLUG)}
      </span>
    </div>
  );
};

export default Tabs;
