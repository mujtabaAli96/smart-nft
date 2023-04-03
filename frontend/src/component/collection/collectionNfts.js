import React, { useContext, useEffect, useState } from "react";
import { FilterContext } from "./state";
import { Card } from "../all-nft/card";
import { AllNftLoader } from "../../../../common/component/loading";
import { NoNftFound } from "../../../../common/component/nofnt";
import CollectionFilter from "./filter";
import { BACKEND_AJAX_URL, SETTINGS } from "../../../../common/store";
import InfiniteScroll from "react-infinite-scroller";
import SeachBar from "./searchbar";

const CollectionNfts = () => {
  const { state, dispatch } = useContext(FilterContext);
  const offset = (state.curPage - 1) * state.limit;
  const hasmore = offset < state.totalNfts;

  async function fetchData() {
    try {
      const res = await jQuery.ajax({
        type: "post",
        url: BACKEND_AJAX_URL,
        data: {
          offset: offset,
          status: state.status,
          priceRange: state.priceRange,
          curPage: state.curPage,
          search: state.search,
          priceOrder: state.priceOrder,
          collectionId: state.collectionId,
          limit: state.limit,
          action: "filter_nfts",
        },
      });

      const resNfts = res.data.nfts;
      const totalNfts = res.data.total_post_found;

      if (state.curPage == 1) {
        //if curPage is one then remove all previous nft and set new one
        dispatch({ type: "CHANGE_NFTS", payload: resNfts });
      } else {
        //else leave previous ones and add new ones
        dispatch({ type: "CHANGE_NFTS", payload: [...state.nfts, ...resNfts] });
      }

      dispatch({ type: "CHANGE_TOTAL_NFTS", payload: totalNfts });
      dispatch({ type: "CHANGE_CUR_PAGE", payload: state.curPage + 1 });
      dispatch({ type: "LOADING", payload: false });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [state.status, state.priceRange, state.search, state.priceOrder]);

  return (
    <div>
      <SeachBar />
      <div className="filter-and-nfts-container">
        <CollectionFilter />
        {state.loading ? (
          <AllNftLoader
            pageClass="single-collection"
            perPageItems={state.limit}
          />
        ) : (
          <>
            {!state.nfts.length ? (
              <NoNftFound />
            ) : (
              <InfiniteScroll
                pageStart={0}
                loadMore={fetchData}
                hasMore={hasmore}
                loader={
                  <AllNftLoader
                    pageClass="single-collection"
                    perPageItems={
                      parseInt(SETTINGS.collections?.single?.cols) || 4
                    }
                  />
                }
                className="infinite-scroll"
              >
                <div className="single-collection all-nfts">
                  {state.nfts.map((cur, i) => (
                    <Card key={i} data={{ ...cur }} />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionNfts;
