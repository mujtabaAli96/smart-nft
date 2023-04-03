import { errorMessage } from "../../../../../common/component/message/error";
import {
  isMobileDevice,
  openMetaMaskUrl,
} from "../../../../../common/utils/utils";
import { SLUG } from "../../../../../common/store";
const { __ } = wp.i18n;

export const catchWalletError = async (nftInfo, web3Provider) => {
  const { network } = nftInfo.selectedContract;

  //wallet not install and mobile device case
  if (!web3Provider.hasAnyWallet() && isMobileDevice) {
    return openMetaMaskUrl();
  }

  //wallet not install case
  if (!web3Provider.hasAnyWallet()) {
    return errorMessage(__("Install Wallet", SLUG));
  }

  //logout case
  if (!web3Provider.account.length) {
    errorMessage("Connect Wallet");
    return web3Provider.connect();
  }

  //network not same case
  if (parseInt(network.chainId) !== web3Provider.network?.chainId) {
    errorMessage(__("Switch Network", SLUG));
    const newNetwork = { ...network, chainId: parseInt(network.chainId) };
    return await web3Provider.switchNetwork(newNetwork, web3Provider.wallet);
  }
};
