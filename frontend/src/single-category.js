console.log("Single category page");
import React from "react";
import { createRoot } from "react-dom/client";
import SingleCategory from "./component/single-category/category";

const App = () => {
  return (
    <div id="app">
      <SingleCategory />
    </div>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);
if (container) {
  appRoot.render(<App />);
}
