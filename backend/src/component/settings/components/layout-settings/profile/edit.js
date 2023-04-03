import React, { useContext } from "react"
import { SettingsContext } from "../state"
import { SLUG } from "../../../../../../../common/store"
import Switch from "../../../../../../../common/component/switcher"
const { __ } = wp.i18n
export const ProfileEditPage = () =>{
    const {state, dispatch} = useContext( SettingsContext )
    const defaultState = state.profile.edit
    const changeState = (property, value) =>{
        const temp = {};
        temp[property] = value;
        const newState = { ...defaultState, ...temp }
        dispatch({ type: "CHANGE_PROFILE_EDIT", payload: newState })
    }

    return(
        <>
            <h2 className="settings-page__list-settings__section-heading">{__("Edit Profile page", SLUG)}</h2>
            <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                    <h4>{__("Page width", SLUG)}</h4>
                    <p>{__("Profile edit page width", SLUG)}</p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <input
                        onChange={(e) => changeState("width", parseInt(e.target.value))}
                        type="number"
                        value={defaultState.width}
                    />
                </div>
            </div>
        </>
    )
}