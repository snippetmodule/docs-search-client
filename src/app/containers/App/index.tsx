import appConfig  from '../../../appconfig';
import * as React from 'react';
import * as Helmet from 'react-helmet';
import { Header } from '../../components';
import {Left} from './left';
import { ISearchState } from '../../redux/reducers/searchdocs';
const { connect } = require('react-redux');

interface ISearchProps {
  searchState: ISearchState;
}

@connect(
  state => ({ searchState: state.searchDocs })
)

class App extends React.Component<ISearchProps, ISearchState> {
  public render() {
    const s = require('./style.css');
    const { searchState } = this.props;
    return (
      <div className={s.rootStyle} >
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        <div className={s.headerStyle}>
          <Header/>
        </div>

        <div className={s.contentLayout}>
          <div  className={s.leftLayout}>
            <Left searchResult = {searchState.message === undefined ? [] : searchState.message}/>
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
