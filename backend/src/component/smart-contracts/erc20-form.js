import React, { useState, useEffect } from "react";
import { SLUG, FRONTENDMEDIAURL } from "../../../../common/store";
import { Popup } from "../../../../common/component/popup";
import { errorMessage } from "../../../../common/component/message/error";
import { successMessage } from "../../../../common/component/message/success";
import Erc20Contract from "../../../../contracts/Erc20";
import { ContractFactory } from "ethers/lib/ethers";
import { parseEther } from "ethers/lib/utils";
const { __ } = wp.i18n;

export const Erc20Form = ({ network, web3Provider }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [curTab, setTabs] = useState(0);
  const tabs = [
    <Import _network={network} web3Provider={web3Provider} />,
    <Deploy _network={network} web3Provider={web3Provider} />,
    <Contracts _network={network} web3Provider={web3Provider} />,
  ];
  const tabsName = [__("Import", SLUG), __("Deploy", SLUG), __("Contracts", SLUG)];

  return (
    <div className="item">
      <span className="name">{__("ERC/BEP-20", SLUG)}</span>
      <button className="button button-primary" onClick={() => setIsOpen(true)}>{__("View", SLUG)}</button>
      <Popup isOpen={isOpen} setIsOpen={setIsOpen}>
        <div id="smartnft-erc20-form">
          <img
            className="close"
            onClick={() => setIsOpen(false)}
            src={`${FRONTENDMEDIAURL}cross.svg`}
          />
          <div className="tabs-name">
            {tabsName.map((cur, i) => (
              <p
                key={i}
                onClick={() => setTabs(i)}
                className={i == curTab ? "active" : null}
              >
                {cur}
              </p>
            ))}
          </div>
          <div className="tabs">{tabs[curTab]}</div>
        </div>
      </Popup>
    </div>
  );
};

const Import = ({ _network, web3Provider }) => {
  const [network, setNetwork] = useState(_network);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const save = async () => {
    if (!name || !symbol || !address || !network?.chainId) {
      return errorMessage(__("Give proper information.", SLUG));
    }
    setLoading(true);

    try {
      if (!web3Provider.account[0]) {
        return await web3Provider.connect();
      }

      if (network.chainId != web3Provider.network.chainId) {
        await web3Provider.switchNetwork(network, web3Provider.wallet);
        return setNetwork[web3Provider.network];
      }

      await web3Provider.storeDeployedContractInfoLocally({
        chain_id: network.chainId,
        address: address,
        standard: "Erc20",
        name,
        symbol,
      });
      setLoading(false);
      setSuccess(true);
      successMessage(__("Custom token imported successfully.", SLUG));
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <p>{__("Custom token imported successfully.", SLUG)}</p>
      ) : (
        <>
          <div className="con-flex">
            <label htmlFor="name">
              <p className="name">{__("Name:", SLUG)}</p>
              <input
                type="text"
                placeholder={__("name", SLUG)}
                value={name}
                onChange={(e) => setName(e.target.value.trim())}
              />
            </label>
            <label htmlFor="symbol">
              <p className="symbol">{__("Symbol:", SLUG)}</p>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.trim())}
                placeholder={__("symbol", SLUG)}
              />
            </label>
          </div>

          <label htmlFor="contract" className="contract">
            <p className="contract-address">{__("Contract address:", SLUG)}</p>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value.trim().toLowerCase())}
              placeholder={__("address", SLUG)}
            />
          </label>

          <button onClick={save} className="save">
            {__("Save", SLUG)}
          </button>
        </>
      )}
    </>
  );
};

const Deploy = ({ _network, web3Provider }) => {
  const [network, setNetwork] = useState(_network);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  console.log(amount);

  const deploy = async () => {
    if (!name || !symbol || !network?.chainId) {
      return errorMessage(__("Give proper information.", SLUG));
    }

    setLoading(true);

    try {
      if (!web3Provider.account[0]) {
        return await web3Provider.connect();
      }

      if (network.chainId != web3Provider.network.chainId) {
        await web3Provider.switchNetwork(network, web3Provider.wallet);
        return setNetwork[web3Provider.network];
      }

      //deploy contract
      const factory = ContractFactory.fromSolidity(
        Erc20Contract,
        web3Provider.signer
      );
      const contract = await factory.deploy(
        name,
        symbol,
        parseEther(amount).toString()
      );
      await contract.deployTransaction.wait();
      const res = contract.address;

      //save contract information
      await web3Provider.storeDeployedContractInfoLocally({
        chain_id: network.chainId,
        address: res.toLowerCase(),
        standard: "Erc20",
        name,
        symbol,
      });

      setLoading(false);
      setSuccess(true);
      successMessage(__("Custom token deployed successfully.", SLUG));
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      {success && !loading ? (
        <p>{__("Custom token deployed successfully.", SLUG)}</p>
      ) : (
        <>
          {loading ? (
            <p>{__("Loading...", SLUG)}</p>
          ) : (
            <>
              <div className="con-flex">
                <label htmlFor="name">
                  <p className="name">{__("Name:", SLUG)}</p>
                  <input
                    type="text"
                    placeholder={__("name", SLUG)}
                    value={name}
                    onChange={(e) => setName(e.target.value.trim())}
                  />
                </label>
                <label htmlFor="symbol">
                  <p className="symbol">{__("Symbol:", SLUG)}</p>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.trim())}
                    placeholder={__("symbol", SLUG)}
                  />
                </label>
                <label htmlFor="amount">
                  <p className="amount">{__("Amount:", SLUG)}</p>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.trim())}
                    placeholder={__("amount", SLUG)}
                  />
                </label>
              </div>

              <button onClick={deploy} className="save">
                {__("Deploy", SLUG)}
              </button>
            </>
          )}
        </>
      )}
    </>
  );
};

const Contracts = ({ _network, web3Provider }) => {
  const [contracts, setContracts] = useState(null);
  const [loading, setLoading] = useState(true)
  const chainid = _network.chainId
  // console.log(chainid)
  useEffect(() => {
    async function feachData() {
      try {
        const res = await web3Provider.getDeployedContracts();
        setContracts(res[chainid].Erc20);
        setLoading(false)
      } catch (err) {
        console.log(err);
      }
    }
    feachData();
  }, []);

  if(loading) return <h4>Loading...</h4>
  //no contract address found return null component
  if (!contracts) {
    return <h4>No deplopyed BEP20 token contracts found</h4>;
  }
  const rows = [];
  for( const property in contracts ){
    rows.push(contracts[property])
  }
  return(
    <>
      {
        rows.map( obj => (
          <div>
            <b>{obj.name} {obj.symbol}</b>
          </div>
        ) )
      }
    </>
  )
}
