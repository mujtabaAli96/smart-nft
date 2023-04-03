import React, { useReducer } from "react";
import { createRoot } from "react-dom/client";

import { StatsHeader } from "./component/statistics/stats-header";
import { StatsFilter } from "./component/statistics/filter";
import { StatsItems } from "./component/statistics/items";
import {
  StatisticsContext,
  INISIAL_STATE,
  REDUCER,
} from "./component/statistics/state";

const App = ({ limit }) => {
  const [state, dispatch] = useReducer(REDUCER, INISIAL_STATE);
  if (!limit) limit = 500;
  return (
    <div id="app">
      <StatisticsContext.Provider value={{ state, dispatch }}>
        <StatsFilter />
        <StatsHeader />
        <StatsItems limit={limit} />
      </StatisticsContext.Provider>
    </div>
  );
};

const collStatsInisialfn = (element, limit) => {
  if (element) {
    const appRoot = createRoot(element);
    appRoot.render(<App limit={limit} />);
  }
};

//Add this fn in window only to use in Evementor builder. Direct called inside backend/inc/elementor/add-nft-form.php widgets render fn
//`SMART_NFT_STATS_RERUN_APP` variable will not available on elementor builder mode
window.SMART_NFT_STATS_RERUN_APP = collStatsInisialfn;

//this fn is necessacry to work the script in builder;
//if no need builder support then call the `wholeFn()` directly without `refTimer()` fn;
let INTERVAL = 300;
let timeToMakeNextRequest = 0;
function rafTimer(time) {
  if (timeToMakeNextRequest <= time) {
    timeToMakeNextRequest = time + INTERVAL;
    const widgets = window.smnft_stats_con_id;

    if (widgets) {
      collStatsInisialfn(widgets, window.SMART_NFT_STATS_LIMIT);
      return;
    }
  }
  requestAnimationFrame(rafTimer);
}
requestAnimationFrame(rafTimer);
