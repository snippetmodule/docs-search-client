import appConfig  from '../../../appconfig';
import * as React from 'react';
import * as Helmet from 'react-helmet';
import { Header } from '../../components';
import {Left} from './left';
import { ISearchState } from '../../redux/reducers/searchdocs';
import { getSearchResult } from '../../redux/reducers/searchdocs';
import { search } from '../../core/docs';
const { connect } = require('react-redux');

interface ISearchProps {
  searchState: ISearchState;
  getSearchResult: (input: string) => void;
}

@connect(
  state => ({ searchState: state.searchDocs }),
  dispatch => ({
    getSearchResult: (input: string) => dispatch(getSearchResult(dispatch, input)),
  })
)

class App extends React.Component<ISearchProps, ISearchState> {

  private defaultState: ISearchState = null;

  constructor(props, state) {
    super(props, state);
    search('')
      .then(res => { this.defaultState = { isSearch: false, message: res }; this.forceUpdate(); })
      .catch(error => console.log(' App init defaultState error' + error));
  }
  public render() {
    const s = require('./style.css');
    let searchResult = this.props.searchState.message
      ? this.props.searchState.message
      : (this.defaultState ? this.defaultState.message : []);
    return (
      <div className={s.rootStyle} >
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        <div className={s.headerStyle}>
          <Header getSearchResult = {this.props.getSearchResult} />
        </div>

        <div className={s.contentLayout}>
          <div  className={s.leftLayout}>
            <Left searchResult = {searchResult}/>
          </div>
          <div className={s.rightLayout}>
            {this.props.children}
          </div>
        </div>

        <div className={s.footerStyle}>
          112131
        </div>
      </div>
    );
  }
}

export { App }
