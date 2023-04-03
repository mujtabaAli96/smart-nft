import React, { useContext } from "react";
import { SLUG } from "../../../../common/store";
import { FilterContext } from "./state";
const { __ } = wp.i18n;

const ResetFilter = () => {
  const { state, dispatch } = useContext(FilterContext);

  const reset = () => {
    window.location.reload();
    //dispatch({ type: "LOADING", payload: true });
    //dispatch({ type: "RESET_FILTER" });
  };

  return (
    <a className="reset-filter" onClick={reset}>
      {__("Clear All", SLUG)}
    </a>
  );
};

export default ResetFilter;
