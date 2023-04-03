import React from "react";
import useTopCollectorProvider from "../../../../common/hook/topCollector.hook";
import { FRONTENDMEDIAURL, SITE_ROOT, SLUG } from "../../../../common/store";

const TopCollector = () => {
  const { loading, topCollector } = useTopCollectorProvider();

  if (loading) return null;

  return (
    <div className="top-collectors">
      {topCollector.map((cur, i) => (
        <Collector key={i} collector={cur} />
      ))}
    </div>
  );
};

const Collector = ({ collector }) => {
  return (
    <div className="collector">
      <div className="collector__user">
        {collector.profile?.profileImg ? (
          <img src={collector.profile.profileImg} />
        ) : (
          <img src={`${FRONTENDMEDIAURL}demo-user.svg`} />
        )}

        <div>
          {collector.profile?.name ? (
            <a href={`${SITE_ROOT}/profile/${collector.address}`}>
              <h3>{collector.profile.name}</h3>
            </a>
          ) : (
            <a href={`${SITE_ROOT}/profile/${collector.address}`}>
              <h3>
                {collector.address?.substring(0, 7)}....
                {collector.address?.slice(collector.address.length - 4)}
              </h3>
            </a>
          )}
          <p>{collector.total}</p>
        </div>
      </div>
    </div>
  );
};

export default TopCollector;
