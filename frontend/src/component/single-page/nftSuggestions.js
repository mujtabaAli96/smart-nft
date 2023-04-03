import React, { useState, useEffect } from "react";
import { BACKEND_AJAX_URL, SLUG } from "../../../../common/store";
import { AllNftLoader } from "../../../../common/component/loading";
import { Card } from "../all-nft/card";
const {__} = wp.i18n
export const NftSuggestions = ({data}) => {
    const [loading, setLoading] = useState(true)
    const [nfts, setNfts] = useState([])
    useEffect(() => {
        fetchData();
    }, []);
    if(loading)
        return(
            <div className="nft-suggestions-block">
                <Nftsuggestionsloader />
            </div>
        )

    async function fetchData() {
        try {
          const res = await jQuery.ajax({
            type: "post",
            url: BACKEND_AJAX_URL,
            data: {
              collectionId: data?.nftInfo?.collection?.id,
              limit: 4,
              action: "filter_nfts",
            },
          });
    
          const resNfts = res.data.nfts;
          console.log(resNfts);
          const resolvedNfts = resNfts.filter( nft => nft.tokenId !== data.nftInfo.tokenId )
          setNfts(resolvedNfts)
          setLoading(false)
    
        } catch (err) {
          console.error(err);
        }
    }
    

    if(!loading){
        return(
            <>
                <h3 style={{marginBottom: '20px'}}>{__("More From this collection", SLUG)}</h3>
                <div className="all-nfts">
                    {nfts.map((cur, i) => (
                        <Card key={i} data={{ ...cur }} />
                    ))}
                </div>
            </>
        )
    }
}
const Nftsuggestionsloader = () => {
    return(
        <div className="single-nft-pro-info">
            <div className="single-nft__name-con" style={{marginBottom: '30px' }}>
                <span className="skeleton-box single-nft-skeleton__name"></span>
            </div>
            <AllNftLoader perPageItems={4} />
        </div>
    )
}