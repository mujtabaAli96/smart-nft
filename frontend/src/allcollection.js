import React, { useReducer } from "react";
import { createRoot } from "react-dom/client";
import {
  AllCollectionContext,
  REDUCER,
  STATE,
} from "./component/all-collection/state";
import AllCollections from "./component/all-collection/AllCollections";

const App = () => {
  const [state, dispatch] = useReducer(REDUCER, STATE);

  return (
    <AllCollectionContext.Provider value={{ state, dispatch }}>
      <div className="app">
          <AllCollections />
      </div>
    </AllCollectionContext.Provider>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);

if (container) {
  appRoot.render(<App />);
}
