import React from "react";
import { WarningNotification } from "../../../../../common/component/notification/warning";
import { SLUG } from "../../../../../common/store";
const { __ } = wp.i18n;

export const Stats = ({ data }) => {
  const { stats } = data.nftInfo;

  if (!stats || !stats.length)
    return <WarningNotification message={__("No stats found", SLUG)} />;

  return (
    <div className="trait-stats">
      {stats.map((cur, i) => (
        <div key={i} className="stat">
          <div className="stat__flex">
            <p className="pra-one">{cur.trait_type}</p>
            <p className="pra-one">
              {cur.value} {__("of", SLUG)} {cur.max_value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
