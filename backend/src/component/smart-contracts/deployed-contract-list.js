import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { successMessage } from "../../../../common/component/message/success";
import {
  SLUG,
  NETWORKS,
  BACKENDMEDIAURL,
  FRONTENDMEDIAURL,
  BACKEND_AJAX_URL,
} from "../../../../common/store";
import { deploy } from "./deploy-contract-form";
import useContractGenaretor from "../../../../common/hook/contract-genaretor.hook";
import { Icons } from "../../../../common/component/icons";
import { Popup } from "../../../../common/component/popup";
import Switch from "../../../../common/component/switcher";
import { Erc20Form } from "./erc20-form";
import { DeployAuction } from "./auction-form";
const { __ } = wp.i18n;

const DeployedContract = ({ web3Provider }) => {
  const [contracts, setContracts] = useState(null);

  useEffect(() => {
    async function feachData() {
      try {
        const res = await web3Provider.getDeployedContracts();
        console.log("res", res);
        setContracts(res);
      } catch (err) {
        console.log(err);
      }
    }
    feachData();
  }, []);

  //no contract address found return null component
  if (!contracts) {
    return null;
  }

  return (
    <div className="deployed-contract">
      <h3>{__("Available Smart Contracts", SLUG)}</h3>
      {Object.keys(contracts).map((key) => (
        <List
          contract={contracts[key]}
          web3Provider={web3Provider}
          chainId={key}
          key={key}
        />
      ))}
    </div>
  );
};

const List = ({ contract, web3Provider, chainId }) => {
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState(
    NETWORKS.find((cur) => cur.chainId === parseInt(chainId))
  );
  console.log(chainId);

  const onClick = (standard, hasField) => {
    return async () => {
      try {
        if (!web3Provider.account[0]) {
          return await web3Provider.connect();
        }

        if (network.chainId != web3Provider.network.chainId) {
          await web3Provider.switchNetwork(network, web3Provider.wallet);
          return setNetwork[web3Provider.network];
        }

        const body = document.querySelector("body");
        const portalCon = document.createElement("div");
        portalCon.setAttribute("id", "smartnft-portal");
        body.appendChild(portalCon);

        const root = createRoot(portalCon);
        root.render(
          <PopupForm
            hasField={hasField}
            web3Provider={web3Provider}
            network={network}
            standard={standard}
          />
        );
      } catch (err) {
        console.error(err);
      }
    };
  };

  return (
    <div className="lists">
      <div className="network_name">
        <NetworkName network={network} contract={contract} />
      </div>
      <Item
        name={__("Marketplace", SLUG)}
        address={contract?.market?.address}
        fn={onClick("market", false)}
      />
      <div>
        <Item
          fn={onClick("proxy", false)}
          name={__("Proxy", SLUG)}
          address={contract?.proxy?.address}
          setOpen={setOpen}
        />
        <UpdateMarketPlaceOnProxy
          web3Provider={web3Provider}
          contra={contract}
          chainId={chainId}
          isOpen={open}
          setOpen={setOpen}
        />
      </div>
      <Item
        name={__("ERC-721", SLUG)}
        address={contract?.Erc721?.address}
        fn={onClick("Erc721", true)}
      />

      {wp.hooks.applyFilters("SMNFT_RENDER_ERC20_IMPORT_OR_DEPLOY_ITEM", [], {
        component: [
          <Erc20Form
            key={"erc20"}
            network={network}
            web3Provider={web3Provider}
          />,
        ],
      })}

      {wp.hooks.applyFilters(
        "SMNFT_RENDER_ERC1155_ITEM",
        [],
        {
          contract,
          fn: onClick,
        },
        Item
      )}

      {wp.hooks.applyFilters("SMNFT_RENDER_AUCTION_COMPONENT_ON_LIST", [], {
        component: [
          <DeployAuction
            key="auction"
            network={network}
            web3Provider={web3Provider}
          />,
        ],
      })}

      <div>
        <Switcher
          contract={contract}
          web3Provider={web3Provider}
          chainId={chainId}
        />
      </div>
    </div>
  );
};

