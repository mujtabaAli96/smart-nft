import React, { useReducer } from "react";
import { createRoot } from "react-dom/client";
import { FilterContext, REDUCER, STATE } from "./component/all-nft/state";
import AllNfts from "./component/all-nft/AllNfts";

const App = () => {
  const [state, dispatch] = useReducer(REDUCER, STATE);

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      <div className="app">
        <div className="all-nft-main-con">
          <AllNfts />
        </div>
      </div>
    </FilterContext.Provider>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);

if (container) {
  appRoot.render(<App />);
}
