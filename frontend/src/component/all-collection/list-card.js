import React, { useState, useEffect } from "react";
const { __ } = wp.i18n;
import useCollectionMeta from "../../../../common/hook/useCollectionMeta";
import { SLUG } from "../../../../common/store";

export const ListCard = ({ data, listno }) => {
  const { getCollectionMeta } = useCollectionMeta();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});

  async function fetchData() {
    try {
      const res = await getCollectionMeta(data.term_id);
      setResult(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="collection-card-list">
        <a href={data.term_link}>
          <div className="collection-card-list__img">
            <span>{listno + 1}</span>
            {data.profileImg && (
              <img
                className="collection-card-list__collection-photo"
                src={data.profileImg}
              />
            )}

            {!data.profileImg && (
              <span className="collection-card-list__collection-photo__noimg"></span>
            )}
            <span className="name">{data.name}</span>
          </div>
          <div className="floor">
            <p className="collection-card-list__info__value">
              <img className="list-logo" src={data?.network?.icon} alt="icon" />
              {!loading ? result?.flour_price : null}
            </p>
          </div>
          <div className="vol">
            <p className="collection-card-list__info__value">
              <img className="list-logo" src={data?.network?.icon} alt="icon" />
              {!loading ? result?.total_volume : null}
            </p>
          </div>
          <div className="items">
            <p className="collection-card-list__info__value">{result.owners}</p>
          </div>
          <div className="items">
            <p className="collection-card-list__info__value">{data.count}</p>
          </div>
          <div className="items">
            <p className="collection-card-list__info__value">
              {!loading &&
                data.standard == "Erc721" &&
                (result.listed_amount / data.count) * 100}
              {!loading &&
                data.standard == "Erc1155" &&
                (result.listed_amount /
                  (result.listed_amount + result.unlisted_amount)) *
                  100}
              %
            </p>
          </div>
        </a>
      </div>
      <div className="collection-card-list-mobile">
        <a href={data.term_link}>
          <div className="collection-card-list__img">
            <span>{listno + 1}</span>
            {data.profileImg && (
              <img
                className="collection-card-list__collection-photo"
                src={data.profileImg}
              />
            )}

            {!data.profileImg && (
              <span className="collection-card-list__collection-photo__noimg"></span>
            )}
            <div>
              <span className="name">{data.name}</span>
              <p className="collection-card-list__info__value">
                <img
                  className="list-logo"
                  src={data?.network?.icon}
                  alt="icon"
                />
                {!loading ? result?.flour_price : null}
              </p>
            </div>
          </div>
          <div className="vol">
            <p className="collection-card-list__info__value">
              <img className="list-logo" src={data?.network?.icon} alt="icon" />
              {!loading ? result?.total_volume : null}
            </p>
          </div>
        </a>
      </div>
    </>
  );
};

export const ListCardHead = () => {
  return (
    <div className="collection-card-list">
      <div className="heading">
        <div className="collection-card-list__img">
          <span className="name">{__("Collection", SLUG)}</span>
        </div>
        <div>
          <span>{__("Floor Price", SLUG)}</span>
        </div>
        <div>
          <span>{__("Total Volume", SLUG)}</span>
        </div>
        <div>
          <span>{__("Owners", SLUG)}</span>
        </div>
        <div>
          <span>{__("Items", SLUG)}</span>
        </div>
        <div>
          <span>{__("Listed", SLUG)}</span>
        </div>
      </div>
    </div>
  );
};
