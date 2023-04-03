import { useState, useEffect } from "react";
import { ContractFactory, providers } from "ethers/lib/ethers";
import { BACKEND_AJAX_URL, SLUG } from "../store";
const { __ } = wp.i18n;
import { connectWalletPopup } from "../component/connect-wallet/connect-wallet-popup";
// import { SignClient } from "@walletconnect/sign-client";
// import { Web3Modal } from "@web3modal/standalone";

const hasAnyWallet = () => {
  const wallet = window.ethereum;
  if (!wallet) return null;

  return wallet;
};

const hasMultipleWallet = () => {
  const wallet = hasAnyWallet();
  if (!wallet) return false;

  //check if multiple wallet extention is installed
  if (!wallet.providerMap) return false;

  if (wallet.providerMap.size > 1) return true;
  return false;
};

const selectMetaMaskWallet = () => {
  if (!hasAnyWallet()) throw new Error(__("No wallet is Installed.", SLUG));
  let wallet = hasAnyWallet();

  //when dont have multiple wallet
  if (!hasMultipleWallet()) {
    if (!wallet.isMetaMask) {
      throw new Error(__("Cant find metamask wallet.", SLUG));
    }

    window.localStorage.setItem("smnft_selected_wallet_name", "MetaMask");
    return wallet;
  }

  //when have multiple wallet
  const providerMap = wallet.providerMap;
  if (!providerMap.get("MetaMask")) {
    throw new Error(__("Cant find metamask wallet.", SLUG));
  }

  window.localStorage.setItem("smnft_selected_wallet_name", "MetaMask");
  return providerMap.get("MetaMask");
};

const selectCoinbaseWallet = () => {
  if (!hasAnyWallet()) throw new Error(__("No wallet is Insalled.", SLUG));
  let wallet = hasAnyWallet();

  //when dont have multiple wallet
  if (!hasMultipleWallet()) {
    if (!wallet.isCoinbaseWallet) {
      throw new Error(__("Cant find Coninbase wallet.", SLUG));
    }

    window.localStorage.setItem("smnft_selected_wallet_name", "MetaMask");
    return wallet;
  }

  //when have multiple wallet
  const providerMap = wallet.providerMap;
  if (!providerMap.get("CoinbaseWallet")) {
    throw new Error(__("Cant find Coinbase wallet.", SLUG));
  }
  window.localStorage.setItem("smnft_selected_wallet_name", "CoinbaseWallet");
  return providerMap.get("CoinbaseWallet");
};

const selectWalletConnect = () => {
  const [signClient, setSignClient] = useState()
  console.log("hi")
};

const isMetaMaskInstalled = () => {
  if (!hasAnyWallet()) return false;
  let wallet = hasAnyWallet();

  //when dont have multiple wallet
  if (!hasMultipleWallet()) {
    if (!wallet.isMetaMask) return false;
    return true;
  }
  //when have multiple wallet
  const providerMap = wallet.providerMap;
  if (!providerMap.get("MetaMask")) return false;
  return true;
};

const isCoinbaseInstalled = () => {
  if (!hasAnyWallet()) return false;
  let wallet = hasAnyWallet();

  //when dont have multiple wallet
  if (!hasMultipleWallet()) {
    if (!wallet.isCoinbaseWallet) return false;
    return true;
  }
  //when have multiple wallet
  const providerMap = wallet.providerMap;
  if (!providerMap.get("CoinbaseWallet")) return false;
  return true;
};

const hasAccount = async (wallet) => {
  const account = await wallet.request({ method: "eth_accounts" });
  if (!account) return [];

  return account;
};

const requestAccount = async (wallet) => {
  const account = await wallet.request({ method: "eth_requestAccounts" });
  if (!account) return [];

  return account;
};

