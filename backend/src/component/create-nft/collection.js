import React, { useContext, useState, useEffect } from "react";
import { CreateNftContext } from "./state";
import { SLUG, SETTINGS } from "../../../../common/store";
import useCollection from "../../../../common/hook/useCollection.hook";
const { __ } = wp.i18n;

const Collection = ({ web3Provider }) => {
  if( SETTINGS.nftpages?.create?.collection === "false" || !SETTINGS.nftpages?.create?.collection ) return null;

  const { state, dispatch } = useContext(CreateNftContext);
  const { getUserCollections } = useCollection();
  const [collections, setCollections] = useState([]);
  console.log(">>>>>>>>>>", collections);

  const [isCollectionsFieldOpen, setCollectionsFieldOpen] = useState(false);
  const [collectionsSuggetions, setCollectionsSuggetion] = useState([]);
  const [showCollectionsSuggetion, setShowCollectionsSuggetion] =
    useState(false);

  useEffect(() => {
    async function fetchCollections() {
      const res = await getUserCollections(web3Provider.account[0]);

      console.log(res);
      setCollections(
        res.filter(
          (curNet) =>
            curNet.meta?.network?.chainId ===
              state.selectedContract?.network?.chainId?.toString() &&
            curNet.meta?.standard === state.standard
        )
      );
    }

    fetchCollections();
  }, []);

  const changeCollectionsStatus = (e) => {
    const isChecked = e.target.checked;
    setCollectionsFieldOpen(isChecked);
    setShowCollectionsSuggetion(isChecked);
    setCollectionsSuggetion(collections);

    if (!isChecked) {
      setCollectionsSuggetion([]);
      dispatch({
        type: "CHANGE_COLLECTION",
        payload: { name: "", slug: "", id: "" },
      });
    }
  };

  const onChange = (e) => {
    const value = e.target.value.toLowerCase();
    const found = collections.filter((col) =>
      col.data.name.toLowerCase().startsWith(value)
    );
    setCollectionsSuggetion(found);
    setShowCollectionsSuggetion(true);
    dispatch({
      type: "CHANGE_COLLECTION",
      payload: { name: value, slug: "", id: "" },
    });
  };

  return (
    <div className="collections__con">
      <div className="collections">
        <p className="header-two">{__("Collection", SLUG)}</p>
        <label className="switch">
          <input type="checkbox" onChange={changeCollectionsStatus} />
          <span className="slider round"></span>
        </label>
        <p className="pra-one">{__("Put this item into a Collection", SLUG)}</p>
      </div>

      {isCollectionsFieldOpen ? (
        <input
          type="text"
          placeholder={__("Collection name...", SLUG)}
          value={state.collection.name}
          onChange={onChange}
        />
      ) : null}

      {collectionsSuggetions.length ? (
        <Suggetions
          collectionsSuggetions={collectionsSuggetions}
          setCollectionsSuggetion={setCollectionsSuggetion}
          setShowCollectionsSuggetion={setShowCollectionsSuggetion}
          dispatch={dispatch}
          state={state}
        />
      ) : null}

      {!collectionsSuggetions.length && showCollectionsSuggetion ? (
        <NoSuggetions />
      ) : null}
    </div>
  );
};

const Suggetions = ({
  collectionsSuggetions,
  setCollectionsSuggetion,
  setShowCollectionsSuggetion,
  dispatch,
  state,
}) => {
  const onClick = (col) => {
    setCollectionsSuggetion([]);
    setShowCollectionsSuggetion(false);
    dispatch({
      type: "CHANGE_COLLECTION",
      payload: {
        name: col.data.name,
        slug: col.data.slug,
        id: col.data.term_id,
      },
    });

    const payload = {
      network: state.selectedContract.network,
      contract: { ...state.selectedContract.contract },
    };

    payload.contract[col.meta?.standard].address = col.meta?.contractAddress;
    payload.contract[col.meta?.standard].name = col.meta?.name;
    payload.contract[col.meta?.standard].symbol = col.meta?.symbol;
    dispatch({ type: "SET_SELECTED_CONTRACT", payload });
  };

  return (
    <div className="collections__suggetions">
      {collectionsSuggetions.map((col) => (
        <span key={col.data.term_id} onClick={() => onClick(col)}>
          {col.data.name}
        </span>
      ))}
    </div>
  );
};

const NoSuggetions = () => {
  return (
    <div>
      <span>{__("No collection found.", SLUG)}</span>
    </div>
  );
};

export default Collection;
