import React from "react";
import { createRoot } from "react-dom/client";
import useWeb3provider from "../../common/hook/wallet.hook";
import { Deploy } from "./component/smart-contracts/deploy-contract";
import { DeployedContract } from "./component/smart-contracts/deployed-contract-list";
import { WithdrawBalance } from "./component/smart-contracts/withdraw-balance";
import MainErrorCapturer from "../../common/component/error-comp/main-error";
import { WithdrawAuctionListingFee } from "./component/smart-contracts/withdraw-auction-listing-fee";
const App = () => {
  const web3Provider = useWeb3provider();

  return (
    <MainErrorCapturer>
      <div id="app">
        <WithdrawBalance web3Provider={web3Provider} />
        <WithdrawAuctionListingFee web3Provider={web3Provider} />
        <DeployedContract web3Provider={web3Provider} />
        <Deploy web3Provider={web3Provider} />
      </div>
    </MainErrorCapturer>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);
if (container) {
  appRoot.render(<App />);
}
