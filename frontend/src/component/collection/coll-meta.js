import React, { useState, useContext } from "react";
import { FilterContext } from "./state";
import {
  SLUG,
  SETTINGS,
  FRONTENDMEDIAURL,
  SITE_ROOT,
} from "../../../../common/store";
const { __ } = wp.i18n;
import { successMessage } from "../../../../common/component/message/success";
import useProfile from "../../hooks/useProfile";

const CollectionAddress = () => {
  if (SETTINGS.collections?.single?.creator === "false") return null;
  const { state, dispatch } = useContext(FilterContext);
  const address = state.collectionMeta?.term_meta?.contractAddress?.toLowerCase();
  const network = state?.collectionMeta?.term_meta?.network;

  const copyaddress = (address) => {
    navigator.clipboard.writeText(address);
    successMessage(__("Address copied to clipboard", SLUG));
  };

  if (!address || !network) return null;

  return (
    <>
      <span>{__("Address ", SLUG)}</span>
      <span>
        <a target="_blank" href={`${network.blockUrl}address/${address}`}>
          <b>
            {address.substring(0, 8)}...{address.substring(address.length - 4)}
          </b>
        </a>
        <img
          style={{ marginLeft: 10 }}
          className="copy"
          src={`${FRONTENDMEDIAURL}copy.svg`}
          onClick={(e) => copyaddress(address)}
          alt="copy icon"
        />
      </span>
    </>
  );
};

const AccountAddress = ({ address }) => {
  if (SETTINGS.collections?.single?.creator === "false" || !address) {
    return null;
  }

  const creator = useProfile(address, { name: "", profileImg: "" });

  return (
    <p className="profile-header__address">
      {__("Created by ", SLUG)}
      <a href={`${SITE_ROOT}/profile/${address?.toLowerCase()}`}>
        {!creator.isLoading && (
          <>
            {creator?.name ? (
              <b>{creator?.name}</b>
            ) : (
              <b>
                {address.substring(0, 8)}...
                {address.substring(address.length - 4)}
              </b>
            )}
          </>
        )}
      </a>
    </p>
  );
};

const Meta = () => {
  const { state, dispatch } = useContext(FilterContext);
  const collMeta = state.collectionMeta?.term_meta;

  if (!collMeta) return null;

  return (
    <div className="collection-metadata">
      <div className="metadata-single">
        {collMeta.date && (
          <>
            <span>{__("Created ", SLUG)}</span>
            <span>
              <b>{new Date(collMeta.date * 1000).toLocaleDateString()}</b>
            </span>
          </>
        )}
      </div>

      <div className="metadata-single">
        {collMeta?.network?.nickName && (
          <>
            <span>{__("Blockchain ", SLUG)}</span>
            <span>
              <b>{collMeta?.network?.nickName}</b>
            </span>
          </>
        )}
      </div>

      <div className="metadata-single">
        {collMeta.contractAddress && (
          <CollectionAddress address={collMeta.contractAddress} />
        )}
      </div>
    </div>
  );
};

export const MetaDescription = () => {
  const [readmore, setreadmore] = useState(false);
  const { state, dispatch } = useContext(FilterContext);
  const desc = state.collectionMeta?.term_meta?.description;

  return (
    <>
      {/* Collection Name */}
      <h2 className="profile-header__name">
        {state.collectionMeta?.term_meta?.name}
      </h2>
      {/* Collection Creator */}
      <AccountAddress address={state?.collectionMeta?.term_meta?.creator} />
      {/* Meta info */}
      <Meta />
      {/* Collection Description */}
      {SETTINGS.collections?.single?.desc === "false" ? null : (
        <>
          {desc.length > 0 && (
            <div className="collection-desc">
              <p>
                {desc.length > 160 && (
                  <>
                    {readmore ? desc : `${desc.substring(0, 160)}...`}
                    <span className="profile-header__show-btn">
                      {readmore ? (
                        <a onClick={(e) => setreadmore(false)}>
                          {__(" Show less", SLUG)}
                        </a>
                      ) : (
                        <a onClick={(e) => setreadmore(true)}>
                          {__("Show more", SLUG)}
                        </a>
                      )}
                    </span>
                  </>
                )}
                {desc.length < 160 && <span>{desc}</span>}
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export const CollectionStats = () => {
  const { state, dispatch } = useContext(FilterContext);
  const stats = state.collectionStats;
  const network = state.collectionMeta?.term_meta?.network;
  const itemsCount = state.collectionMeta?.term_data?.count;

  return (
    <div className="profile-header__collection-stats">
      <div className="single-stat">
        <span>
          {stats?.total_volume.toFixed(4)} {network?.currencySymbol}
        </span>
        <span>{__("Total volume", SLUG)}</span>
      </div>
      <div className="single-stat">
        <span>
          {stats?.flour_price.toFixed(4)} {network?.currencySymbol}
        </span>
        <span>{__("Floor Price", SLUG)}</span>
      </div>
      <div className="single-stat">
        <span>{itemsCount}</span>
        <span>{__("Total Items", SLUG)}</span>
      </div>
      <div className="single-stat">
        <span>{stats.owners}</span>
        <span>{__("Owners", SLUG)}</span>
      </div>
    </div>
  );
};
