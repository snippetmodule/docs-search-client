const appConfig = require('../../../../config/main');
import * as React from 'react';
import * as Helmet from 'react-helmet';
import { Header } from '../../components';
import {Left} from './left';

class App extends React.Component<any, any> {
  public render() {
    const s = require('./style.css');

    return (
      <div className={s.appContainer}>
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        <Header />
        <div className={s.mainContainer}>
          <div className={s.left}>
            <Left />
          </div>
          <div className={s.right}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export { App }
