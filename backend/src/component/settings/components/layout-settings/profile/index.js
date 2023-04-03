import React from "react"
import { ProfileCollections } from "./collections"
import { ProfileEditPage } from "./edit"
import { ProfileNFTs } from "./nfts"
import { ProfilePage } from "./single"


export const ProfilePages = () => {
    return(
        <>
            <ProfilePage />
            <ProfileEditPage />
            <ProfileNFTs />
            <ProfileCollections />
        </>
    )
}