const Switcher = ({ contract, web3Provider, chainId }) => {
  const _isActive = contract?.is_active === "true";
  const [isActive, setIsActive] = useState(_isActive);

  const updateActiveStatus = async () => {
    try {
      const res = await jQuery.ajax({
        type: "post",
        url: BACKEND_AJAX_URL,
        data: {
          action: "smartnft_active_deployed_contract",
          contract_info: {
            chain_id: chainId,
            is_active: !isActive,
          },
        },
      });
      setIsActive(!isActive);
      console.log(res);
      window.setTimeout(() => {
        location.reload();
      }, 100);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Switch isOn={isActive} handleToggle={updateActiveStatus} id={chainId} />
  );
};

const UpdateMarketPlaceOnProxy = ({
  web3Provider,
  contra,
  chainId,
  isOpen,
  setOpen,
}) => {
  if (!contra?.proxy?.address) return null;
  const [network, setNetwork] = useState(
    NETWORKS.find((cur) => cur.chainId === parseInt(chainId))
  );

  console.log("CONTRA", contra);

  const proxyContract = useContractGenaretor(
    contra.proxy.address,
    "Proxy",
    web3Provider.wallet
  );

  const [prevAdd, setPrevAdd] = useState(contra?.proxy?.marketOnProxy);
  const [marketAddress, setMarketAddress] = useState("");

  const updateMarketOnProxy = async () => {
    if (!marketAddress) return null;

    try {
      if (!web3Provider.account[0]) {
        await web3Provider.connect();
      }

      if (network.chainId != web3Provider.network.chainId) {
        await web3Provider.switchNetwork(network, web3Provider.wallet);
        setNetwork[web3Provider.network];
      }

      //update on the block chain
      await proxyContract.setImplementation(marketAddress);

      //store locally
      await web3Provider.storeMarketAddressOnProxy(
        web3Provider.network.chainId,
        marketAddress
      );

      setPrevAdd(marketAddress);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Popup isOpen={isOpen}>
      <div className="proxy-market-address">
        {prevAdd ? (
          <p>
            <span>{__("Market:", SLUG)}</span>
            <span>
              {prevAdd.slice(0, 7)}....{prevAdd.slice(prevAdd.length - 4)}
            </span>
          </p>
        ) : null}
        <>
          <h2>{__("Update Proxy Contract", SLUG)}</h2>
          <span className="close" onClick={(e) => setOpen(!isOpen)}>
            {Icons.close}
          </span>
          <p>
            {__(
              "Input your market contract address and Smart NFT will update the market contract via proxy contract",
              SLUG
            )}
          </p>
          <input
            type="text"
            value={marketAddress}
            placeholder={__("Market Contract Address", SLUG)}
            onChange={(e) =>
              setMarketAddress(e.target.value.trim().toLowerCase())
            }
          />
          <button onClick={updateMarketOnProxy} className="btn-primary">
            {__("Update Proxy", SLUG)}
          </button>
        </>
      </div>
    </Popup>
  );
};

const NetworkName = ({ network, contract }) => {
  const activeDeactiveIcon = () => {
    if (
      contract.market &&
      contract.proxy &&
      (contract.Erc721 || contract.Erc1155)
    ) {
      return <img src={`${BACKENDMEDIAURL}checkmark.svg`} />;
    }
    return <img src={`${BACKENDMEDIAURL}cross.svg`} />;
  };

  return (
    <span>
      {network ? network.nickName : "unknown"}
      {activeDeactiveIcon()}
    </span>
  );
};

const Item = ({ name, address, fn, setOpen }) => {
  const copyAddToClip = async () => {
    await navigator.clipboard.writeText(address);
    successMessage(__("Address copyed to clipboard.", SLUG));
  };

  return (
    <div className="item">
      <span className="name">
        {name}
        {address ? (
          <img src={`${BACKENDMEDIAURL}checkmark.svg`} />
        ) : (
          <img src={`${BACKENDMEDIAURL}cross.svg`} />
        )}
      </span>
      {address ? (
        <div>
          <span className="address" onClick={copyAddToClip}>
            {address.slice(0, 7)}....{address.slice(address.length - 4)}
          </span>
          <span className="update" onClick={(e) => setOpen(true)}>
            {name === "Proxy" ? Icons.update : ""}
          </span>
        </div>
      ) : (
        <span onClick={fn} className="button">
          {__("Deploy", SLUG)}
        </span>
      )}
    </div>
  );
};

const PopupForm = ({ hasField, web3Provider, network, standard }) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);

  const changeName = (e) => {
    const value = e.target.value;
    setName(value);
  };

  const changeSymbol = (e) => {
    const value = e.target.value;
    setSymbol(value);
  };

  const closePopup = () => {
    const portal = document.querySelector("#smartnft-portal");
    if (portal) portal.remove();
  };

  const onSubmit = async () => {
    await deploy({
      web3Provider,
      network,
      standard,
      name: name.trim(),
      symbol: symbol.trim(),
    });
    window.location.reload();
  };

  return (
    <div className="smart-nft-popup__container open portal">
      <div className="smart-nft-popup__inner portal">
        <div className="deploy_popup_form">
          <div className="deploy_popup_form__close">
            <img
              onClick={() => {
                closePopup();
              }}
              src={`${FRONTENDMEDIAURL}cross.svg`}
            />
          </div>
          {hasField ? (
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

          <button
            onClick={() => {
              setLoading(true);
              onSubmit();
            }}
          >
            {__("Deploy", SLUG)}
            {loading && <img src={`${BACKENDMEDIAURL}loaders/loading.svg`} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export { DeployedContract };
//<Item
//name={__("ERC-20", SLUG)}
//address={contract?.Erc20?.address}
//fn={onClick("Erc20", true)}
///>
