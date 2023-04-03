import React, { useEffect, useState } from "react"
import { errorMessage } from "../../../../../../common/component/message/error"
const {__} = wp.i18n
import { BACKEND_AJAX_URL, SLUG } from "../../../../../../common/store"

export const Licencing = () => {
    const [ licencekey, setLicenceKey ] = useState("")
    const [ verified, setVerified ] = useState(false)
    const [ btntext, setBtntext ] = useState(__("Activate Smart NFT", SLUG))
    const [ loading, setLoading ] = useState(true)
    useEffect( () => {
        async function fetchData(){
            try{
                const res = await jQuery.ajax({
                    type: "post",
                    url: BACKEND_AJAX_URL,
                    data: {
                        licencekey,
                        action: "verify_product"
                    }
                })
                if(res.verified) {
                    setVerified(true)
                    setLicenceKey( res.key )
                }
                if(!res.verified){
                    setVerified(false)
                    errorMessage(
                        __("Plugin Activation Failed", SLUG)
                    )
                }
                setLoading(false)
            }catch(err){
                console.log(err)
            }
        }
        fetchData()
    }, [])
    const saveLicence = async () =>{
        if(licencekey == '' ) return errorMessage(__("Please give a purchase code", SLUG))
        setBtntext(__("Activating.Please wait...", SLUG))
        try{
            const res = await jQuery.ajax({
                type: "post",
                url: BACKEND_AJAX_URL,
                data: {
                    licencekey,
                    action: "verify_product"
                }
            })
            if(res.verified) {
                setVerified(true)
                setLicenceKey( res.key )
                setBtntext(__("Activate Smart NFT", SLUG))
            }
            if(!res.verified){
                setVerified(false)
                setLicenceKey( "" )
                setBtntext(__("Activate Smart NFT", SLUG))
                errorMessage(
                    __("Plugin Activation Failed", SLUG)
                )
            }
            setLoading(false)
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div className="settings-card__container full">
          <div className="settings-card__inner">
            <h3 className="settings-card__heading big">
              {__("Plugin Purchase Key", SLUG)}
            </h3>
            <p className="settings-card__desc">
              {__(
                "Plugin purchase key is important to get updates and support from support team",
                SLUG
              )}
            </p>
            {
                loading && <h4>{__("Loading...", SLUG)}</h4>

            }
            {
                !loading && verified &&
                <Activated licencekey={licencekey} />
            }
            {
                !loading && !verified &&
                <>
                    <input
                        type="text"
                        className="settings-card__input"
                        name="settings-name"
                        placeholder={__("Place your plugin purchase code from codecanyon.", SLUG)}
                        value={licencekey}
                        onChange={(e) => setLicenceKey(e.target.value)}
                    />
                    <button
                        className="settings-card__save"
                        onClick={(e) => saveLicence()}
                        >
                        {btntext}
                    </button>
                </>
            }
          </div>
        </div>
    )
}

const Activated = ({ licencekey }) => {
    return(
        <div className="plugin-activated">
            <h4>{__("Smart NFT is Now Active", SLUG)}</h4>
            <p>{licencekey}</p>
        </div>
    )
}