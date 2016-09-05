import * as appConfig from '../../config';
/** Action Types */
export const INIT_REQUEST: string = 'INIT_PAGE_REQUEST';
export const INIT_SUCCESS: string = 'INIT_PAGE_SUCCESS';
export const INIT_FAILURE: string = 'INIT_PAGE_FAILURE';

export interface ILinkPageState {
    isInited: boolean;
    url: string;
    content?: string;
}
export interface ILinkPageAction {
    type: string;
    url: string;
    content?: string;
}

/** Reducer */
export function initLinkPageReducer(state: ILinkPageState = { isInited: false, url: null }, action: ILinkPageAction): ILinkPageState {
    switch (action.type) {
        case INIT_REQUEST:
            return Object.assign({}, state, {
                isInited: false,
                url: action.url,
            });

        case INIT_SUCCESS:
            return Object.assign({}, state, {
                isInited: true,
                url: action.url,
                content: action.content,
            });

        case INIT_FAILURE:
            return Object.assign({}, state, {
                isInited: false,
                url: action.url,
                content: action.content,
            });
        default:
            return state;
    }

}

/** Async Action Creator */
export function startRequestPage(dispatch, _url: string): ILinkPageAction {
    fetch(appConfig.default.docs.getConfig().docs_host + _url, {
        headers: {
            Accept: 'text/html',
        },
    }).catch(err => dispatch({ type: INIT_FAILURE, url: _url, content: err }))
        .then(res => res.text())
        .catch(err => dispatch({ type: INIT_FAILURE, url: _url, content: err }))
        .then(res => dispatch({ type: INIT_SUCCESS, url: _url, content: res }));
    return {
        type: INIT_REQUEST,
        url: _url,
    };

}
