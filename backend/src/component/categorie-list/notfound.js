import React from "react"
import { SLUG } from "../../../../common/store"
const {__} = wp.i18n
export const CategoriesNotFound = ({ createCategory }) => {
    return(
        <div style={{marginTop: 40, textAlign: "center"}}>
            <h2>{__("No Categories Found", SLUG)}</h2>
            <p>{__("No categories has been added yet. Please try to create a new", SLUG)}</p>
            <button 
                className="sn-action-button"
                onClick={ e => createCategory(true) }
            >
                + {__("Create New", SLUG)}
            </button>
        </div>
    )
}