import appConfig  from '../../../appconfig';
import * as React from 'react';
import * as Helmet from 'react-helmet';
import { Header } from '../../components';
import {Left} from './left';

class App extends React.Component<any, any> {
  public render() {
    const s = require('./style.css');
    return (
      <div className={s.rootStyle} >
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        <div className={s.headerStyle}>
          <Header />
        </div>

        <div className={s.contentLayout}>
          <div  className={s.leftLayout}>
            <Left />
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
