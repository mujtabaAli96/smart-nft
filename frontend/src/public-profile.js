//console.log("public-profile page");
import React, { useReducer } from "react";
import { createRoot } from "react-dom/client";
import useProfile from "./hooks/useProfile";
import { Header } from "./component/profile/header";
import { Pagination } from "./component/all-nft/pagination";
import Tabs from "./component/profile/tabs";
import { FilterContext, REDUCER, STATE } from "./component/profile/state";
import UserNfts from "./component/profile/userNfts";
import { SETTINGS } from "../../common/store";

const readProfileAddressFromUrl = () => {
  const url = window.location;
  let id = url.pathname.split("/profile/");
  if (!id.length) throw new Error("No address is found");
  id = id[id.length - 1];

  id = id.replace("/", "");

  return id;
};

const App = () => {
  const acAdd = readProfileAddressFromUrl();
  const profileProvider = useProfile(acAdd, { all: "" });
  const [state, dispatch] = useReducer(REDUCER, STATE);
  console.log("profile provider:", profileProvider);

  const setLoading = () => {
    dispatch({ type: "LOADING", payload: true });
  };

  const changePage = (page) => {
    dispatch({ type: "CHANGE_PAGE", payload: page });
  };

  return (
    <FilterContext.Provider
      value={{ state: { ...state, accAdd: acAdd }, dispatch }}
    >
      <div id="app">
        <div className="smart-nft-profile">
          <Header profileProvider={profileProvider} address={acAdd} />
          <Tabs />
          <UserNfts />
          {SETTINGS.profile?.nfts?.pagination === "true" &&
            state.tab !== "COLLECTIONS" && (
              <Pagination
                totalNfts={state.totalNfts}
                setCurPage={changePage}
                curPage={state.curPage}
                setLoading={setLoading}
                perPage={state.limit}
              />
            )}
        </div>
      </div>
    </FilterContext.Provider>
  );
};

//change temporaryly title before add nft name in to the title
//document.title = SITE_TITLE;

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);

if (container) {
  appRoot.render(<App />);
}
