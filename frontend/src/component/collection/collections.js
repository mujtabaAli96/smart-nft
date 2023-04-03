import React, { useReducer, useEffect } from "react";
import { Header } from "./header";
//import { Pagination } from "../all-nft/pagination";
import { FilterContext, REDUCER, STATE } from "./state";
import CollectionNfts from "./collectionNfts";
//import { SETTINGS } from "../../../../common/store";

export const Collections = () => {
  const [state, dispatch] = useReducer(REDUCER, STATE);

  return (
    <FilterContext.Provider value={{ state: state, dispatch }}>
      <div className="collection-container">
        <div className="collection-container__header">
          <Header />
          <CollectionNfts />
          {/*SETTINGS.general?.loadmore == "pagination" && (
			<Pagination
			  totalNfts={state.totalNfts}
			  setCurPage={changePage}
			  curPage={state.curPage}
			  setLoading={setLoading}
			  perPage={state.limit}
			/>
		  )*/}
        </div>
      </div>
    </FilterContext.Provider>
  );
};
