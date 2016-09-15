import app  from '../../config';
import * as React from 'react';
import * as ReadtDom from 'react-dom';
import * as Helmet from 'react-helmet';
import { Header } from '../../components';
import {Left} from './left';
import { IInitState } from '../../redux/reducers/init';
const { connect } = require('react-redux');

interface IProps {
    init: IInitState;
}
@connect(
    state => ({ init: state.initReducer })
)
class App extends React.Component<IProps, any> {
    private mLeftElements: any[] = [];
    private mRightElements: Element[] = [];
    public componentDidUpdate() {
        this.mLeftElements.splice(0);
        this.mLeftElements.push(...document.getElementsByClassName('_resizer-left-div'));
        this.mRightElements.splice(0);
        this.mRightElements.push(document.getElementsByClassName('_container')[0].parentElement);
    }
    private resizer(event) {
        for (let ele of this.mLeftElements) {
            ele.style.width = event.clientX;
        }
        console.log('resizer:' + event.clientX);
    }
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
            <div className="_app" >
                <Helmet {...app.htmlConfig.app} {...app.htmlConfig.app.head}/>
                <Header/>
                <Left />
                {this.props.children}
                <div onMouseMove={this.resizer.bind(this) }
                    title="Click to toggle sidebar on/off" className="_resizer" draggable="true"></div>
            </div>
        );
    }
}

export { App }
