import React, { useState } from "react"
import Switch from "../../../../common/component/switcher"
import { SLUG, BACKEND_AJAX_URL } from "../../../../common/store"
const {__} = wp.i18n 
// const addonsData = local.addons

export const ProAddons = () => {
    const [addonsdata, setAddonsdata] = useState(local.addons)
    console.log(addonsdata)
    return(
        <div className="smartnft-addons">
            {
                addonsdata.map( (elem, i) => (
                    <SingleAddon key={i} id={i} addons={addonsdata} data={elem} setdata={setAddonsdata} />
                ))
            }
        </div>
    )
}

const SingleAddon = ({id, addons, data, setdata}) => {
    const activateDeactivate = async (slug) => {
        try{
            const res = await jQuery.ajax({
                type: "post",
                url: BACKEND_AJAX_URL,
                data: {
                    slug,
                    action: "smartnft_switch_plugin_state",
                },
            });
            console.log(res);
            addons[id].isactive = res.status;
            setdata([ ...addons ])
        }catch (err) {
            console.log(err);
        }
    }
    return(
        <div className="smartnft-addons__single-addon">
            <div className="smartnft-addons__single-addon__content">
                <h2>{data.name}</h2>
                <p>{data.desc}</p>
            </div>
            <div className="smartnft-addons__single-addon__footer">
                <div>
                    { !data.isinstalled && <a className="focused" target="_blank" href={data.url}>{__('Get addon', SLUG)}</a>}
                    { data.isinstalled && <a target="_blank" href={data.url}>{__('See details', SLUG)}</a>}
                </div>
                <div>
                    { data.isinstalled && <Switch handleToggle={ e => activateDeactivate(data.id)} isOn={data.isactive} id={data.id} />}
                </div>
            </div>
        </div>
    )
}