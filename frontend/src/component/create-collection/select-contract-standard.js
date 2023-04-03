import React, { useContext, useEffect } from "react";
import { CreateCollectionContext } from "./state";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const SingleStandard = ({ selectStandard }) => {
  return (
    <div
      className="contract__single"
      onClick={() => {
        selectStandard("Erc721");
      }}
    >
      <h2>{__("Single", SLUG)}</h2>
      <p>{__("Create collection on ERC-721 standard.", SLUG)}</p>
    </div>
  );
};

const renderSingleStandard = (component, state, dispatch) => {
  const selectStandard = (standard) => {
    dispatch({ type: "SET_STANDARD", payload: standard });
    dispatch({ type: "CHANGE_COMPONENT", payload: 2 });
  };

  return [
    ...component,
    state?.selectedContract?.contract?.market &&
    state?.selectedContract?.contract?.market?.address &&
    state?.selectedContract?.contract?.proxy &&
    state?.selectedContract?.contract?.market?.address ? (
      <SingleStandard selectStandard={selectStandard} key="single-standard" />
    ) : null,
  ];
};

wp.hooks.addFilter(
  "RENDER_CONTRACT_STANDARD_FOR_COLLECTION",
  "NFT_STANDARD_FOR_COLLECTION",
  renderSingleStandard,
  10
);

const SelectContractStandard = () => {
  const { state, dispatch } = useContext(CreateCollectionContext);

  const component = wp.hooks.applyFilters(
    "RENDER_CONTRACT_STANDARD_FOR_COLLECTION",
    [],
    state,
    dispatch
  );

  useEffect(() => {
    if (component.length == 1) {
      dispatch({ type: "SET_STANDARD", payload: "Erc721" });
      dispatch({ type: "CHANGE_COMPONENT", payload: 2 });
    }
  }, []);

  if (component.length == 1) return null;

  return (
    <>
      <div className="deployed-networks-heading">
        <h2>{__("Choose Contract Standard", SLUG)}</h2>
        <p>
          {__(
            "Choose the most suitable blockchain for your needs. You need to connect wallet for creation",
            SLUG
          )}
        </p>
      </div>
      <div className="contracts-standard">
        {component}
      </div>
    </>
  )
};

export default SelectContractStandard;
