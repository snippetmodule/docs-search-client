import app  from '../../config';
/** Action Types */
export const INIT_REQUEST: string = 'INIT_REQUEST';
export const INIT_SUCCESS: string = 'INIT_SUCCESS';
export const INIT_FAILURE: string = 'INIT_FAILURE';

export interface IInitState {
    isInited: boolean;
}
export interface IInitAction {
    type: string;
}

/** Reducer */
export function initReducer(state = { isInited: false }, action: IInitAction) {

    switch (action.type) {
        case INIT_REQUEST:
            return Object.assign({}, state, {
                isInited: false,
            });

        case INIT_SUCCESS:
            return Object.assign({}, state, {
                isInited: true,
            });

        case INIT_FAILURE:
            return Object.assign({}, state, {
                isInited: false,
            });

        default:
            return state;
    }

}

/** Async Action Creator */
export function startInit(): Redux.Dispatch<IInitAction> {
    return dispatch => {
        dispatch({ type: INIT_REQUEST });

        return app.init()
            .then(res => {
                console.log('startInit:' + ' time:' + new Date().getTime());
                dispatch({ type: INIT_SUCCESS });
            }).catch(err => {
                console.log('startInit:' + err.stack);
                dispatch({ type: INIT_FAILURE });
            });
    };
}
