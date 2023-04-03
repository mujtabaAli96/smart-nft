import React from "react";
import { createRoot } from "react-dom/client";
import { SingleNFtInfo } from "./component/single-page/single-nft-info";

const App = () => {
  return (
    <div id="app">
      <SingleNFtInfo />
    </div>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);
if (container) {
  appRoot.render(<App />);
}
