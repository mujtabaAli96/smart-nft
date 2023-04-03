import React from "react";
import { SLUG, NETWORKS } from "../../../../common/store";
const { __ } = wp.i18n;

const NetworkInfo = ({ web3Provider }) => {
  console.log(web3Provider);
  const isConnect = web3Provider.account?.length
    ? web3Provider.account[0]
    : null;

  const network = NETWORKS.find(
    (network) => network.chainId === web3Provider.network?.chainId
  );

  return (
    <div className="form-wallet">
      <p className="form-wallet__title header-two">
        {__("Choose wallet", SLUG)}
      </p>
      <div className="form-wallet__display">
        <img
          className="form-wallet__icon"
          src={network?.icon}
          alt={__("blockchain logo", SLUG)}
        />
        <div>
          {isConnect ? (
            <p className="form-wallet__address">
              {isConnect.slice(0, 7)}...{isConnect.slice(-4)}
            </p>
          ) : (
            ""
          )}
          <p className="form-wallet__text pra-one">
            {__(network?.nickName, SLUG)}
          </p>
        </div>
        {isConnect ? (
          <span className="form-wallet__connected">
            {__("Connected", SLUG)}
          </span>
        ) : (
          <span className="form-wallet__connect" onClick={web3Provider.connect}>
            {__("Connect", SLUG)}
          </span>
        )}
      </div>
    </div>
  );
};

export default NetworkInfo;
