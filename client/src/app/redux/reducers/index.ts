import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { counterReducer } from './counter';
import { initReducer as _initReducer} from './init';
import { initDocPageReducer as _initDocPageReducer} from './docpage';
import { searchDocsReducer as _searchDocsReducer} from './searchdocs';
import { starsReducer } from './stars';
import {IReduxState } from './model';
const { reducer } = require('redux-connect');

const rootReducer: Redux.Reducer<IReduxState> = combineReducers({
  initReducer: _initReducer,
  initDocPageReducer: _initDocPageReducer,
  routing: routerReducer,
  counter: counterReducer,
  stars: starsReducer,
  searchDocsReducer: _searchDocsReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
