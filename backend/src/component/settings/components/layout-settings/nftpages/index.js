import React from "react"
import { CreateNft } from "./create"
import { AllNfts } from "./all"
import { SingleNfts } from "./single"

export const NftPages = () => {
    return(
        <>
            <AllNfts />
            <SingleNfts />
            <CreateNft />
        </>
    )
}