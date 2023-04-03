import React, { useContext } from "react"
import { SettingsContext } from "../state"
import { SLUG } from "../../../../../../../common/store"
import Switch from "../../../../../../../common/component/switcher"
const { __ } = wp.i18n
export const ProfileCollections = () =>{
    const {state, dispatch} = useContext( SettingsContext )
    const defaultState = state.profile.collections
    const changeState = (property, value) =>{
        const temp = {};
        temp[property] = value;
        const newState = { ...defaultState, ...temp }
        dispatch({ type: "CHANGE_PROFILE_COLLECTION", payload: newState })
    }

    return(
        <>
            <h2 className="settings-page__list-settings__section-heading">{__("Profile Collections", SLUG)}</h2>
            <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                    <h4>{__("Columns", SLUG)}</h4>
                    <p>
                    {__(
                        "Select number of columns to show Collections on profile page",
                        SLUG
                    )}
                    </p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <select
                    value={defaultState.cols}
                    onChange={(e) => changeState("cols", parseInt(e.target.value))}
                    >
                    <option value={1}>{__("1 column", SLUG)}</option>
                    <option value={2}>{__("2 columns", SLUG)}</option>
                    <option value={3}>{__("3 columns", SLUG)}</option>
                    <option value={4}>{__("4 columns", SLUG)}</option>
                    <option value={5}>{__("5 columns", SLUG)}</option>
                    <option value={6}>{__("6 columns", SLUG)}</option>
                    <option value={7}>{__("7 columns", SLUG)}</option>
                    <option value={8}>{__("9 columns", SLUG)}</option>
                    <option value={9}>{__("10 columns", SLUG)}</option>
                    </select>
                </div>
            </div>
            <div className="settings-page__list-settings-single">
                <div className="settings-page__list-settings-single__headings">
                    <h4>{__("Collections per page", SLUG)}</h4>
                    <p>{__("Number of Collections per page/load", SLUG)}</p>
                </div>
                <div className="settings-page__list-settings-single__controls">
                    <input
                    onChange={(e) => changeState("perpage", parseInt(e.target.value))}
                    type="number"
                    name="nft-per-page"
                    value={defaultState.perpage}
                    />
                </div>
            </div>
        </>
    )
}