import React, { useContext, useState, useEffect } from "react";
import { FRONTENDMEDIAURL, SLUG, SETTINGS } from "../../../../common/store";
import { FilterContext } from "./state";
import { isMobileDevice } from "../../../../common/utils/utils";
import { Icons } from "../../../../common/component/icons";
import useCollection from "../../../../common/hook/useCollection.hook";
const { __ } = wp.i18n;

const CollectionFilter = () => {
  const { state, dispatch } = useContext(FilterContext);

  const { getAllCollection } = useCollection();

  const [isCollectionOpen, setIsCollectionOpen] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const collection = await getAllCollection();

      dispatch({ type: "CHANGE_COLLECTIONS", payload: collection });
      dispatch({
        type: "CHANGE_FILTERED_COLLECTION",
        payload: collection,
      });
    }
    fetchData();
  }, []);

  return (
    <div className="collection-filter">
      <div
        className={`filter-section-heading ${
          isCollectionOpen ? "showing" : ""
        }`}
        onClick={() => {
          setIsCollectionOpen(!isCollectionOpen);
        }}
      >
        <h6>{__("Collections", SLUG)}</h6>
        {Icons.leftArrow}
      </div>
      {isCollectionOpen && <ActiveCollection />}
      {isCollectionOpen && <CollectionSearchBar />}
      {isCollectionOpen && <CollectionsList />}
    </div>
  );
};

const ActiveCollection = () => {
  const { state, dispatch } = useContext(FilterContext);

  if (!state.activeCollection) return null;

  const removeActiveCollection = () => {
    dispatch({ type: "CHANGE_ACTIVE_COLLECTION", payload: null });
    dispatch({ type: "CHANGE_COLLECTION", payload: "" });
    dispatch({ type: "LOADING", payload: true });
  };

  return (
    <div className="collection__remove">
      <CollectionsItem collection={state.activeCollection} />
      <img
        onClick={removeActiveCollection}
        src={`${FRONTENDMEDIAURL}cross.svg`}
        className="cross"
      />
    </div>
  );
};

const CollectionSearchBar = () => {
  const { state, dispatch } = useContext(FilterContext);

  //if anycollection is clicked and filter is active no need
  //to display the searchbar
  if (state.activeCollection) return null;

  const onChange = (e) => {
    const foundSuggesion = state.collections.filter((cur) => {
      return cur.term_data.name
        .toLowerCase()
        .startsWith(e.target.value.toLowerCase().trim());
    });

    dispatch({ type: "CHANGE_FILTERED_COLLECTION", payload: foundSuggesion });
    dispatch({ type: "CHANGE_COLLECTION_SEATCH_KEY", payload: e.target.value });
  };

  return (
    <label htmlFor="search">
      <img src={`${FRONTENDMEDIAURL}search.svg`} />
      <input
        type="text"
        id="search"
        placeholder={__("Search by collections", SLUG)}
        onChange={onChange}
        value={state.collectionSearchKey}
      />
    </label>
  );
};

const CollectionsList = () => {
  const { state, dispatch } = useContext(FilterContext);

  if (state.activeCollection) return null;

  return (
    <div className="collection__list">
      {state.filteredCollections.map((cur) => (
        <CollectionsItem collection={cur} key={cur.term_data.term_id} />
      ))}
    </div>
  );
};

const CollectionsItem = ({ collection }) => {
  const { state, dispatch } = useContext(FilterContext);

  const handleCollectionClick = (e) => {
    console.log("BBBBBBBBBBBBBBBB", collection.term_data);
    dispatch({ type: "CHANGE_ACTIVE_COLLECTION", payload: collection });
    dispatch({ type: "CHANGE_COLLECTION", payload: collection.term_data.name });
    dispatch({ type: "LOADING", payload: true });
  };

  return (
    <div className="collection__item" onClick={handleCollectionClick}>
      <div>
        {collection.term_meta.profileImg ? (
          <img
            src={collection.term_meta.profileImg}
            alt={collection.term_data.name}
          />
        ) : (
          <img
            src={`${FRONTENDMEDIAURL}demo-user.svg`}
            alt={collection.term_data.name}
          />
        )}
      </div>
      <div>
        <p>{collection.term_data.name}</p>
      </div>
      <div className="collection__count">
        <span>{collection.term_data.count}</span>
      </div>
    </div>
  );
};

export default CollectionFilter;
