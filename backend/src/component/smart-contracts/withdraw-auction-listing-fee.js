import React, { useEffect, useState } from "react";
import { formatEther } from "ethers/lib/utils";
import { SLUG, FRONTENDMEDIAURL, NETWORKS } from "../../../../common/store";
import { successMessage } from "../../../../common/component/message/success";
import { errorMessage } from "../../../../common/component/message/error";
import { copyToClipboard } from "../../../../common/utils/utils";
import useContractGenaretor from "../../../../common/hook/contract-genaretor.hook";
const { __ } = wp.i18n;

export const WithdrawAuctionListingFee = ({ web3Provider }) => {
  const [balance, setBalance] = useState("");
  const [updateBalance, setUpdateBalance] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [contract, setContract] = useState(null);
  const [network, setNetwork] = useState(null);

  async function getBalance() {
    try {
      const res = await web3Provider.getDeployedContracts();
      const network = res[web3Provider.network.chainId];
      const address = network?.Auction?.address;
      if (!address) return null;
      const _contract = useContractGenaretor(
        address,
        "Auction",
        web3Provider.wallet
      );
      setContract(_contract);

      setNetwork(
        NETWORKS.find(
          (cur) => cur.chainId == web3Provider.network.chainId.toString()
        )
      );

      const _balance = await _contract.get_listing_fee();
      setBalance(formatEther(_balance));
      setDisableBtn(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!web3Provider.loading) getBalance();
  }, [web3Provider.loading, updateBalance]);

  const withdraw = async () => {
    try {
      if (!web3Provider.account.length) {
        await web3Provider.connect();
      }

      const tx = await contract.withdraw_listing_fee();
      await tx.wait();

      successMessage(__("Balance withdraw compleate", SLUG));
      setUpdateBalance(true);
    } catch (err) {
      console.log(err);
      errorMessage(
        __("Error, only contract deployer can call this action", SLUG)
      );
    }
    setDisableBtn(false);
  };

  return (
    <div className="withdraw-balance">
      <div className="withdraw-balance-inner">
        <h2>{__("My Auction Contract Balance", SLUG)}</h2>
        <h1>{`${balance ? balance : 0} ${
          network?.currencySymbol ? network?.currencySymbol : ""
        }`}</h1>
        <p>
          {contract?.address}
          <img
            src={`${FRONTENDMEDIAURL}copy.svg`}
            onClick={() => copyToClipboard(contract?.address, "Address")}
          />
        </p>
      </div>
      <div className="withdraw-balance-inner">
        <button
          disabled={disableBtn}
          onClick={(e) => {
            setDisableBtn(true);
            withdraw();
          }}
          className="btn-main-black"
        >
          {__("Withdraw Balance", SLUG)}{" "}
        </button>
      </div>
    </div>
  );
};
