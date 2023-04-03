console.log("settings page");
import React, { useReducer, useState } from "react";
import { createRoot } from "react-dom/client";
import { AddonsMain } from "./component/addons";
const App = () => {
  return (
      <div id="app">
        <AddonsMain />
      </div>
  );
};

const container = document.getElementById("smartnft-root");
if (container) {
  const appRoot = createRoot(container);
  appRoot.render(<App />);
}
