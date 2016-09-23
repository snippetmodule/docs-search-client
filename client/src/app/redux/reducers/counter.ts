import { IReduxState, IReduxAction } from './model';

/** Action Types */
export const INCREMENT: string = 'INCREMENT';
export const DECREMENT: string = 'DECREMENT';

/** Counter: Initial State */
const initialState: IReduxState = {
  count: 0,
};

/** Reducer: CounterReducer */
export function counterReducer(state = initialState, action?: IReduxAction) {

  switch (action.type) {
    case INCREMENT:
      return {
        count: state.count + 1,
      };

    case DECREMENT:
      return {
        count: ((state.count - 1 > 0) ? state.count - 1 : 0),
      };

    default:
      return state;
  }
}

/** Action Creator: Increments the Counter */
export function increment(): IReduxAction {
  return {
    type: INCREMENT,
  };
}

/** Action Creator: Decrements the Counter */
export function decrement(): IReduxAction {
  return {
    type: DECREMENT,
  };
}
