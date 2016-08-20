import appConfig  from '../../../appconfig';
import * as React from 'react';
import * as Helmet from 'react-helmet';
import { Header } from '../../components';
import {Left} from './left';
import { IInitState } from '../../redux/reducers/init';

const { connect } = require('react-redux');

interface IProps {
  init: IInitState;
}

@connect(
  state => ({ init: state.init })
)
class App extends React.Component<IProps, any> {
  public render() {
    const s = require('./style.css');
    console.log('App ' + this.props.init.isInited);
    if (!this.props.init.isInited) {
      return (
        <div style={{
          height: '100px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          fontSize: '2rem',
          color: 'grey',
          margin: '-50px 0 0 -50px',
        }} > Loading </div>
      );
    }
    return (
      <div className={s.rootStyle} >
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        <div className={s.headerStyle}>
          <Header/>
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