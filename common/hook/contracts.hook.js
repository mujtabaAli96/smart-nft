import { useState, useEffect } from "react";
import { errorMessage } from "../component/message/error";
import { BACKEND_AJAX_URL, SLUG, NETWORKS } from "../store";
const { __ } = wp.i18n;

const filterIncompleteContracts = (contracts) => {
  const keys = Object.keys(contracts);
  if (!keys.length) return [];
  let completeContracts = [];

  keys.forEach((key) => {
    //if proxy,market and any standard (721,1155) is available then
    //its a complete deployed contracts
    const contract = contracts[key];
    if (
      contract.proxy &&
      contract.proxy?.address &&
      contract.market &&
      contract.market?.address &&
      contract.is_active === "true" &&
      ((contract.Erc721 && contract.Erc721?.address) ||
        (contract.Erc1155 && contract.Erc1155?.address))
    ) {
      const network = NETWORKS.find((net) => net.chainId === parseInt(key));
      completeContracts.push({ contract, network });
    }
  });

  console.log(completeContracts);

  return completeContracts;
};

const useDeployedContractsOnNetworks = () => {
  const [isLoading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: {
            action: "smartnft_get_deployed_network_contracts",
          },
        });

        console.log(res);

        setContracts(filterIncompleteContracts(res.data));
        setLoading(false);
      } catch (err) {
        console.log(err);
        errorMessage(__("Error featching deployed contracts", SLUG));
      }
    }
    fetchData();
  }, []);

  return {
    isLoading,
    contracts,
  };
};

export default useDeployedContractsOnNetworks;
