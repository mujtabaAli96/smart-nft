import React, { useContext } from "react";
import { createPortal } from "react-dom";
import { SLUG, FRONTENDMEDIAURL } from "../../../../common/store";
import { CreateNftContext } from "./state";
import { successMessage } from "../../../../common/component/message/success";
const { __ } = wp.i18n;

const smallWindow = (e, url) => {
  e.preventDefault();
  window.open(url, "NewWindow", "width=450,height=500,scrollbars=yes");
};

const copyaddress = (address) => {
  navigator.clipboard.writeText(address);
  successMessage(__("NFT link copied to clipboard", SLUG));
};

const SuccessPopup = () => {
  const { state, dispatch } = useContext(CreateNftContext);

  const onClose = () => {
    window.location.reload();
  };

  return (
    <div className="smart-nft-popup__container open">
      <div className="smart-nft-popup__inner">
        <div className="steps-sections smart-nft-popup__share">
          {/* <div className="popup-image">
            <img src={`${state.mediaUrl}`} />
          </div> */}
          <h3 className="header-congratulations">
            {__("Congratulations! Your NFT is now published", SLUG)}
          </h3>
          <div className="smart-nft-popup__share-input">
            <input type="text" value={state.url} disabled={true} />
            <span onClick={(e) => copyaddress(state.url)}>
              <img src={`${FRONTENDMEDIAURL}copy.svg`} />
            </span>
          </div>
          <div className="smart-nft-popup__social-share">
            <ShareIcon
              url={`https://www.facebook.com/sharer/sharer.php?u=${state.url}`}
              iconUrl={`${FRONTENDMEDIAURL}socials/facebook.svg`}
            />
            <ShareIcon
              url={`https://www.linkedin.com/sharing/share-offsite/?url=${state.url}`}
              iconUrl={`${FRONTENDMEDIAURL}socials/linkedin.svg`}
            />
            <ShareIcon
              url={`https://twitter.com/intent/tweet?url=${state.url}`}
              iconUrl={`${FRONTENDMEDIAURL}socials/twitter.svg`}
            />
          </div>
          <a target="_blank" className="btn-preview" href={state.url}>
            {__("View NFT", SLUG)}
          </a>
          <span onClick={onClose} className="btn-close">
            {__("Close", SLUG)}
          </span>
        </div>
      </div>
    </div>
  );
};

const ShareIcon = ({ iconUrl, url }) => {
  return (
    <a onClick={(e) => smallWindow(e, url)}>
      <img src={iconUrl} alt="icon" />
    </a>
  );
};

const SuccessPopupPortal = () => {
  return createPortal(<SuccessPopup />, document.querySelector("body"));
};

export default SuccessPopupPortal;
//"https://www.facebook.com/sharer/sharer.php?u=" + url
