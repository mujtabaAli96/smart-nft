import React, { useEffect, useState, useContext } from "react";
import useActivity from "../../../../common/hook/useActivity.hook";
import useCollection from "../../../../common/hook/useCollection.hook";
import { ItemsLoader } from "./items-loader";
import { StatisticsContext } from "./state";

export const StatsItems = ({ limit }) => {
  const { getAllCollection } = useCollection();
  const [collections, setCollections] = useState([]);

  async function fetchData() {
    try {
      const res = await getAllCollection();
      setCollections(res.slice(0, limit));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!collections.length) return <ItemsLoader rows={5} />;
  console.log(collections)
  return (
    <div className="stats-items">
      {collections.map((cur, i) => (
        <Items coll={cur} key={i} />
      ))}
    </div>
  );
};

const Items = ({ coll }) => {
  const { state, dispatch } = useContext(StatisticsContext);
  const { getCollStatsOnTimeRange } = useActivity();
  const [data, setData] = useState({ mint: [], list: [], buy: [] });
  const [loading, setLoading] = useState(true);
  const chainLogo = coll?.term_meta?.network?.icon;

  async function fetchData() {
    try {
      const res = { res1: [], res2: [] };

      //now
      const res1 = getCollStatsOnTimeRange(
        state.startTimeInMS,
        coll.term_data.term_id
      ).then((r) => {
        res.res1 = r;
      });

      //previous
      const res2 = getCollStatsOnTimeRange(
        state.prevStartTimeInMS,
        coll.term_data.term_id
      ).then((r) => {
        res.res2 = r;
      });

      await Promise.all([res1, res2]);

      //NEED TO CHANGE

      const temp = { mint: [], list: [], buy: [] };
      res.res1.data.forEach((cur) => {
        temp[cur.activity_type].push({ ...cur, price: parseFloat(cur.price) });
      });

      const temp2 = { mint: [], list: [], buy: [] };
      res.res2.data.forEach((cur) => {
        temp2[cur.activity_type].push({ ...cur, price: parseFloat(cur.price) });
      });

      temp.owners = {};

      temp.list.forEach((cur) => (temp.owners[cur.addr_to] = true));
      temp.buy.forEach((cur) => (temp.owners[cur.addr_to] = true));

      const now_volumes =
        temp.list.reduce((accu, cur) => accu + cur.price, 0) +
        temp.buy.reduce((accu, cur) => accu + cur.price, 0);

      const prev_vol =
        temp2.list.reduce((accu, cur) => accu + cur.price, 0) +
        temp2.buy.reduce((accu, cur) => accu + cur.price, 0);

      const vol_change = prev_vol - now_volumes;
      let changePct = ((now_volumes - vol_change) * 100) / now_volumes;
      
      if( Number.isInteger(Math.floor(changePct)) ){
        if( Math.floor(changePct) !== Number(changePct) ){
          changePct = changePct.toFixed(2)
        }else{
          changePct = changePct
        }
      }else{
        changePct = '--';
      }

      temp.changes = changePct;
      temp.volumes = now_volumes;
      // console.log(now_volumes, prev_vol)
      setData(temp);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [state.startTimeInMS]);

  return (
    <>
      <div className="stats-item">
        <a href={coll?.term_link}>
          <div className="img-name">
            {coll?.term_meta?.profileImg && (
              <img
                className="img"
                src={coll?.term_meta?.profileImg}
                alt={coll?.term_data?.name}
              />
            )}
            {!coll?.term_meta?.profileImg && <span className="img"></span>}
            <span className="name">{coll?.term_data?.name}</span>
          </div>
        </a>

        {loading && <span className="vol loader skeleton-box"></span>}
        {!loading && data.volumes ? (
          <span className="vol">
            <img className="collection-card__info__logo" src={chainLogo} />
            {data.volumes}
          </span>
        ) : null}
        {!loading && !data.volumes && <span>--</span>}

        {loading && <span className="change loader skeleton-box"></span>}
        {!loading && !data.changes && <span className="change">--</span>}
        {!loading && data.changes ? (
          <span className="change">{data.changes > 0 ? <span className="change-up">+{data.changes}%</span> : data.changes < 0 ? <span className="change-down">{data.changes}%</span> : data.changes }</span>
        ) : null}

        {loading && <span className="floor loader skeleton-box"></span>}
        {!loading && data.list.length ? (
          <span className="floor">
            <img className="collection-card__info__logo" src={chainLogo} />
            {Math.min(...data.list.map((cur) => cur.price))}
          </span>
        ) : null}
        {!loading && !data.list.length && <span>--</span>}

        {loading && <span className="sales loader skeleton-box"></span>}
        {!loading && data.buy.length ? (
          <span className="sales">{data.buy.length}</span>
        ) : null}
        {!loading && !data.buy.length && <span>--</span>}

        {loading && <span className="owners loader skeleton-box"></span>}
        {!loading && data.owners ? (
          <span className="owners">{Object.keys(data.owners).length}</span>
        ) : null}
        {!loading && !data.owners && <span className="owners">--</span>}

        {loading && <span className="listed loader skeleton-box"></span>}
        {!loading && data.list.length ? (
          <span className="listed">{data.list.length}</span>
        ) : null}
        {!loading && !data.list.length && <span>--</span>}
      </div>

      {
        //MOBILE DESIGN
      }
      <div className="stats-item__mobile">
        <a href={coll?.term_link}>
          <div className="img-name">
            {coll?.term_meta?.profileImg && (
              <img
                className="img"
                src={coll?.term_meta?.profileImg}
                alt={coll?.term_data?.name}
              />
            )}
            {!coll?.term_meta?.profileImg && <span className="img"></span>}
            <span className="name">
              {coll?.term_data?.name}
              {!loading && data.list.length ? (
                <span className="floor">
                  {Math.min(...data.list.map((cur) => cur.price))}
                </span>
              ) : null}
              {!loading && !data.list.length && <span>--</span>}
            </span>
          </div>
        </a>
        <div className="vol-change">
          {loading && <span className="vol loader skeleton-box"></span>}
          {!loading && data.volumes ? (
            <span className="vol">{data.volumes}</span>
          ) : null}
          {!loading && !data.volumes && <span>--</span>}
          {!loading && <span className="change">--</span>}
        </div>
      </div>
    </>
  );
};
