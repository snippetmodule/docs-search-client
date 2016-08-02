import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { counterReducer } from './modules/counter/counter';
import { starsReducer } from './modules/stars/stars';
import {IReduxState } from './model';
const { reducer } = require('redux-connect');

const rootReducer: Redux.Reducer<IReduxState> = combineReducers({
  routing: routerReducer,
  counter: counterReducer,
  stars: starsReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
