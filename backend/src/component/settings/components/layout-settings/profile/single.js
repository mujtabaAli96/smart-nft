import React, { useContext } from "react"
import { SettingsContext } from "../state"
import { SLUG } from "../../../../../../../common/store"
import Switch from "../../../../../../../common/component/switcher"
const { __ } = wp.i18n
export const ProfilePage = () =>{
    const {state, dispatch} = useContext( SettingsContext )
    const defaultState = state.profile.single
    const changeState = (property, value) =>{
        const temp = {};
        temp[property] = value;
        const newState = { ...defaultState, ...temp }
        dispatch({ type: "CHANGE_PROFILE_SINGLE", payload: newState })
    }

    return(
        <>
            <h2 className="settings-page__list-settings__section-heading">{__("Profile page", SLUG)}</h2>
            <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                    <h4>{__("Page width", SLUG)}</h4>
                    <p>{__("Profile page width", SLUG)}</p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <input
                        onChange={(e) => changeState("width", parseInt(e.target.value))}
                        type="number"
                        value={defaultState.width}
                    />
                </div>
            </div>
            <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                    <h4>{__("Description", SLUG)}</h4>
                    <p>{__("Show profile description", SLUG)}</p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <Switch isOn={defaultState.desc} handleToggle={(e) => changeState("desc", e.target.checked)} id={'profile-desc'} />
                </div>
            </div>
            <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                    <h4>{__("Address", SLUG)}</h4>
                    <p>{__("Show profile address", SLUG)}</p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <Switch isOn={defaultState.address} handleToggle={(e) => changeState("address", e.target.checked)} id={'profile-address'} />
                </div>
            </div>
            <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                    <h4>{__("Links", SLUG)}</h4>
                    <p>{__("Show collection links", SLUG)}</p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <Switch isOn={defaultState.links} handleToggle={(e) => changeState("links", e.target.checked)} id={'profile-links'} />
                </div>
            </div>
            <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                    <h4>{__("Filter toggle", SLUG)}</h4>
                    <p>{__("Set filter toggle open/closed. Default is open", SLUG)}</p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                <Switch
                    isOn={defaultState.filterToggle}
                    handleToggle={(e) => changeState("filterToggle", e.target.checked)}
                    id={"profile-filterToggle"}
                />
                </div>
            </div>
        </>
    )
}