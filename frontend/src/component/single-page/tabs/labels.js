import React from "react";
import { WarningNotification } from "../../../../../common/component/notification/warning";
import { SLUG } from "../../../../../common/store";
const { __ } = wp.i18n;

export const Labels = ({ data }) => {
  const { labels } = data.nftInfo;

  if (!labels || !labels.length)
    return <WarningNotification message={__("No labels found", SLUG)} />;

  return (
    <div className="trait-progresses">
      {labels.map((cur, i) => (
        <div key={i} className="progress">
          <div>
            <div className="progress__flex">
              <p className="pra-one">{cur.trait_type}</p>
              <p className="pra-one">
                {cur.value} {__("of", SLUG)} {cur.max_value}
              </p>
            </div>
            <div className="progress__outer">
              <div
                style={{ width: `${cur.value}%` }}
                className="progress__inner"
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
