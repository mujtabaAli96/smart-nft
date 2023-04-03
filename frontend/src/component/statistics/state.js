import { createContext } from "react";
export const StatisticsContext = createContext();

const ONE_HOUR_IN_MS = 1 * 60 * 60 * 1000;
const TODAY_IN_MS = Date.now();

export const INISIAL_STATE = {
  startTimeInMS: TODAY_IN_MS - 18250 * 24 * ONE_HOUR_IN_MS,
  prevStartTimeInMS: TODAY_IN_MS - 18250 * 24 * ONE_HOUR_IN_MS,
};
console.log( INISIAL_STATE.startTimeInMS, INISIAL_STATE.prevStartTimeInMS )
export const REDUCER = (state, action) => {
  const type = action.type;
  const payload = action.payload;

  if (type == "SET_START_TIME_IN_MS") {
    return { ...state, startTimeInMS: payload };
  }
  if (type == "SET_PREV_START_TIME_IN_MS") {
    return { ...state, prevStartTimeInMS: payload };
  }
};
