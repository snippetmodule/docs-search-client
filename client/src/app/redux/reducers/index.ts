import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { counterReducer } from './counter';
import { initReducer } from './init';
import { initDocPageReducer } from './docpage';
import { searchDocsReducer } from './searchdocs';
import { starsReducer } from './stars';
import {IReduxState } from './model';
const { reducer } = require('redux-connect');

const rootReducer: Redux.Reducer<IReduxState> = combineReducers({
  initReducer: initReducer,
  initDocPageReducer: initDocPageReducer,
  routing: routerReducer,
  counter: counterReducer,
  stars: starsReducer,
  searchDocsReducer: searchDocsReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
