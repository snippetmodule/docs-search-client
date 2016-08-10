
import { search } from '../../core/docs';
import { DocsModel } from '../../core/model';
/** Action Types */
export const STARS_REQUEST: string = 'STARS_REQUEST';
export const STARS_SUCCESS: string = 'STARS_SUCCESS';
export const STARS_FAILURE: string = 'STARS_FAILURE';

export interface ISearchState {
    isSearch: boolean;
    error?: boolean;
    message?: Array<DocsModel>;
}

export interface ISearchAction {
    type: string;
    message?: Array<DocsModel>;
}

/** Reducer */
export function searchDocsReducer(state = { isSearch: false }, action: ISearchAction): ISearchState {

    switch (action.type) {
        case STARS_SUCCESS:
            return Object.assign({}, state, {
                isSearch: false,
                error: false,
                message: action.message,
            });

        case STARS_FAILURE:
            return Object.assign({}, state, {
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
    search(input)
        .then((res: Array<DocsModel>) => {
            return dispatch(searchSuccess(res));
        })
        .catch(err => dispatch(searchFailure(err)));
    return searchRequest();
}

/** Action Creator */
export function searchRequest(): ISearchAction {
    return {
        type: STARS_REQUEST,
    };
}

/** Action Creator */
export function searchSuccess(message: Array<DocsModel>): ISearchAction {
    return {
        type: STARS_SUCCESS,
        message: message,
    };
}

/** Action Creator */
export function searchFailure(message: any): ISearchAction {
    return {
        type: STARS_FAILURE,
        message: message,
    };
}
