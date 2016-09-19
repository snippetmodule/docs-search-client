import * as appConfig from '../../config';
import {getDocInfoByUrlPath, ICanExpendedItem} from '../../containers/App/ExpandedDocList';
/** Action Types */
export const INIT_REQUEST: string = 'INIT_PAGE_REQUEST';
export const INIT_SUCCESS: string = 'INIT_PAGE_SUCCESS';
export const INIT_FAILURE: string = 'INIT_PAGE_FAILURE';

export interface IDocPageState {
    isOk: boolean;
    err: Error;
    url: string;
    htmlResponse?: string;
    clickExpendedItem?: ICanExpendedItem;
}
export interface IDocPageAction {
    type: string;
    err: Error;
    url: string;
    htmlResponse?: string;
    clickExpendedItem?: ICanExpendedItem;
}

/** Reducer */
export function initDocPageReducer(state: IDocPageState = { isOk: false, url: null, err: null }, action: IDocPageAction): IDocPageState {
    switch (action.type) {
        case INIT_REQUEST:
            return {
                isOk: false,
                err: null,
                url: action.url,
                htmlResponse: undefined,
                clickExpendedItem: action.clickExpendedItem,
            };

        case INIT_SUCCESS:
            return {
                isOk: true,
                err: action.err,
                url: action.url,
                htmlResponse: action.htmlResponse,
                clickExpendedItem: action.clickExpendedItem,
            };
        default:
            return state;
    }

}

/** Async Action Creator */
export function startRequestPage(dispatch, _url: string): IDocPageAction {
    let _clickExpendedItem: ICanExpendedItem = getDocInfoByUrlPath(_url);
    if (_clickExpendedItem && _clickExpendedItem.data.docType && !_clickExpendedItem.data.docEntry) {
        return { type: INIT_SUCCESS, url: _url, htmlResponse: null, clickExpendedItem: _clickExpendedItem, err: null };
    }
    fetch(appConfig.default.docs.getConfig().docs_host + _url, {
        headers: {
            Accept: 'text/html',
        },
    }).then(res => {
        if (res.ok) { return res.text(); };
        throw new Error('http download error');
    }).then(res => {
        dispatch({ type: INIT_SUCCESS, url: _url, htmlResponse: res, clickExpendedItem: _clickExpendedItem, err: null });
    }).catch(_err => {
        dispatch({ type: INIT_SUCCESS, url: _url, htmlResponse: null, clickExpendedItem: _clickExpendedItem, err: _err });
    });
    return {
        type: INIT_REQUEST,
        url: _url,
        err: null,
        clickExpendedItem: _clickExpendedItem,
    };
}