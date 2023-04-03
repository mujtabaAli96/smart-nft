import React, { useState, useEffect } from "react";
import {
  SLUG,
  NETWORKS,
  FRONTENDMEDIAURL,
  BACKENDMEDIAURL,
} from "../../../../common/store";
import { successMessage } from "../../../../common/component/message/success";
import { errorMessage } from "../../../../common/component/message/error";
import implementationV2Contract from "../../../../contracts/ImplementationV2";
import proxyContract from "../../../../contracts/Proxy";
import Erc721Contract from "../../../../contracts/Erc721";
import Erc1155Contract from "../../../../contracts/Erc1155";
import { Icons } from "../../../../common/component/icons";
const { __ } = wp.i18n;

const getContract = (standard) => {
  if (standard == "market") return implementationV2Contract;
  if (standard == "proxy") return proxyContract;
  if (standard == "Erc721") return Erc721Contract;
  if (standard == "Erc1155") return Erc1155Contract;
};

const deploy = async ({ web3Provider, network, standard, name, symbol }) => {
  if (!network?.chainId) {
    errorMessage(__("Network is not found.", SLUG));
    throw new Error("Network is not found.");
  }

  if (!web3Provider.account.length) {
    await web3Provider.connect();
  }

  if (!name || !symbol) {
    //setPopup(false);
    if (standard == "Erc721" || standard == "Erc1155") {
      errorMessage(__("Name or symbol cant be blank.", SLUG));
      throw new Error("Name or symbol cant be blank.");
    }
  }

  const res = await web3Provider.deployContract({
    solidityCompiledJsonObj: getContract(standard),
    signer: web3Provider.signer,
    name,
    symbol,
  });

  console.log(res);
  const res2 = await web3Provider.storeDeployedContractInfoLocally({
    chain_id: network.chainId,
    address: res.toLowerCase(),
    standard,
    name,
    symbol,
  });

  console.log(res2);

  successMessage(__("Contract deployed successfully.", SLUG));
};

const DeployContractForm = ({
  isOpenDeployWindow,
  setIsOpenDeployWindow,
  web3Provider,
}) => {
  const component = [];
  return (
    <div
      className={`smart-nft-popup__container ${
        isOpenDeployWindow ? "open" : ""
      }`}
    >
      <div style={{ padding: "30px" }} className="smart-nft-popup__inner">
        <div className="deploy-contract-form__close">
          <img
            onClick={() => {
              setIsOpenDeployWindow(false);
              window.location.reload();
            }}
            src={`${FRONTENDMEDIAURL}cross.svg`}
          />
          {wp.hooks.applyFilters(
            "RENDER_DEPLOYABLE_CONTRACT",
            component,
            web3Provider,
            Form
          )}
        </div>
      </div>
    </div>
  );
};

const renderBasicForms = (component, web3Provider, Form) => {
  return [
    ...component,
    <Form
      title={__("Marketplace Contract", SLUG)}
      des={__(
        "To buy and sell your nfts  in this network you need to deploy your market contract.",
        SLUG
      )}
      web3Provider={web3Provider}
      standard="market"
      hasField={false}
      key="market"
    />,
    <Form
      title={__("Upgradeable Proxy Contract", SLUG)}
      des={__(
        "This proxy will update your contract without lose any data",
        SLUG
      )}
      web3Provider={web3Provider}
      standard="proxy"
      hasField={false}
      key="proxy"
    />,
    <Form
      title={__("ERC 721 Contract", SLUG)}
      des={__(
        "To buy and sell your nfts  in this network you need to deploy your market contract.",
        SLUG
      )}
      web3Provider={web3Provider}
      standard="Erc721"
      hasField={true}
      key="erc721"
    />,
  ];
};

wp.hooks.addFilter(
  "RENDER_DEPLOYABLE_CONTRACT",
  "RENDER_DEPLOYABLE_CONTRACT_FORM",
  renderBasicForms,
  10
);

const Form = ({ title, des, web3Provider, standard, hasField }) => {
  const [showField, setShowField] = useState(false);
  const [network, setNetwork] = useState(null);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const changeSwitch = () => {
    setShowField(!showField);
  };

  const changeName = (e) => {
    const value = e.target.value;
    setName(value);
  };

  const changeSymbol = (e) => {
    const value = e.target.value;
    setSymbol(value);
  };

  const onSubmit = async () => {
    try {
      await deploy({
        web3Provider,
        network,
        standard,
        name: name.trim(),
        symbol: symbol.trim(),
      });
      setLoading(false);
      setDeployed(true);
    } catch (err) {
      setLoading(false);
      console.error("errr", err);
      errorMessage(__("Something is wrong! Failed to deploy.", SLUG));
    }
  };

  useEffect(() => {
    const netWork = NETWORKS.find(
      (cur) => cur.chainId === web3Provider.network?.chainId
    );
    setNetwork(netWork);
  }, [web3Provider]);

  return (
    <div className="deploy-contract-form">
      {deployed ? (
        <div className="done">
          <img src={`${BACKENDMEDIAURL}loaders/done.svg`} />
          <h3>{__("Contract Deployed successfully.")}</h3>
        </div>
      ) : (
        <>
          <div className="con-flex">
            <div>
              <h2>{title}</h2>
              <p>{des}</p>
            </div>
            {hasField ? (
              <div className="flex">
                <span
                  className={showField ? "switch open" : "switch close"}
                  onClick={changeSwitch}
                ></span>
              </div>
            ) : null}
          </div>
          {showField ? (
            <div className="input-box">
              <label htmlFor="name">
                <p>{__("Contract name:", SLUG)}</p>
                <input onChange={changeName} value={name} type="text" />
              </label>
              <label htmlFor="symbol">
                <p>{__("Contract symbol:", SLUG)}</p>
                <input onChange={changeSymbol} value={symbol} type="text" />
              </label>
            </div>
          ) : null}
          {showField || !hasField ? (
            <button
              onClick={() => {
                setLoading(true);
                onSubmit();
              }}
              className={loading ? "loading" : "not-loading"}
            >
              {__("Deploy Contract", SLUG)}
              {loading && Icons.loader}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
};

export { DeployContractForm, deploy };
