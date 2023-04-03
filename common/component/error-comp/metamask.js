import React from "react";
import { SLUG, BACKENDMEDIAURL } from "../../store";
import { isMobileDevice } from "../../utils/utils";
const { __ } = wp.i18n;

export const MetamaskNotInstallError = () => {
  return (
    <div className="error">
      <h1>{__("Wallet not installed", SLUG)}</h1>
      <p className="error__message error__metamask-not-install">
        {isMobileDevice ? (
          <>
            {__(
              "Metamask App is necessary for this page. Open this page in Metamask App.",
              SLUG
            )}
            <a
              style={{ display: "flex", alignItems: "center", color: "#fff" }}
              href={`https://metamask.app.link/dapp/${location.href}`}
              target="_blank"
            >
              <img
                width={30}
                style={{ marginRight: 10 }}
                src={`${BACKENDMEDIAURL}mmicon.svg`}
              />
              {__("Open in Metamask App", SLUG)}
            </a>
          </>
        ) : (
          <>
            {__(
              "Wallet is not installed. Install the Metamask/Coinbase browser extension.",
              SLUG
            )}
            <a
              style={{ display: "flex", alignItems: "center", color: "#fff", "padding": "15px" }}
              href="https://metamask.io/download/"
              target="_blank"
            >
              <img
                width={30}
                style={{ marginRight: 10 }}
                src={`${BACKENDMEDIAURL}mmicon.svg`}
              />
              {__("Install Metamask Extension", SLUG)}
            </a>
            <a
              style={{ display: "flex", alignItems: "center", color: "#fff", textDecoration: "none", "padding": "15px" }}
              href="https://www.coinbase.com/wallet/downloads"
              target="_blank"
            >
              <img
                width={30}
                style={{ marginRight: 10 }}
                src={`${BACKENDMEDIAURL}mmicon.svg`}
              />
              {__("Install Coinbase Extension", SLUG)}
            </a>
          </>
        )}
      </p>
    </div>
  );
};

/*export const CorrectNetWorkNotSelectedError = ({ web3Provider }) => {
  const foundNetWork = NETWORKS.find(
    (cur) => cur.chainId === parseInt(ACTIVE_CONTRACT.network.chainId)
  );
  return (
    <div className="error">
      <h1>{__("Switch Network", SLUG)}</h1>
      <p className="error__message error__correct-net-not-selected">
        {__(
          `You are not connected to the correct network. 
           Your current network is ${web3Provider.network?.name}.
           Switch to currect network by clicking the button.
          `,
          SLUG
        )}
      </p>
      <button
        style={{ display: "flex", alignItems: "center", color: "#fff" }}
        className="switch-network"
        onClick={() => {
          web3Provider.switchNetwork(foundNetWork);
        }}
      >
        <img
          width={30}
          style={{ marginRight: 10 }}
          src={`${BACKENDMEDIAURL}mmicon.svg`}
        />
        {__(`Connect ${ACTIVE_CONTRACT.network.nickName}`, SLUG)}
      </button>
    </div>
  );
};
*/
export const WalletNotConnectedError = ({ web3Provider }) => {
  return (
    <div className="error">
      <h1>{__("Connect Wallet", SLUG)}</h1>
      <p className="error__message error__no-account-connected">
        {__("You are not connected to wallet. Connect your wallet", SLUG)}
        <button
          style={{ display: "flex", alignItems: "center", color: "#fff" }}
          className="connect-wallet"
          onClick={web3Provider.connect}
        >
          
          {__("Connect Wallet", SLUG)}
        </button>
      </p>
    </div>
  );
};
