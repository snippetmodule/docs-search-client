import app from '../../config';
import * as React from 'react';
// import * as ReadtDom from 'react-dom';
import * as Helmet from 'react-helmet';
import { Header } from './Header';
import { Left } from './left';
import { PromiseComponent } from '../../utils/PromiseComponent';

class App extends React.Component<void, void> {
    constructor(props) {
        super(props);
    }
    // private mLeftElements: any[] = [];
    // private mRightElements: Element[] = [];
    public componentDidUpdate() {
        // this.mLeftElements.splice(0);
        // this.mLeftElements.push(...document.getElementsByClassName('_resizer-left-div'));
        // this.mRightElements.splice(0);
        // this.mRightElements.push(document.getElementsByClassName('_container')[0].parentElement);
    }
    private resizer(event) {
        // for (let ele of this.mLeftElements) {
        //     ele.style.width = event.clientX;
        // }
        // console.log('resizer:' + event.clientX);
    }
    private renderLoading() {
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
    private renderFetched() {
        return (
            <div className="_app" >
                <Helmet {...app.htmlConfig.app} {...app.htmlConfig.app.head} />
                <Header />
                <Left />
                {this.props.children}
                <div onMouseMove={this.resizer.bind(this)}
                    title="Click to toggle sidebar on/off" className="_resizer" draggable={true}></div>
            </div>
        );
    }

    public render() {
        return (
            <PromiseComponent
                params={{}}
                renderLoading={this.renderLoading.bind(this)}
                renderFetched={this.renderFetched.bind(this)}
                fragments={{
                    init: app.docs.init.bind(app.docs),
                }}
                />
        );
    }
}

export { App }
