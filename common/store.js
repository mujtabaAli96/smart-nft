import { INITIAL_STATE as initialSetting } from "../backend/src/component/settings/components/layout-settings/state";

const SLUG = "smartnft";
const BACKENDMEDIAURL = local.backendMediaUrl;
const FRONTENDMEDIAURL = local.frontendMediaUrl;
const BACKEND_AJAX_URL = local.backend_ajax_url;
const SITE_ROOT = local.site_root;
const SITE_TITLE = local.site_title;
const SETTINGS = local.settings || initialSetting;

const projectId = local.settings?.infuraProjectId
  ? local.settings?.infuraProjectId
  : null;
const projectSecret = local.settings?.infuraIpfsSecret
  ? local.settings?.infuraIpfsSecret
  : null;
const auth = `Basic ${btoa(`${projectId}:${projectSecret}`)}`;

const GATEWAY = "https://ola.infura-ipfs.io/ipfs/";

const IPFSINFO = {
  url: "ipfs.infura.io",
  port: 5001,
  auth,
};

const NFT_PER_PAGE = SETTINGS.nftpages?.all?.perpage
  ? parseInt(SETTINGS.nftpages?.all?.perpage)
  : 20;

const NETWORKS = [
  ...local.custom_networks.map((cur) => ({
    ...cur,
    chainId: parseInt(cur.chainId), //convert `string` chainId to `int` number otherwise get error
  })), // adds custom network form database
  {
    name: "homestead",
    chainId: 1,
    ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    nickName: "Ethereum",
    currencySymbol: "ETH",
    icon: `${BACKENDMEDIAURL}/networks/1.svg`,
    blockUrl: "https://etherscan.io/",
    rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    scanName: "Etherscan",
  },
  {
    name: "matic",
    chainId: 137,
    ensAddress: null,
    nickName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com"],
    currencySymbol: "MATIC",
    blockUrl: "https://polygonscan.com/",
    scanName: "polygonscan",
    icon: `${BACKENDMEDIAURL}/networks/137.svg`,
  },
  {
    name: "Mumbai",
    chainId: 80001,
    ensAddress: null,
    nickName: "Polygon Testnet Mumbai",
    rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
    currencySymbol: "MATIC",
    blockUrl: "https://mumbai.polygonscan.com/",
    scanName: "polygonscan",
    icon: `${BACKENDMEDIAURL}/networks/80001.svg`,
  },
  {
    name: "bnb",
    chainId: 56,
    ensAddress: null,
    nickName: "BNB Mainnet",
    rpcUrls: ["https://bsc-dataseed1.binance.org"],
    currencySymbol: "BNB",
    blockUrl: "https://bscscan.com/",
    scanName: "BNB Scan",
    icon: `${BACKENDMEDIAURL}/networks/56.svg`,
  },

  {
    name: "bnb",
    chainId: 97,
    ensAddress: null,
    nickName: "BNB Testnet",
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    currencySymbol: "BNB",
    blockUrl: "https://testnet.bscscan.com/",
    scanName: "BNB Scan",
    icon: `${BACKENDMEDIAURL}/networks/56.svg`,
  },

  {
    name: "avalance",
    chainId: 43114,
    ensAddress: null,
    nickName: "Avalanche C-Chain",
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    currencySymbol: "AVAX",
    blockUrl: "https://snowtrace.io/",
    scanName: "Avalanche Scan",
    icon: `${BACKENDMEDIAURL}/networks/43114.svg`,
  },
  {
    name: "Goerli Testnet",
    chainId: 5,
    ensAddress: "",
    nickName: "Goerli Testnet",
    currencySymbol: "ETH",
    blockUrl: "https://goerli.etherscan.io/",
    rpcUrls: ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    scanName: "Goerli Scan",
    icon: `${BACKENDMEDIAURL}/networks/default.svg`,
  },
  {
    name: "Sepolia",
    chainId: 11155111,
    ensAddress: "",
    nickName: "Sepolia Test Network",
    currencySymbol: "ETH",
    blockUrl: "https://sepolia.etherscan.io/",
    rpcUrls: ["https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    scanName: "Sepolia Scan",
    icon: `${BACKENDMEDIAURL}/networks/default.svg`,
  },
  {
    name: "HardHat Local Network",
    chainId: 1337,
    ensAddress: null,
    rpcUrls: ["http://127.0.0.1:8545/"],
    nickName: "HardHat Local Network",
    currencySymbol: "ETH",
    blockUrl: null,
    scanName: null,
    icon: `${BACKENDMEDIAURL}/networks/default.svg`,
  },
];

export {
  SITE_ROOT,
  SITE_TITLE,
  SLUG,
  BACKENDMEDIAURL,
  FRONTENDMEDIAURL,
  IPFSINFO,
  GATEWAY,
  BACKEND_AJAX_URL,
  NETWORKS,
  NFT_PER_PAGE,
  SETTINGS,
};
