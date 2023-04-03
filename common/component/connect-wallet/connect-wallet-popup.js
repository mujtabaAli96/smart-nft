import { isMobileDevice } from "../../utils/utils";
import { SLUG, BACKENDMEDIAURL, FRONTENDMEDIAURL } from "../../store";
const { __ } = wp.i18n;

export const connectWalletPopup = () => {
  const markup = `
    <div class="smart-nft-popup__container open connect-wallet-popup">
      <div class="smart-nft-popup__inner">
        <h2>${__("Connect your wallet", SLUG)}</h2>
        <div class="wallet-connect">
          ${wp.hooks.applyFilters("SNFT_RENDER_WALLET_NAME_FOR_CONNECT", "")}
        </div>
        <img src=${FRONTENDMEDIAURL}cross.svg class="close-wallet-connect"/>
	    </div>
    </div>
	`;

  removePrevPopup();
  document.querySelector("body").insertAdjacentHTML("beforeend", markup);

  //add event listener
  const cross = document.querySelector(".close-wallet-connect");
  const mm = document.querySelector(".metamask-connect");
  if (cross) cross.addEventListener("click", removePrevPopup);
  if (mm) mm.addEventListener("click", connect);

  wp.hooks.doAction("SNFT_ADD_LISTENER_ON_RENDERED_WALLET");
};

const connect = () => {
  if (!SMNFT_WEB3_PROVIDER.web3Provider.isMetaMaskInstalled()) {
    return smartnftRenderNotInstallMessage("mm");
  }
  const wallet = SMNFT_WEB3_PROVIDER.web3Provider.selectMetaMaskWallet();
  SMNFT_WEB3_PROVIDER.web3Provider.connectWallet(wallet);
};

const removePrevPopup = () => {
  const prev = document.querySelector(".connect-wallet-popup");
  if (prev) prev.remove();
};

const metaMaskConnectMarkup = (prevValue) => {
  return `
  	${prevValue}
    <div class="metamask-connect">
      <img src="${BACKENDMEDIAURL}mmicon.svg"/>
      <h3>${__("Metamask wallet", SLUG)}</h3>
    </div>
	`;
};

wp.hooks.addFilter(
  "SNFT_RENDER_WALLET_NAME_FOR_CONNECT",
  "SNFT_MM",
  metaMaskConnectMarkup,
  10
);

const metamaskMobileMarkup = () =>
  `${__(
    "Metamask App is necessary for this page. Open this page in Metamask App.",
    SLUG
  )}
  <a style='display:flex; align-items:center; color:#fff;'
     href=${`https://metamask.app.link/dapp/${location.href}`}
     target="_blank"
  >
  <img style='margin-right:10px; width:30px;' src=${`${BACKENDMEDIAURL}mmicon.svg`}/>
     ${__("Open in Metamask App", SLUG)}
  </a>
 `;

const installLink = (url, name) => {
  let iconUrl;
  if (name == "Metamask") iconUrl = `${BACKENDMEDIAURL}mmicon.svg`;
  if (name == "Coinbase") iconUrl = `${BACKENDMEDIAURL}coinbase-logo.jpg`;

  return `
  ${__(`Wallet is not install. Install the ${name} browser extension.`, SLUG)}
   <a style='display:flex; align-items:center; color:#fff;' href=${url} target="_blank">
	 <img style='margin-right:10px; width:30px;' src=${iconUrl} />
     ${__(`Install ${name} Extension`, SLUG)}
   </a>
 `;
};

const notInstallMessageMarkup = (name) => {
  let extension;
  if (name == "mm") extension = "Metamask";
  if (name == "cb") extension = "Coinbase";
  const mmLink = "https://metamask.io/download/";
  const cbLink = "https://www.coinbase.com/wallet/downloads";

  if (!extension) return "";

  const markup = `
  <div class="error">
      <h1>${__("Wallet not installed", SLUG)}</h1>
      <p className="error__message error__metamask-not-install">
		${isMobileDevice && extension == "Metamask" ? metamaskMobileMarkup() : ""}
		${
      !isMobileDevice && extension == "Metamask"
        ? installLink(mmLink, extension)
        : ""
    }
		${
      !isMobileDevice && extension == "Coinbase"
        ? installLink(cbLink, extension)
        : ""
    }
      </p>
  </div>`;
  return markup;
};

window.smartnftRenderNotInstallMessage = (walletShortName) => {
  const con = document.querySelector(".wallet-connect");
  if (!con) return;
  //empty the container
  con.innerHTML = "";
  con.innerHTML = notInstallMessageMarkup(walletShortName);
};