import React from "react";
import { createPortal } from "react-dom";
import { SLUG, FRONTENDMEDIAURL, BACKENDMEDIAURL } from "../store";
import { successMessage } from "./message/success";
import { deleteCategory } from "../../backend/src/component/categorie-list/edit-category";
const { __ } = wp.i18n;

const loading = `${BACKENDMEDIAURL}/loaders/loading.svg`;

export const Popup = ({ isOpen, setIsOpen, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="smart-nft-popup__container open">
      <div className="smart-nft-popup__inner">{children}</div>
    </div>,
    document.querySelector("body")
  );
};

export const NormalLoaderPopup = ({ isOpen, message }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="smart-nft-popup__container open">
      <div className="smart-nft-popup__inner">
        <img className="rotating" src={loading} />
        <h2>{message}</h2>
      </div>
    </div>,
    document.querySelector("body")
  );
};

export const CreateCollection = ({ isOpen }) => {
  return (
    <div className={`smart-nft-popup__container ${isOpen ? "open" : ""}`}>
      <div className="smart-nft-popup__inner">
        <img className="rotating" src={loading} style={{ marginTop: 20 }} />
        <h2>{__("Please wait while creating this collection.", SLUG)}</h2>
      </div>
    </div>
  );
};

export const SharePopup = ({ isOpen, setShareOpen, nftInfo }) => {
  const url = window.location.href;
  // const [open, setOpen] = useState(isOpen)
  const copyaddress = (address) => {
    navigator.clipboard.writeText(address);
    successMessage(__("NFT link copied to clipboard", SLUG));
  };
  const smallWindow = (e, url) => {
    e.preventDefault();
    window.open(url, "NewWindow", "width=450,height=500,scrollbars=yes");
  };

  return (
    <div className={`smart-nft-popup__container ${isOpen ? "open" : ""}`}>
      <div className="smart-nft-popup__inner">
        <div
          className="steps-sections smart-nft-popup__share"
          style={{ paddingTop: 0 }}
        >
          <div
            className="popup-image"
            style={{ backgroundImage: `url(${nftInfo?.mediaUrl})` }}
          ></div>
          <h6>
            <strong>{__("Spread your NFT to the world", SLUG)}</strong>
          </h6>
          <div className="smart-nft-popup__share-input">
            <input type="text" value={url} disabled={true} />
            <span onClick={(e) => copyaddress(url)}>
              <img src={`${FRONTENDMEDIAURL}copy.svg`} />
            </span>
          </div>
          <div className="smart-nft-popup__social-share">
            <a
              onClick={(e) =>
                smallWindow(
                  e,
                  "https://www.facebook.com/sharer/sharer.php?u=" + url
                )
              }
            >
              <svg height="20" width="20" viewBox="0 0 155.139 155.139">
                <path d="M89.584,155.139V84.378h23.742l3.562-27.585H89.584V39.184   c0-7.984,2.208-13.425,13.67-13.425l14.595-0.006V1.08C115.325,0.752,106.661,0,96.577,0C75.52,0,61.104,12.853,61.104,36.452   v20.341H37.29v27.585h23.814v70.761H89.584z"></path>
              </svg>
            </a>
            <a
              onClick={(e) =>
                smallWindow(
                  e,
                  "https://www.linkedin.com/sharing/share-offsite/?url=" + url
                )
              }
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <g>
                  <path d="m23.994 24v-.001h.006v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07v-2.185h-4.773v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243v7.801z"></path>
                  <path d="m.396 7.977h4.976v16.023h-4.976z"></path>
                  <path d="m2.882 0c-1.591 0-2.882 1.291-2.882 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909c-.001-1.591-1.292-2.882-2.882-2.882z"></path>
                </g>
              </svg>
            </a>
            <a
              onClick={(e) =>
                smallWindow(e, "https://twitter.com/intent/tweet?url=" + url)
              }
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="m21.534 7.113c.976-.693 1.797-1.558 2.466-2.554v-.001c-.893.391-1.843.651-2.835.777 1.02-.609 1.799-1.566 2.165-2.719-.951.567-2.001.967-3.12 1.191-.903-.962-2.19-1.557-3.594-1.557-2.724 0-4.917 2.211-4.917 4.921 0 .39.033.765.114 1.122-4.09-.2-7.71-2.16-10.142-5.147-.424.737-.674 1.58-.674 2.487 0 1.704.877 3.214 2.186 4.089-.791-.015-1.566-.245-2.223-.606v.054c0 2.391 1.705 4.377 3.942 4.835-.401.11-.837.162-1.29.162-.315 0-.633-.018-.931-.084.637 1.948 2.447 3.381 4.597 3.428-1.674 1.309-3.8 2.098-6.101 2.098-.403 0-.79-.018-1.177-.067 2.18 1.405 4.762 2.208 7.548 2.208 8.683 0 14.342-7.244 13.986-14.637z"></path>
              </svg>
            </a>
          </div>
          <span className="btn-close" onClick={(e) => setShareOpen(false)}>
            {__("Close", SLUG)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const UnlockedContentPopup = ({ isOpen, setOpen, nftInfo }) => {
  return (
    <div className={`smart-nft-popup__container ${isOpen ? "open" : ""}`}>
      <div className="smart-nft-popup__inner">
        <div
          className="steps-sections smart-nft-popup__share"
          style={{ paddingTop: 0 }}
        >
          <h6>
            <strong>{__("Unlockable Content", SLUG)}</strong>
          </h6>
          <div className="smart-nft-popup__share-input">
            <p>{nftInfo?.unlockableContent}</p>
          </div>
          <span className="btn-close" onClick={(e) => setOpen(false)}>
            {__("Close", SLUG)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const DeleteContractPopup = ({
  isOpen,
  setOpen,
  contractAddr,
  setContracts,
}) => {
  return (
    <div className={`smart-nft-popup__container ${isOpen ? "open" : ""}`}>
      <div className="smart-nft-popup__inner">
        <h2>
          <strong>{__("Delete Contract Address?", SLUG)}</strong>
        </h2>
        <div style={{ padding: "0 20px" }}>
          <p>
            {__(
              "Are you sure you want to delete this contract address? This will be permanently deleted from database and please copy your contract address before deleting.",
              SLUG
            )}
          </p>
        </div>
        <div className="smart-nft-popup__btn-group">
          <button
            className="btn-confirm"
            onClick={(e) => removeContractAddress(contractAddr, setContracts)}
          >
            {__("Confirm", SLUG)}
          </button>
          <button className="btn-close" onClick={(e) => setOpen(false)}>
            {__("Cancel", SLUG)}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeleteCategoryPopup = ({
  isOpen,
  setOpen,
  taxID,
  setEditorOpen,
}) => {
  const resetForms = () => {
    setOpen(false);
    setEditorOpen(true);
  };
  return (
    <div className={`smart-nft-popup__container ${isOpen ? "open" : ""}`}>
      <div className="smart-nft-popup__inner">
        <h2>
          <strong>{__("Delete Category?", SLUG)}</strong>
        </h2>
        <div style={{ padding: "0 20px" }}>
          <p>
            {__(
              "Are you sure you want to delete this category? This will be permanently deleted from database but NFTs will remain.",
              SLUG
            )}
          </p>
        </div>
        <div className="smart-nft-popup__btn-group">
          <button
            className="btn-confirm"
            onClick={(e) => deleteCategory(taxID)}
          >
            {__("Confirm", SLUG)}
          </button>
          <button className="btn-close" onClick={(e) => resetForms()}>
            {__("Cancel", SLUG)}
          </button>
        </div>
      </div>
    </div>
  );
};
