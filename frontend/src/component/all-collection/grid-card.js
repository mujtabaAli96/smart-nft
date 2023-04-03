import React, { useEffect, useState } from "react";
const { __ } = wp.i18n;
import { SLUG } from "../../../../common/store";
import useCollectionMeta from "../../../../common/hook/useCollectionMeta";

const GridCard = ({ data }) => {
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

  const coverImg = ( data?.thumbImg === undefined || data?.thumbImg === '' ) ? data.bannerImg : data.thumbImg
  const chainLogo = data?.network?.icon;  
  return (
    <div className="collection-card">
      <a href={data.term_link}>
        <figure
          className="collection-cover"
          style={{ backgroundImage: `url(${coverImg})` }}
        ></figure>
      </a>
      <a href={data.term_link}>
        <div>
          <div className="collection-card__head">
            {data.profileImg != "" && (
              <img
                className="collection-card__collection-photo"
                src={data.profileImg}
              />
            )}
            {data.profileImg == "" && (
              <span className="collection-card__collection-photo__noimg"></span>
            )}
            <p>{data.name}</p>
          </div>
          <div className="collection-card__info">
            <div className="floor">
              <p>{__("Floor", SLUG)}</p>
              <p className="collection-card__info__value">
                {!loading ? <span><img className="collection-card__info__logo" src={chainLogo} />{result?.flour_price % 1 !== 0 ? result?.flour_price.toFixed(2) : result?.flour_price }</span> : null}
              </p>
            </div>
            <div className="total">
              <p>{__("Volume", SLUG)}</p>
              <p className="collection-card__info__value">
                {!loading ? <span><img className="collection-card__info__logo" src={chainLogo} />{result?.total_volume  % 1 !== 0 ? result?.total_volume.toFixed(2) : result?.total_volume }</span> : null}
              </p>
            </div>
            <div className="items">
              <p>{__("Items", SLUG)}</p>
              <p className="collection-card__info__value">{data.count}</p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export { GridCard };
