import React from "react"
import { AllCollections } from "./all"
import { CreateCollections } from "./create"
import { SingleCollection } from "./single"

export const CollectionPages = () => {
    return(
        <>
            <AllCollections />
            <SingleCollection />
            <CreateCollections />
        </>
    )
}