
import app  from '../../core/app';
import { ISearchResultItem } from '../../core/model';
/** Action Types */
export const SEARCH_REQUEST: string = 'SEARCH_REQUEST';
export const SEARCH_SUCCESS: string = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE: string = 'SEARCH_FAILURE';

export interface ISearchState {
    input: string;
    isSearch: boolean;
    error?: boolean;
    message?: Array<ISearchResultItem>;
}

export interface ISearchAction {
    type: string;
    input: string;
    message?: Array<ISearchResultItem>;
}

/** Reducer */
export function searchDocsReducer(state = { input: '', isSearch: false }, action: ISearchAction): ISearchState {

    switch (action.type) {
        case SEARCH_SUCCESS:
            return Object.assign({}, state, {
                input: action.input,
                isSearch: false,
                error: false,
                message: action.message,
            });

        case SEARCH_FAILURE:
            return Object.assign({}, state, {
                input: action.input,
                isSearch: false,
                error: true,
                message: action.message,
            });

        default:
            return state;
    }

}

/** Async Action Creator */
export function getSearchResult(dispatch, input: string): ISearchAction {
    app.docs.search(input)
        .then((res: Array<ISearchResultItem>) => {
            return dispatch({
                input: input,
                type: SEARCH_SUCCESS,
                message: res,
            });
        })
        .catch(err => dispatch({
            input: input,
            type: SEARCH_SUCCESS,
            message: err,
        }));
    return {
        input: input,
        type: SEARCH_REQUEST,
    };
}
