import React, { useState } from "react";
import { SLUG, FRONTENDMEDIAURL } from "../../../../common/store";
import { Popup } from "../../../../common/component/popup";
import { errorMessage } from "../../../../common/component/message/error";
import { successMessage } from "../../../../common/component/message/success";
import AuctionContract from "../../../../contracts/Auction";
import { ContractFactory } from "ethers/lib/ethers";
const { __ } = wp.i18n;

export const DeployAuction = ({ network, web3Provider }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>{__("View", SLUG)}</button>
      <Popup isOpen={isOpen} setIsOpen={setIsOpen}>
        <div id="smartnft-erc20-form">
          <img
            className="close"
            onClick={() => setIsOpen(false)}
            src={`${FRONTENDMEDIAURL}cross.svg`}
          />
          <div className="tabs">
            <Deploy _network={network} web3Provider={web3Provider} />
          </div>
        </div>
      </Popup>
    </div>
  );
};

const Deploy = ({ _network, web3Provider }) => {
  const [network, setNetwork] = useState(_network);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  //const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const deploy = async () => {
    if (!name || !symbol || !network?.chainId) {
      return errorMessage(__("Give proper information.", SLUG));
    }

    setLoading(true);

    try {
      if (!web3Provider.account[0]) {
        return await web3Provider.connect();
      }

      if (parseInt(network.chainId) != web3Provider.network.chainId) {
        await web3Provider.switchNetwork(network, web3Provider.wallet);
        return setNetwork[web3Provider.network];
      }

      //deploy contract
      const factory = ContractFactory.fromSolidity(
        AuctionContract,
        web3Provider.signer
      );
      const contract = await factory.deploy(name, symbol);
      await contract.deployTransaction.wait();
      const res = contract.address;

      //save contract information
      await web3Provider.storeDeployedContractInfoLocally({
        chain_id: network.chainId,
        address: res.toLowerCase(),
        standard: "Auction",
        name,
        symbol,
      });

      setLoading(false);
      setSuccess(true);
      successMessage(__("Auction Contract deployed successfully.", SLUG));
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      {success && !loading ? (
        <p>{__("Auction Contract deployed successfully.", SLUG)}</p>
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
