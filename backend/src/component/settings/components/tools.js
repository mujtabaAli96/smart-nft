import React, { useState} from "react";
import { ACTIVE_CONTRACT, SLUG, BACKEND_AJAX_URL } from "../../../../../common/store";
import { successMessage } from "../../../../../common/component/message/success";
import { errorMessage } from "../../../../../common/component/message/error";
const { __ } = wp.i18n;

export const Tools = () => {
    const [btntext, setBtntext] = useState(__("Update", SLUG));
    const [btntextnft, setBtntextnft] = useState(__("Update", SLUG));
    const updateCollection = async () => {
        setBtntext(__("Updating...", SLUG))
        try{
            const res = await jQuery.ajax({
                type: "post",
                url: BACKEND_AJAX_URL,
                data: {
                    contract_addr: ACTIVE_CONTRACT.address,
                    action: "update_collection_tools",
                },
            });
            console.log(res)
            successMessage(__("Collection tools updated successfully", SLUG))
        }catch(err){
            console.log(err)
            errorMessage(__("Collection tools update failed", SLUG))
        }
        setBtntext(__("Update", SLUG))
    }
    const updateSingleNFT = async () => {
        setBtntextnft(__("Updating...", SLUG))
        try{
            const res = await jQuery.ajax({
                type: "post",
                url: BACKEND_AJAX_URL,
                data: {
                    contract_addr: ACTIVE_CONTRACT.address,
                    action: "update_singlenft_tools",
                },
            });
            console.log(res)
            successMessage(__("Single nft updated successfully", SLUG))
        }catch(err){
            console.log(err)
            errorMessage(__("Single nft update failed", SLUG))
        }
        setBtntextnft(__("Update", SLUG))
    }
  return (
    <>
      <div className="settings-page__container">
        <div className="settings-page__heading">
          <div>
            <h4>{__("Toolbox", SLUG)}</h4>
            <p>
              {__(
                "You can update your different metadata settings from here.",
                SLUG
              )}
            </p>
          </div>
        </div>

        <div className="settings-page__list-settings">
          <div className="settings-page__list-settings-single">
            <div className="settings-page__list-settings-single__headings">
              <h4>{__("Update collections", SLUG)}</h4>
              <p>{__("update collection data from previous version", SLUG)}</p>
            </div>
            <div className="settings-page__list-settings-single__controls">
                <button
                    onClick={(e) => updateCollection()}
                    className="button button-primary"
                >
                    {btntext}
                </button>
            </div>
          </div>
          <div className="settings-page__list-settings-single">
            <div className="settings-page__list-settings-single__headings">
              <h4>{__("Update Single NFT", SLUG)}</h4>
              <p>{__("update single nft information from previous version", SLUG)}</p>
            </div>
            <div className="settings-page__list-settings-single__controls">
                <button
                    onClick={(e) => updateSingleNFT()}
                    className="button button-primary"
                >
                    {btntextnft}
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
