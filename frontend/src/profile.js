console.log("profile page");
import React, { useReducer } from "react";
import { createRoot } from "react-dom/client";
import useWeb3provider from "../../common/hook/wallet.hook";
import useProfile from "./hooks/useProfile";
import { Header } from "./component/profile/header";
import { Pagination } from "./component/all-nft/pagination";
import Tabs from "./component/profile/tabs";
import MainErrorCapturer from "../../common/component/error-comp/main-error";
import { FilterContext, REDUCER, STATE } from "./component/profile/state";
import UserNfts from "./component/profile/userNfts";
import { SETTINGS } from "../../common/store";

const App = () => {
  const web3Provider = useWeb3provider();
  const profileProvider = useProfile(web3Provider.account[0], { all: "" });
  const [state, dispatch] = useReducer(REDUCER, STATE);

  const setLoading = () => {
    dispatch({ type: "LOADING", payload: true });
  };

  const changePage = (page) => {
    dispatch({ type: "CHANGE_PAGE", payload: page });
  };

  return (
    <FilterContext.Provider
      value={{ state: { ...state, accAdd: web3Provider.account[0] }, dispatch }}
    >
      <div id="app">
        <MainErrorCapturer>
          <div className="smart-nft-profile">
            <Header
              profileProvider={profileProvider}
              address={web3Provider.account[0]}
            />
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
        </MainErrorCapturer>
      </div>
    </FilterContext.Provider>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);

if (container) {
  appRoot.render(<App />);
}
