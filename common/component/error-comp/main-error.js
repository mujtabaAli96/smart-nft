import React from "react";
import { MetamaskNotInstallError, WalletNotConnectedError } from "./metamask";
import useWeb3provider from "../../hook/wallet.hook";

const MainErrorCapturer = ({ children }) => {
  const web3Provider = useWeb3provider();
  const isConnected = web3Provider.account?.length ? true : false;

  if (web3Provider.loading) return null;

  //1.handle wallet not install error
  if (!web3Provider.hasAnyWallet()) return <MetamaskNotInstallError />;

  //4.handle account not connected
  if (!isConnected)
    return <WalletNotConnectedError web3Provider={web3Provider} />;

  return { ...children };
};

export default MainErrorCapturer;
