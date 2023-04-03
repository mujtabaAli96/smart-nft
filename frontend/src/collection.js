import React from "react";
import { createRoot } from "react-dom/client";
import { Collections } from "./component/collection/collections";

const App = () => {
  return (
    <div id="app">
      <Collections />
    </div>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);
if (container) {
  appRoot.render(<App />);
}
