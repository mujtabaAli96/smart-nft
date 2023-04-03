import React from "react"
export const WarningNotification = ({ message }) => {
    return(
        <div className="smart-nft-notification">
            <p className="smart-nft-notification__warning">
                {message}
            </p>
        </div>
    )
}