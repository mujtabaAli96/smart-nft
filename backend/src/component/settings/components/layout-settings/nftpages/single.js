import React, { useContext } from "react"
import { SettingsContext } from "../state"
import { SLUG } from "../../../../../../../common/store"
import Switch from "../../../../../../../common/component/switcher"
const { __ } = wp.i18n
export const SingleNfts = () =>{
    const {state, dispatch} = useContext( SettingsContext )
    const defaultState = state.nftpages.single

    const changeState = (property, value) =>{
        const temp = {};
        temp[property] = value;
        const single = { ...defaultState, ...temp }
        dispatch({ type: "CHANGE_NFTS_SINGLE", payload: single })
    }

    return(
        <>
            <h2 className="settings-page__list-settings__section-heading">{__("Single NFT page", SLUG)}</h2>
            <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                  <h4>{__("Page width", SLUG)}</h4>
                  <p>{__("Input the value of page width in px", SLUG)}</p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                  <input
                    onChange={(e) =>
                      changeState("width", parseInt(e.target.value))
                    }
                    type="number"
                    name="nft-page-width"
                    value={defaultState.width}
                  />
                  <span className="input-unit">Px</span>
                </div>
              </div>
              <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                  <h4>{__("Like Button", SLUG)}</h4>
                  <p>{__("Show/hide single nft like buttons", SLUG)}</p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <Switch isOn={defaultState.likebtn} handleToggle={(e) => changeState("likebtn", e.target.checked)} id={'single-nft-likebtn'} />
                </div>
              </div>
              <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                  <h4>{__("Share button", SLUG)}</h4>
                  <p>
                    {__(
                      "optionally turn on/off search button on your single nft page",
                      SLUG
                    )}
                  </p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <Switch isOn={defaultState.sharebtn} handleToggle={(e) => changeState("sharebtn", e.target.checked)} id={'single-nft-sharebtn'} />
                </div>
              </div>
              <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                  <h4>{__("Single NFT Tabs", SLUG)}</h4>
                  <p>{__("Show/hide tabs in single nft page", SLUG)}</p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <Switch isOn={defaultState.infotabs} handleToggle={(e) => changeState("infotabs", e.target.checked)} id={'single-nft-infotabs'} />
                </div>
              </div>
        </>
    )
}