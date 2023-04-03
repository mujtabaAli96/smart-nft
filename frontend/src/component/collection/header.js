import React, { useEffect, useState, useContext } from "react";
import useWeb3provider from "../../../../common/hook/wallet.hook";
import { CollectionHeaderLoader } from "../../../../common/component/loading";
import { EditCollectionPopup } from "./edite-coll-popup";
import useCollection from "../../../../common/hook/useCollection.hook";
import useCollectionMeta from "../../../../common/hook/useCollectionMeta";
import { MetaDescription, CollectionStats } from "./coll-meta";
import { SocialIcons } from "./socials";
import { FilterContext } from "./state";
const { __ } = wp.i18n;

const NoProfile = () => <div className="profile-header__profile-empty"></div>;
const NoBanner = () => <div className="profile-header__banner-empty"></div>;

const Profile = () => {
  const { state, dispatch } = useContext(FilterContext);
  const collMeta = state.collectionMeta?.term_meta;
  const style = { backgroundImage: `url(${collMeta?.profileImg})` };

  if (!collMeta?.profileImg) return <NoProfile />;

  return <figure className="profile-header__profile" style={style}></figure>;
};

const Banner = () => {
  const { state, dispatch } = useContext(FilterContext);
  const collMeta = state.collectionMeta?.term_meta;
  const style = { backgroundImage: `url(${collMeta?.bannerImg})` };

  if (!collMeta?.bannerImg) return <NoBanner />;
  return <figure className="profile-header__banner" style={style}></figure>;
};

const EditOption = ({ setEditopen }) => {
  return (
    <div className="profile-header__edit">
      <button
        onClick={(e) => setEditopen(true)}
        className="profile-header__edit-btn"
      >
        <span>{__("Edit collection")}</span>
      </button>
    </div>
  );
};

export const Header = () => {
  const web3Provider = useWeb3provider();
  const { state, dispatch } = useContext(FilterContext);
  const [editopen, setEditopen] = useState(false);
  const { getCollectionByCollId } = useCollection();
  const { getCollectionMeta } = useCollectionMeta();
  const [loading, setLoading] = useState(true);
  const collMeta = state.collectionMeta?.term_meta;

  const hasEditPermision =
    collMeta?.creator?.toLowerCase() === web3Provider.account[0]?.toLowerCase();

  async function fetchData() {
    try {
      let result = {};
      const collMeta = getCollectionByCollId(state.collectionId).then((res) => {
        result.collMeta = res;
      });

      const collStats = getCollectionMeta(state.collectionId).then((res) => {
        result.collStats = res.data;
      });

      await Promise.all([collMeta, collStats]);

      dispatch({ type: "CHANGE_COLL_META", payload: result.collMeta });
      dispatch({ type: "CHANGE_COLL_STATS", payload: result.collStats });
      setLoading(false);

      console.log("collection", result);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || web3Provider.loading) return <CollectionHeaderLoader />;

  return (
    <div className="profile-header">
      <div>
        {hasEditPermision && (
          <EditCollectionPopup isOpen={editopen} setOpen={setEditopen} />
        )}

        <div className="profile-header-top">
          <Profile />
          <Banner />
        </div>

        <div className="profile-header__accAndEdit">
          {hasEditPermision ? <EditOption setEditopen={setEditopen} /> : null}
        </div>
      </div>

      <div className="profile-header__details">
        <div className="profile-header__details__section profile-header__name__and__socials">
          <div className="name-and-des">
            <MetaDescription />
          </div>
          <SocialIcons />
        </div>
        <div
          className="profile-header__details__section"
          style={{ marginBottom: 20 }}
        >
          <CollectionStats />
        </div>
      </div>
    </div>
  );
};
