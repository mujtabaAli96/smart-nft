import React, { useState, useContext } from "react";
import { SLUG } from "../../../../common/store";
import { StatisticsContext } from "./state";
const { __ } = wp.i18n;

export const StatsFilter = () => {
  const [curFilter, setCurFilter] = useState(5);
  const ONE_HOUR_IN_MS = 1 * 60 * 60 * 1000;
  const TODAY_IN_MS = Date.now();

  const filterItems = [
    {
      title: __("1h", SLUG),
      time: TODAY_IN_MS - ONE_HOUR_IN_MS,
      time2: TODAY_IN_MS - ONE_HOUR_IN_MS * 2,
    },
    {
      title: __("6h", SLUG),
      time: TODAY_IN_MS - 6 * ONE_HOUR_IN_MS,
      time2: TODAY_IN_MS - 6 * ONE_HOUR_IN_MS * 2,
    },
    {
      title: __("1d", SLUG),
      time: TODAY_IN_MS - 24 * ONE_HOUR_IN_MS,
      time2: TODAY_IN_MS - 24 * ONE_HOUR_IN_MS * 2,
    },
    {
      title: __("7d", SLUG),
      time: TODAY_IN_MS - 7 * 24 * ONE_HOUR_IN_MS,
      time2: TODAY_IN_MS - 7 * 24 * ONE_HOUR_IN_MS * 2,
    },
    {
      title: __("30d", SLUG),
      time: TODAY_IN_MS - 30 * 24 * ONE_HOUR_IN_MS,
      time2: TODAY_IN_MS - 30 * 24 * ONE_HOUR_IN_MS * 2,
    },
    {
      title: __("All", SLUG),
      time: TODAY_IN_MS - 18250 * 24 * ONE_HOUR_IN_MS, //18250 == 50 years
      time2: TODAY_IN_MS - 18250 * 24 * ONE_HOUR_IN_MS, //18250 == 50 years
    },
  ];

  return (
    <div className="stats-filter">
      {filterItems.map((cur, i) => (
        <Item
          key={i}
          info={cur}
          isActive={curFilter == i}
          setCurFilter={setCurFilter}
          index={i}
        />
      ))}
    </div>
  );
};

const Item = ({ info, setCurFilter, isActive, index }) => {
  const { state, dispatch } = useContext(StatisticsContext);

  const onClick = () => {
    setCurFilter(index);
    dispatch({ type: "SET_START_TIME_IN_MS", payload: info.time });
    dispatch({ type: "SET_PREV_START_TIME_IN_MS", payload: info.time2 });
  };

  return (
    <span onClick={onClick} className={isActive ? "active" : null}>
      {info.title}
    </span>
  );
};
