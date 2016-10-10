import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { counterReducer } from './counter';
import { searchDocsReducer as _searchDocsReducer } from './searchdocs';
import { starsReducer } from './stars';
import { IReduxState } from './model';
const { reducer } = require('redux-connect');

const rootReducer: Redux.Reducer<IReduxState> = combineReducers({
  routing: routerReducer,
  counter: counterReducer,
  stars: starsReducer,
  searchDocsReducer: _searchDocsReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
