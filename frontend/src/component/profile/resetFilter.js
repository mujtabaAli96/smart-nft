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
    <button className="reset-filter" onClick={reset}>
      {__("Reset Filter", SLUG)}
    </button>
  );
};

export default ResetFilter;
