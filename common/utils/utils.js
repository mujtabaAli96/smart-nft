import { parseEther, BigNumber } from "ethers/lib/utils";
import { SETTINGS, SLUG } from "../store";
import { successMessage } from "../component/message/success";
const { __ } = wp.i18n;

export const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);

export function openMetaMaskUrl() {
  const a = document.createElement("a");
  const url = window.location.href;
  a.href = `https://metamask.app.link/dapp/${url}`;
  a.target = "_self";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function setMetaInfoInHeaderForSocialShare({ imgUrl, title }) {
  const meta = `
    <meta property="og:title" content="${title}" />
    <meta property="og:image" content="${imgUrl}" />
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:image" content="${imgUrl}">
  `;

  const headDom = document.querySelector("header");

  if (!headDom) return null; //gurd close

  headDom.insertAdjacentHTML("afterbegin", meta);
}

//price in ether not wei
export function calculateListingPriceInEther(price) {
  console.log(parseFloat(price));
  if (SETTINGS.listingPriceActive === "false") return 0;

  if (SETTINGS.listingType === "2") {
    return parseEther(SETTINGS.listingPrice || "0");
  }

  if (SETTINGS.listingType === "1") {
    const listingPrice = parseFloat(SETTINGS.listingPrice || 0);

    if (listingPrice <= 0) return 0;

    const calcListingPrice = parseFloat(price) * (listingPrice / 100);

    return parseEther(calcListingPrice.toFixed(18));
  }

  return 0;
}

export const copyToClipboard = (text, title) => {
  navigator.clipboard.writeText(text);
  successMessage(__(` ${title} copied to clipboard`, SLUG));
};
