import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Popup } from "../../../../common/component/popup";
import { SLUG, FRONTENDMEDIAURL, SETTINGS } from "../../../../common/store";
const { __ } = wp.i18n;

export const UnlockableContentPopup = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { nftInfo, nftOwners, web3Provider } = data;

  //Guard close for dashboard  settings
  if( SETTINGS.unlockable === "false" || (!nftInfo?.unlockableContent && !nftInfo?.unlockableFiles) ){ 
    return null;
  };

  let owners, isOwner;
  if (nftInfo.standard === "Erc721") {
    owners = nftInfo.owners;
  }

  if (nftInfo.standard === "Erc1155") {
    owners = Object.keys(nftOwners);
  }

  if (owners.length) {
    const found = owners.findIndex(
      (cur) => cur.toLowerCase() === web3Provider?.account[0]?.toLowerCase()
    );

    isOwner = found >= 0;
  }

  if (!isOwner) return null;

  return (
    <>
      <div>
        <Popup isOpen={isOpen} setIsOpen={setIsOpen}>
          <UnlockableContent setIsOpen={setIsOpen} nftInfo={nftInfo} />
        </Popup>
        <p className="unlockable-content" onClick={(e) => setIsOpen(true)}>
          <img src={`${FRONTENDMEDIAURL}unlock.svg`} alt=" lock icon" />
          {__("Unlockable Content", SLUG)}
        </p>
      </div>
    </>
  );
};

const UnlockableContent = ({ setIsOpen, nftInfo }) => {
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }
  const [ filePreviewOpen, setFilePreviewOpen ] = useState(false)
  const [ previewUrl, setPreviewUrl ] = useState('')
  const [ previewType, setPreviewType ] = useState('')
  const previewFile = ( url, type ) => {
    setPreviewUrl(url)
    setPreviewType(type)
    setFilePreviewOpen(true)
  }
  return (
    <>
      <UnlockedContentFilePreview isOpen={filePreviewOpen} setOpen={setFilePreviewOpen} url={previewUrl} type={previewType} />
      <div
        className="steps-sections smart-nft-popup__share"
        style={{ paddingTop: 0 }}
      >
        <h5>
          <strong>{__("Unlockable Content", SLUG)}</strong>
        </h5>
        <div className="smart-nft-popup__share-input">
          <p>{nftInfo?.unlockableContent}</p>
          {
            nftInfo?.unlockableFiles?.length > 0 &&
            <div className="upload-lists">
              { 
                nftInfo.unlockableFiles.length > 0 &&
                nftInfo.unlockableFiles.map( (elem, i) => (
                    <div className="upload-single" key={i}>
                      <p className="file-name">{elem.name}</p>
                      <span className="file-meta">{elem.time} - {formatBytes(elem.size)}</span>
                      <span className="delete-file" onClick={ e => previewFile( elem.url, elem.type)}>
                        Play 
                        <svg width="18" height="18" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
                          <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                        </svg>
                      </span>
                    </div>
                ))
              }
            </div>
          }
        </div>
        <span className="btn-close" onClick={(e) => setIsOpen(false)}>
          {__("Close", SLUG)}
        </span>
      </div>
    </>
  );
};

const UnlockedContentFilePreview = ( {isOpen, setOpen, url, type} ) =>{
  return createPortal(
    <div className={`media-viewer-pop ${isOpen ? 'open' : ''}`}>
      <span className="close" onClick={e => setOpen(!isOpen)}>
          Close
      </span>
      <div className="main-content">
        {
          type.startsWith('image') &&
          <img src={url} />
        }
        {
          type.startsWith('audio') &&
          <audio controls controlsList="nodownload noplaybackrate">
            <source src={url} type={type}/>
          </audio>
        }
        {
          type.startsWith('video') &&
          <video width={600} controls controlsList="nodownload noplaybackrate">
            <source src={url} type={type}/>
          </video>
        }        
      </div>
    </div>,
    document.querySelector("body")
  )
}