import React, { useContext, useEffect } from "react";
import { FilterContext } from "./state";
import { Card as NftCard } from "../all-nft/card";
import { GridCard as CollectionCard } from "../all-collection/grid-card";
import {
  AllNftLoader,
  CollectionsLoader,
} from "../../../../common/component/loading";
import {
  NoCollectionFound,
  NoNftFound,
} from "../../../../common/component/nofnt";
import ProfileFilter from "./filter";
import { BACKEND_AJAX_URL } from "../../../../common/store";
import SeachBar from "./searchbar";
import useCollection from "../../../../common/hook/useCollection.hook";

const UserNfts = () => {
  const { state, dispatch } = useContext(FilterContext);
  console.log(state);
  const offset = (state.curPage - 1) * state.limit;
  const { getUserCollections } = useCollection();

  useEffect(() => {
    async function fetchData() {
      if (!state.accAdd) return null;
      try {
        if (state.collectionloading) {
          const res = await getUserCollections( state.accAdd.toLowerCase() );
          dispatch({ type: "CHANGE_COLLECTIONS", payload: res });
          dispatch({ type: "COLLECTIONS_LOADING", payload: false });
        } else {
          const res = await jQuery.ajax({
            type: "post",
            url: BACKEND_AJAX_URL,
            data: {
              action: "get_user_owned_nft",
              offset: offset,
              status: state.status,
              priceRange: state.priceRange,
              curPage: state.curPage,
              search: state.search,
              priceOrder: state.priceOrder,
              limit: state.limit,
              tab: state.tab,
              accAdd: state.accAdd,
            },
          });

          const resNfts = res.data.nfts;
          const totalNfts = res.data.total_post_found;

          dispatch({ type: "CHANGE_NFTS", payload: resNfts });
          dispatch({ type: "CHANGE_TOTAL_NFTS", payload: totalNfts });
        }

        dispatch({ type: "LOADING", payload: false });
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [
    state.tab,
    state.status,
    state.priceRange,
    state.accAdd,
    state.curPage,
    state.search,
    state.priceOrder,
  ]);

  return (
    <div>
      {state.tab != "COLLECTIONS" && <SeachBar />}
      <div className="filter-and-nfts-container">
        {state.tab != "COLLECTIONS" && <ProfileFilter />}

        {state.tab != "COLLECTIONS" && (
          <>
            {state.loading ? (
              <AllNftLoader
                pageClass="profile-page"
                perPageItems={state.limit}
              />
            ) : (
              <>
                {!state.nfts.length ? (
                  <NoNftFound />
                ) : (
                  <div className="profile-page all-nfts">
                    {state.nfts.map((cur, i) => (
                      <NftCard key={i} data={{ ...cur }} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {state.tab == "COLLECTIONS" && (
          <>
            {state.collectionloading ? (
              <CollectionsLoader />
            ) : (
              <>
                {!state.collections.length ? (
                  <NoCollectionFound />
                ) : (
                  <div className="all-nfts">
                    {state.collections.map((cur, i) => (
                      <CollectionCard
                        key={i}
                        data={{ ...cur.data, ...cur.meta, term_link: cur.permalink }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserNfts;
