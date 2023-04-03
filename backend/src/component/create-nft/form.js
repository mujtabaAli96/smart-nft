import React, { useState } from "react";
import FormHeader from "./header";
import Name from "./name";
import Description from "./description";
import NetworkInfo from "./network-info";
import MediaUpload from "./media-upload";
import Thumbnail from "./thumbnail";
import Properties from "./properties";
import Labels from "./labels";
import Stats from "./stats";
import Amount from "./amount";
import Price from "./price";
import ListingFee from "./listing-fee";
import Auction from "./auction";
import SplitPayment from "./split-payment";
import Royalty from "./royalty";
import UnlockableContent from "./unlockable-content";
import Category from "./category";
import Collection from "./collection";
import MintBtn from "./mint-btn";
import Preview from "./preview";
import FreeMinting from "./free-minting";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const Form = ({ web3Provider }) => {
  const [advancedOptions, setAdvancedOption] = useState(false);
  return (
    <div className="create-nft-form">
      <FormHeader />
      <NetworkInfo web3Provider={web3Provider} />
      <div className="create-nft-form__2column">
        <div>
          <p className="form-wallet__title header-two">
            {__("Upload file", SLUG)}
          </p>
          <MediaUpload />
          <Thumbnail />
          <Name />
          <Description />
          <Amount />
          <Price />
          <ListingFee />
          <Auction />
          <SplitPayment />
          <Royalty />
          <UnlockableContent />
          <FreeMinting />
          <Category />
          <Collection web3Provider={web3Provider} />
          <div className="form-img-upload__advanced-option">
            <span
              className="toggle-btn"
              onClick={(e) => setAdvancedOption(!advancedOptions)}
            >
              {__("Show Advanced Option", SLUG)}
            </span>
            {advancedOptions && (
              <>
                <Properties />
                <Labels />
                <Stats />
              </>
            )}
          </div>
          <MintBtn web3Provider={web3Provider} />
        </div>
        <Preview />
      </div>
    </div>
  );
};

export default Form;
