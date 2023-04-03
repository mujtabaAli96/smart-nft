import React, {useContext,useState} from "react"
import { SLUG } from "../../../../common/store"
import { AllCollectionContext } from "./state"
const {__} = wp.i18n
export const CollectionsHeader = () => {
    const {state,dispatch} = useContext(AllCollectionContext)
    const changetab = (tab) => {
        dispatch({
            type: 'CHANGE_COLLECTION_TABS',
            payload: tab
        })
    }
    const changeTimestamp = (time) => {
        dispatch({
            type: 'CHANGE_TIME_FRAME',
            payload: time
        });
        dispatch({
            type: 'LOADING',
            payload: true
        });
    }
    const Tabs = () => {
        return(
            <div className="collection-tabs">
                <ul>
                    <li onClick={ e => changetab('top') } className={`${state.tab == 'top' ? 'active' : ''}`}>{__("Top", SLUG)}</li>
                    <li onClick={ e => changetab('trending') } className={`${state.tab == 'trending' ? 'active' : ''}`}>{__("Trending", SLUG)}</li>
                    <li onClick={ e => changetab('hot') } className={`${state.tab == 'hot' ? 'active' : ''}`}>{__("Hot", SLUG)}</li>
                </ul>
            </div>
        )
    }
    const TimeFrame = () => {
        return(
            <div className="collection-tabs">
                <ul>
                    <li onClick={ e => changeTimestamp('5m') } className={`${state.timeframe == '5m' ? 'active' : ''}`}>{__("5m", SLUG)}</li>
                    <li onClick={ e => changeTimestamp('15m') } className={`${state.timeframe == '15m' ? 'active' : ''}`}>{__("15m", SLUG)}</li>
                    <li onClick={ e => changeTimestamp('30m') } className={`${state.timeframe == '30m' ? 'active' : ''}`}>{__("30m", SLUG)}</li>
                    <li onClick={ e => changeTimestamp('1h') } className={`${state.timeframe == '1h' ? 'active' : ''}`}>{__("1h", SLUG)}</li>
                    <li onClick={ e => changeTimestamp('6h') } className={`${state.timeframe == '6h' ? 'active' : ''}`}>{__("6h", SLUG)}</li>
                    <li onClick={ e => changeTimestamp('24h') } className={`${state.timeframe == '24h' ? 'active' : ''}`}>{__("24h", SLUG)}</li>
                    <li onClick={ e => changeTimestamp('3d') } className={`${state.timeframe == '3d' ? 'active' : ''}`}>{__("3d", SLUG)}</li>
                    <li onClick={ e => changeTimestamp('7d') } className={`${state.timeframe == '7d' ? 'active' : ''}`}>{__("7d", SLUG)}</li>
                    <li onClick={ e => changeTimestamp('30d') } className={`${state.timeframe == '30d' ? 'active' : ''}`}>{__("30d", SLUG)}</li>
                </ul>
            </div>
        )
    }
    return(
        <div className="collection-header">
            <Tabs />
            <TimeFrame />
        </div>
    )
}