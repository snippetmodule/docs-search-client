import app  from '../../config';
import * as React from 'react';
import * as Helmet from 'react-helmet';
import { Header } from '../../components';
import {Left} from './left';
import { IInitState } from '../../redux/reducers/init';
const { connect } = require('react-redux');

require('../../../css/application.css.scss');

interface IProps {
    init: IInitState;
}
@connect(
    state => ({ init: state.initReducer })
)
class App extends React.Component<IProps, any> {
    private s = require('./style.css');
    public render() {
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
            <div className={this.s.rootStyle} >
                <Helmet {...app.htmlConfig.app} {...app.htmlConfig.app.head}/>
                <div className={this.s.headerStyle}>
                    <Header/>
                </div>

                <div className={this.s.contentLayout}>
                    <div  className={this.s.leftLayout}>
                        <Left />
                    </div>
                    <div className={this.s.rightLayout}>
                        {this.props.children}
                    </div>
                </div>

                <div className={this.s.footerStyle}>
                    112131
                </div>
            </div>
        );
    }
}

export { App }
