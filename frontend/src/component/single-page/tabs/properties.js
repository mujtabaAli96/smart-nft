import React from "react";
import { WarningNotification } from "../../../../../common/component/notification/warning";
import { SLUG } from "../../../../../common/store";
const { __ } = wp.i18n;

export const Properties = ({ data }) => {
  const { properties } = data.nftInfo;

  if (!properties || !properties?.length)
    return <WarningNotification message={__("No properties found", SLUG)} />;

  return (
    <div className="tab-properties">
      <div className="tab-properties__items">
        {properties.map((cur, i) => (
          <div className="tab-properties__item" key={i}>
            <span>{cur.trait_type}</span>
            <span>{cur.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
