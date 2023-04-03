console.log("settings page");
import React, { useReducer, useState } from "react";
import { createRoot } from "react-dom/client";
import { SettingsMain } from "./component/settings/main";
import { SettingsContext, STATE, REDUCER } from "./component/settings/components/layout-settings/state";

const App = () => {
  const [ state, dispatch ] = useReducer( REDUCER, STATE )
  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      <div id="app">
        <SettingsMain />
      </div>
    </SettingsContext.Provider>
  );
};

const container = document.getElementById("smartnft-root");
if (container) {
  const appRoot = createRoot(container);
  appRoot.render(<App />);
}
