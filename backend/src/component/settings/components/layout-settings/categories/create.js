import React, { useContext } from "react"
import { SettingsContext } from "../state"
import { SLUG } from "../../../../../../../common/store"
const { __ } = wp.i18n
export const CreateCategories = () =>{
    const {state, dispatch} = useContext( SettingsContext )
    const defaultState = state.categories.create

    const changeState = (property, value) =>{
        const temp = {};
        temp[property] = value;
        const newState = { ...defaultState, ...temp }
        dispatch({ type: "CHANGE_CATEGORIES_CREATE", payload: newState })
    }

    return(
        <>
            <h2 className="settings-page__list-settings__section-heading">{__("Create collection", SLUG)}</h2>

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
        </>
    )
}