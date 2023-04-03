import React, { useReducer } from "react";
import MainErrorCapturer from "../../../../common/component/error-comp/main-error";
import useWeb3provider from "../../../../common/hook/wallet.hook";
import useDeployedContractsOnNetworks from "../../../../common/hook/contracts.hook";
import NoDeployedContract from "./no-deployed-contract";
import SelectContractStandard from "./select-contract-standard";
import Form from "./form";

import { CreateNftContext, INISIAL_STATE, REDUCER } from "./state";
import Networks from "./networks";

export const CreateNftIntegratiton = () => {
  const [state, dispatch] = useReducer(REDUCER, INISIAL_STATE);
  const deployedContracts = useDeployedContractsOnNetworks();
  const web3Provider = useWeb3provider();

  if (deployedContracts.isLoading) return null;

  if (!deployedContracts.contracts.length) return <NoDeployedContract />;

  const component = [
    <Networks web3Provider={web3Provider} />,
    <SelectContractStandard web3Provider={web3Provider} />,
    <Form web3Provider={web3Provider} />,
  ];

  return (
    <CreateNftContext.Provider
      value={{
        state: {
          ...state,
          deployedContracts: wp.hooks.applyFilters(
            "SMARTNFT_FILTER_CONTRACTS_BEFORE_RENDER",
            deployedContracts.contracts,
            [...deployedContracts.contracts]
          ),
        },
        dispatch,
      }}
    >
      <MainErrorCapturer>
        <div id="app">{component[state.component]}</div>
      </MainErrorCapturer>
    </CreateNftContext.Provider>
  );
};

const filterContracts = (contracts, originalContracts) => [contracts[0]];
wp.hooks.addFilter(
  "SMARTNFT_FILTER_CONTRACTS_BEFORE_RENDER",
  "SNFT",
  filterContracts,
  10
);
