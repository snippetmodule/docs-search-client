import app from '../../config';
import * as React from 'react';
import * as Helmet from 'react-helmet';
import { Header } from './Header';
import { Left } from './left';
import { PromiseComponent } from '../../utils/PromiseComponent';
import { ISearchItem } from '../../core/model';

class AppImpl extends React.Component<any, void> {
    private mLeftRef: Left;
    private mHeaderRef: Header;

    private doSearch(searchKey: string) {
        app.docs.search(searchKey).then((res: Array<ISearchItem>) => {
            this.mLeftRef.setState({
                input: searchKey,
                isSearch: false,
                error: false,
                message: res,
            });
        }).catch(err => {
            this.mLeftRef.setState({
                input: searchKey,
                isSearch: false,
                error: true,
                message: err,
            });
        });
    }
    private getSearchTag() {
        if (this.mLeftRef) {
            return this.mLeftRef.getSearchTag();
        }
        return null;
    }
    private keyEnterHandler() {
        if (this.mLeftRef) {
            return this.mLeftRef.keyEnterHandler();
        }
        return null;
    }
    public render() {
        return (
            <div className="_app" >
                <Helmet {...app.htmlConfig.app} {...app.htmlConfig.app.head} />
                <Header ref={ref => this.mHeaderRef = ref}
                    doSearch={this.doSearch.bind(this)}
                    getSearchTag={this.getSearchTag.bind(this)}
                    keyEnterHandler={this.keyEnterHandler.bind(this)} />
                <Left ref={ref => this.mLeftRef = ref} {...this.props}/>
                {this.props.children}
                <div onMouseMove={this.props.resizer}
                    title="Click to toggle sidebar on/off" className="_resizer" draggable={true}></div>
            </div>
        );
    }
}
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
            <AppImpl resizer={this.resizer.bind(this)} {...this.props} />
        );
    }

    public render() {
        return (
            <PromiseComponent
                renderLoading={this.renderLoading.bind(this)}
                renderFetched={this.renderFetched.bind(this)}
                fragments={{
                    init: async () => { await app.docs.init(); },
                }}
                />
        );
    }
}

export { App }
