import React, { useState } from "react";
import { successMessage } from "../../../../common/component/message/success";
import { errorMessage } from "../../../../common/component/message/error";
import { NETWORKS } from "../../../../common/store";
import { Icons } from "../../../../common/component/icons"
import {
  SLUG,
  BACKENDMEDIAURL,
  BACKEND_AJAX_URL,
} from "../../../../common/store";
import { DeployContractForm } from "./deploy-contract-form";
import AddNetworkBtn from "./add-network";
import EditNetwork from "./edit-network";
const { __ } = wp.i18n;
console.log(NETWORKS)
const NetworkList = ({ web3Provider }) => {
  const [isOpenDeployWindow, setIsOpenDeployWindow] = useState(false);
  const [editNetwork, setEditNetwork] = useState(null)
  const [editPopup, setEditPopup] = useState(false)
  const removeCustomNetwork = async (chainid) => {
    try {
      const res = await jQuery.ajax({
        type: "post",
        url: BACKEND_AJAX_URL,
        data: {
          chainid,
          action: "remove_custom_network",
        },
      });
      successMessage(__("Network removed successfullly", SLUG));
      window.location.reload();
    } catch (err) {
      console.log(err);
      errorMessage(__("Network removal failed", SLUG));
    }
  };

  const editCustomNetwork = (cur) => {
    setEditNetwork(cur)
    setEditPopup(true)
  }

  const onNetworkChange = async (chainId) => {
    if (web3Provider.network?.chainId === chainId) return;
    // console.log('working');
    const foundNetWork = NETWORKS.find((cur) => cur.chainId === chainId);

    if (!foundNetWork) throw new Error("Network is not found.");

    await web3Provider.switchNetwork(foundNetWork, web3Provider.wallet);
  };

  const isAlreadyDeployed = async () => {
    const res = await web3Provider.getDeployedContracts();
    if (res[web3Provider.network.chainId]) {
      errorMessage(
        __(
          "Your already deploy to this network. Use above table for modification.",
          SLUG
        )
      );
      return null;
    }
    console.log(res);
    setIsOpenDeployWindow(true);
  };

  return (
    <>
      <DeployContractForm
        isOpenDeployWindow={isOpenDeployWindow}
        setIsOpenDeployWindow={setIsOpenDeployWindow}
        web3Provider={web3Provider}
      />
      <div className="deploy-contract__container">
        <div className="deploy-contract__head">
          <h3>{__("Deploy Smart Contract", SLUG)}</h3>
          <AddNetworkBtn />
        </div>
        <EditNetwork editNetwork={editNetwork} open={editPopup} setOpen={setEditPopup} />
        <div className="deploy-contract__networks">
          {NETWORKS.map((cur, i) => (
            <div style={{ position: "relative" }} key={i}>
              <div
                className={
                  "single-network " +
                  (web3Provider?.network?.chainId === cur.chainId
                    ? "current"
                    : "")
                }
                onClick={(e) => onNetworkChange(cur.chainId)}
                key={cur.chainId}
              >
                {cur.icon && <img src={cur.icon} />}
                {!cur.icon && (
                  <img src={`${BACKENDMEDIAURL}/networks/default.svg`} />
                )}
                <div>
                  <h4>{cur.nickName}</h4>
                  {cur.chainId && (
                    <span className="chainID">
                      {__("ChainID: ", SLUG)} <strong>{cur.chainId}</strong>
                    </span>
                  )}
                </div>
              </div>
              {cur.type == "custom" && (
                <div className="custom-actions">
                  <span onClick={(e) => editCustomNetwork(cur)}>
                    {Icons.edit}
                  </span>
                  <span onClick={(e) => removeCustomNetwork(cur.chainId)}>
                    {Icons.delete}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className="deploy-button button button-primary"
          onClick={isAlreadyDeployed}
        >
          {__("Deploy your contract", SLUG)}
        </button>
      </div>
    </>
  );
};

const Deploy = ({ web3Provider }) => {
  return (
    <div className="deploy">
      <NetworkList web3Provider={web3Provider} />
    </div>
  );
};

export { Deploy };
