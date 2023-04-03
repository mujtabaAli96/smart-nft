import React from "react";
import { createRoot } from "react-dom/client";
import TopCollector from "../component/top-collector/top-collector";

const App = () => {
  return <TopCollector />;
};

const inisialfn = () => {
  const container = document.getElementById("smartnft-top-collector-root");

  if (container) {
    const appRoot = createRoot(container);
    appRoot.render(<App />);
  }
};
//Add this fn in window only to use in Evementor builder. Direct called inside backend/inc/elementor/add-nft-form.php widgets render fn
window.SMART_NFT_TOP_COLLECTOR_RERUN_APP = inisialfn;

//this fn is necessacry to work the script in builder;
//if no need builder support then call the `wholeFn()` directly without `refTimer()` fn;
let INTERVAL = 300;
let timeToMakeNextRequest = 0;
function rafTimer(time) {
  if (timeToMakeNextRequest <= time) {
    timeToMakeNextRequest = time + INTERVAL;
    const widgets = document.querySelector("#smartnft-top-collector-root");

    if (widgets) {
      inisialfn();
      return;
    }
  }
  requestAnimationFrame(rafTimer);
}
requestAnimationFrame(rafTimer);
