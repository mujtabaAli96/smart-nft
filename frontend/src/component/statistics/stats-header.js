import React from "react";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

export const StatsHeader = () => {
  const headerItems = [
    {
      title: __("Collection", SLUG),
    },
    {
      title: __("Volume", SLUG),
    },
    {
      title: __("Change", SLUG),
    },
    {
      title: __("Floor Price", SLUG),
    },
    {
      title: __("Sales", SLUG),
    },
    {
      title: __("Owners", SLUG),
    },
    {
      title: __("Listed", SLUG),
    },
  ];

  return (
    <div className="stats-header">
      <ul>
        {headerItems.map((cur, index) => (
          <HeaderItem info={cur} key={index} />
        ))}
      </ul>
    </div>
  );
};

const HeaderItem = ({ info }) => <li>{info.title}</li>;
