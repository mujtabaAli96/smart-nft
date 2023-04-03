import React from "react"
export const SuccessNotification = ({ message }) => {
    return(
        <div className="smart-nft-notification">
            <p className="smart-nft-notification__success">
                {message}
            </p>
        </div>
    )
}