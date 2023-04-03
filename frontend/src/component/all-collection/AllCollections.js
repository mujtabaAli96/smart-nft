import React, { useContext, useEffect, useState } from "react";
import { AllCollectionContext } from "./state";
import { GridCard } from "./grid-card";
import { ListCard, ListCardHead } from "./list-card";
import { CollectionsLoader } from "../../../../common/component/loading";
import { NoCollectionFound } from "../../../../common/component/nofnt";
import { Pagination } from "../all-nft/pagination";
import InfiniteScroll from "react-infinite-scroller";
import useCollection from "../../../../common/hook/useCollection.hook";

const ViewCollections = ({ state }) => {
  const offset = (state.curPage - 1) * state.limit;
  console.log(state.collections.slice(0, offset + state.limit));
  return (
    <>
      {state.style == "list" && <ListCardHead />}
      <div className={`all-collections${state.style == "list" ? "-list" : ""}`}>
        {state.collections.slice(0, offset + state.limit).map((cur, i) =>
          state.style == "list" ? (
            <ListCard
              key={i}
              listno={i}
              data={{
                ...cur.term_data,
                ...cur.term_meta,
                term_link: cur.term_link,
              }}
            />
          ) : (
            <GridCard
              key={i}
              data={{
                ...cur.term_data,
                ...cur.term_meta,
                term_link: cur.term_link,
              }}
            />
          )
        )}
      </div>
    </>
  );
};

const AllCollections = () => {
  const { state, dispatch } = useContext(AllCollectionContext);
  const { getAllCollection } = useCollection();
  const offset = state.curPage * state.limit;
  const hasmore = offset < state.totalCollections;

  const setLoading = () => dispatch({ type: "LOADING", payload: true });
  const changePage = (page) => dispatch({ type: "CHANGE_PAGE", payload: page });
  const loadMore = () =>
    window.setTimeout(() => {
      changePage(state.curPage + 1);
    }, 500);

  async function fetchData() {
    try {
      const res = await getAllCollection();
      console.log(res);
      dispatch({ type: "CHANGE_COLLECTIONS", payload: res });
      dispatch({ type: "CHANGE_TOTAL_COLLECTIONS", payload: res.length });
      dispatch({ type: "LOADING", payload: false });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (state.loading) {
    return (
      <div>
        <div className={`all-collection-main-container`}>
          <CollectionsLoader perPageItems={state.limit} styler={state.style} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`filter-and-nfts-container all-collection-main-container`}
      >
        {!state.collections.length && <NoCollectionFound />}
        {state.collections.length && state.isInfinitePagination && (
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasmore}
            loader={
              <CollectionsLoader
                styler={state.style}
                perPageItems={state.perColumn}
              />
            }
            className="infinite-scroll"
          >
            <ViewCollections state={state} />
          </InfiniteScroll>
        )}
      </div>

      {!state.isInfinitePagination && (
        <Pagination
          totalNfts={state.totalCollections}
          setCurPage={changePage}
          curPage={state.curPage}
          setLoading={setLoading}
          perPage={state.limit}
        />
      )}
    </div>
  );
};

export default AllCollections;