const addNetwork = async (network, wallet) => {
  try {
    await wallet.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${network.chainId.toString(16)}`,
          chainName: network.nickName,
          nativeCurrency: {
            name: network.name,
            symbol: network.currencySymbol,
            decimals: 18,
          },
          rpcUrls: network.rpcUrls,
        },
      ],
    });
  } catch (err) {
    console.log("Add netWork Error: ", err);
  }
};

const switchNetwork = async (network, wallet) => {
  if (!wallet || !network)
    throw new Error(
      `switchNetwork:Error->> network:${network},wallet:${wallet}`
    );

  try {
    await wallet.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${network.chainId.toString(16)}` }],
    });
  } catch (err) {
    if (err.code === 4902) {
      await addNetwork(network, wallet);
      await wallet.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      });
      return null;
    }
    console.log("Switch network error: ", err);
  }
};

const deployContract = async ({
  solidityCompiledJsonObj,
  signer,
  name,
  symbol,
}) => {
  const factory = ContractFactory.fromSolidity(solidityCompiledJsonObj, signer);

  try {
    let contract;
    if (name && symbol) {
      contract = await factory.deploy(name, symbol);
    } else {
      contract = await factory.deploy();
    }
    await contract.deployTransaction.wait();
    return contract.address;
  } catch (err) {
    throw new Error(`Contract deploy failed. Error message:${err}`);
  }
};

const storeDeployedContractInfoLocally = async (info) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        contract_info: info,
        action: "smartnft_store_deployed_network_contract",
      },
    });

    console.log(res);

    return res;
  } catch (err) {
    console.log(err);
  }
};

const storeMarketAddressOnProxy = async (chainId, address) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        action: "smartnft_store_market_address_on_proxy",
        chainId,
        address,
      },
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const getDeployedContracts = async () => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        action: "smartnft_get_deployed_network_contracts",
      },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const connect = async (wallet) => {
  await requestAccount(wallet);
  window.location.reload();
};

const disconnect = () => {
  window.localStorage.removeItem("smnft_selected_wallet_name");
  window.location.reload();
};

const openConnectWalletPopup = () => {
  connectWalletPopup();
};

const useWeb3provider = () => {
  const [web3Provider, setWeb3Provider] = useState({
    provider: null,
    signer: null,
    account: [],
    network: null,
    deployContract: deployContract,
    connect: openConnectWalletPopup,
    disconnect,
    connectWallet: connect,
    switchNetwork,
    addNetwork,
    storeDeployedContractInfoLocally,
    storeMarketAddressOnProxy,
    getDeployedContracts,
    wallet: null,
    loading: true,
    //
    hasAnyWallet,
    hasMultipleWallet,
    selectMetaMaskWallet,
    selectCoinbaseWallet,
    selectWalletConnect,
    isCoinbaseInstalled,
    isMetaMaskInstalled,
  });

  //add this web3Provider to window
  window.SMNFT_WEB3_PROVIDER = { web3Provider, setWeb3Provider };

  useEffect(() => {
    async function loadWeb3Provider() {
      try {
        if (!hasAnyWallet()) {
          return setWeb3Provider((prev) => ({ ...prev, loading: false }));
        }
        const prevWallet = window.localStorage.getItem(
          "smnft_selected_wallet_name"
        );

        let wallet;
        if (prevWallet === "MetaMask") wallet = selectMetaMaskWallet();
        if (prevWallet === "CoinbaseWallet") wallet = selectCoinbaseWallet();

        if (!wallet) {
          return setWeb3Provider((prev) => ({ ...prev, loading: false }));
        }

        const provider = new providers.Web3Provider(wallet);
        const signer = provider.getSigner();
        const account = await provider.listAccounts();
        const network = await provider.getNetwork();
        setWeb3Provider((prev) => ({
          ...prev,
          provider,
          signer,
          account,
          network,
          wallet,
          loading: false,
        }));
        //add this web3Provider to window
        window.SMNFT_WEB3_PROVIDER = { web3Provider, setWeb3Provider };

        wallet.on("accountsChanged", (account) => {
          setWeb3Provider((prev) => ({ ...prev, account }));
        });

        wallet.on("chainChanged", () => {
          window.location.reload();
        });

        wallet.on("connect", () => {
          window.location.reload(true);
        });

        wallet.on("disconnect", () => {
          window.location.reload();
        });
      } catch (err) {
        console.log(err);
        return setWeb3Provider((prev) => ({ ...prev, loading: false }));
      }
    }
    loadWeb3Provider();
  }, []);

  return web3Provider;
};

export default useWeb3provider;
