import React from "react";
import { createRoot } from "react-dom/client";
import { CreateNftIntegratiton } from "./component/create-nft/create-nft-integrate";

const App = () => {
  return <CreateNftIntegratiton />;
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);
if (container) {
  appRoot.render(<App />);
}
