import React, { useContext } from "react";
import { CreateCollectionContext } from "./state";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const SelectFreeOrActual = () => {
  const { state, dispatch } = useContext(CreateCollectionContext);

  const changeCon = (isFree) => {
    if (!isFree) return dispatch({ type: "CHANGE_COMPONENT", payload: 3 });

    let conAd = state.selectedContract.contract[state.standard].address;
    dispatch({ type: "CHANGE_FREE", payload: true });
    dispatch({ type: "CHANGE_CONTRACT_ADDRESS", payload: conAd });
    dispatch({ type: "CHANGE_COMPONENT", payload: 3 });
  };

  return (
    <div className="selectFreeOrActual">
      <div onClick={(e) => changeCon(true)}>
        <h2>{__("Create Free", SLUG)}</h2>
      </div>
      <div onClick={(e) => changeCon(false)}>
        <h2>{__("On Network", SLUG)}</h2>
      </div>
    </div>
  );
};

export default SelectFreeOrActual;
