import React, { useContext, useEffect } from "react";
import useDeployedContractsOnNetworks from "../../../../common/hook/contracts.hook";
import { CreateCollectionContext } from "./state";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const Networks = ({ web3Provider }) => {
  const { state, dispatch } = useContext(CreateCollectionContext);
  const deployedContracts = useDeployedContractsOnNetworks();

  useEffect(() => {
    if (deployedContracts.isLoading || !deployedContracts.contracts.length) {
      return;
    }
    const filteredContracts = wp.hooks.applyFilters(
      "SMARTNFT_FILTER_CONTRACTS_BEFORE_RENDER_COLL_PAGE",
      deployedContracts.contracts,
      [...deployedContracts.contracts]
    );

    if (filteredContracts.length == 1) {
      dispatch({
        type: "SET_SELECTED_CONTRACT",
        payload: filteredContracts[0],
      });
      dispatch({ type: "CHANGE_COMPONENT", payload: 1 });
    }

    dispatch({ type: "SET_DEPLOYED_CONTRACT", payload: filteredContracts });
  }, [deployedContracts.isLoading]);

  return (
    <>
      <div className="deployed-networks-heading">
        <h2>{__("Choose Blockchain", SLUG)}</h2>
        <p>
          {__(
            "Choose the most suitable blockchain for your needs. You need to connect wallet for creation",
            SLUG
          )}
        </p>
      </div>
      <div className="deployed-networks">
        {state.deployedContracts.map((cur, i) => (
          <Network
            contract={cur}
            dispatch={dispatch}
            key={i}
            web3Provider={web3Provider}
          />
        ))}
      </div>
    </>
  );
};

const filterContracts = (contracts, originalContracts) => [contracts[0]];
wp.hooks.addFilter(
  "SMARTNFT_FILTER_CONTRACTS_BEFORE_RENDER_COLL_PAGE",
  "SNFT",
  filterContracts,
  10
);

const Network = ({ contract, dispatch, web3Provider }) => {
  const changeNetworkAndSetContract = async () => {
    try {
      if (web3Provider.network.chainId != parseInt(contract.network.chainId)) {
        return await web3Provider.switchNetwork(
          contract.network,
          web3Provider.wallet
        );
      }
      dispatch({ type: "SET_SELECTED_CONTRACT", payload: contract });
      dispatch({ type: "CHANGE_COMPONENT", payload: 1 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="network" onClick={changeNetworkAndSetContract}>
      <img src={contract?.network?.icon} />
      <h2>{contract?.network?.nickName}</h2>
    </div>
  );
};

export default Networks;
