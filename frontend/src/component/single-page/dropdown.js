import React, { useState } from "react";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;
import { BurnComponent } from "./burn";
import { TransferComponent } from "./transfer";
import { Erc1155BurnComponent } from "./erc1155-burn";
import { Erc1155TransferComponent } from "./transfer-1155";

const DropDown = ({ data }) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isBurnComponetOpen, setIsBurnComponentOpen] = useState(false);
  const [isTransferComponetOpen, setIsTransferComponentOpen] = useState(false);
  const { nftInfo, web3Provider, nftOwners } = data;
  const { standard } = nftInfo;

  const openOrClose = () => setOptionsOpen(!optionsOpen);
  const openBurnComponet = () => setIsBurnComponentOpen(!isBurnComponetOpen);
  const openTransferComponet = () => {
    setIsTransferComponentOpen(!isTransferComponetOpen);
  };

  if (standard == "Erc721") {
    const isOwner = nftInfo.owners.includes(
      web3Provider.account[0]?.toLowerCase()
    );
    if (!isOwner) return null;
  }

  if (standard == "Erc1155") {
    const owner = nftOwners[web3Provider.account[0]?.toLowerCase()];
    if (!owner) return null;
  }

  if (!standard) return null;

  return (
    <div className="single-nft-options-component">
      <span className="single-nft-options-btn" onClick={openOrClose}>
        ...
      </span>

      {optionsOpen && (
        <div className="single-nft-options">
          {nftInfo.isFreeMinting == "true" ? null : (
            <span onClick={openTransferComponet}>
              {__("Transfer Token", SLUG)}
            </span>
          )}
          <span onClick={openBurnComponet}>{__("Burn Token", SLUG)}</span>
        </div>
      )}
      {standard == "Erc721" && (
        <>
          <BurnComponent
            data={data}
            isOpen={isBurnComponetOpen}
            setIsOpen={setIsBurnComponentOpen}
          />
          <TransferComponent
            data={data}
            isOpen={isTransferComponetOpen}
            setIsOpen={setIsTransferComponentOpen}
          />
        </>
      )}
      {standard == "Erc1155" && (
        <>
          <Erc1155BurnComponent
            data={data}
            isOpen={isBurnComponetOpen}
            setIsOpen={setIsBurnComponentOpen}
          />
          <Erc1155TransferComponent
            data={data}
            isOpen={isTransferComponetOpen}
            setIsOpen={setIsTransferComponentOpen}
          />
        </>
      )}
    </div>
  );
};

export default DropDown;
