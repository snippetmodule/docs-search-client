import * as React from 'react';
import { Link} from 'react-router';
import {PageNotFound} from './PageNotFound';
import {IDocPageState} from '../../redux/reducers/docpage';
import {startRequestPage} from '../../redux/reducers/docpage';
import {ICanExpendedItem} from '../../containers/App/ExpandedDocList';
import * as appConfig from '../../config';
import {history} from '../../routes';
const { connect } = require('react-redux');

let docs_host_link = appConfig.default.docs.getConfig().docs_host_link;

let onLoactionChangeCallback: {
    [key: string]: (string) => void
} = {};
export function onDocsPageLoactionChangeCallback(key: string, callback: (string) => void) {
    onLoactionChangeCallback[key] = callback;
}

interface IProps {
    location?: any;
    docPageState?: IDocPageState;
    startRequestPage?: (url: string) => void;
}

@connect(
    state => ({ docPageState: state.initDocPageReducer }),
    dispatch => ({
        startRequestPage: (url: string) => (dispatch(startRequestPage(dispatch, url))),
    }))
class DocPage extends React.Component<IProps, void> {
    constructor(props) {
        super(props);
        this.props.startRequestPage(this.props.location.pathname);
    }
    public componentDidUpdate(prevProps: IProps, prevState: void, prevContext: any) {
        if (onLoactionChangeCallback
            && this.props.docPageState
            && this.props.docPageState.url !== prevProps.docPageState.url) {
            for (let key in onLoactionChangeCallback) {
                if (onLoactionChangeCallback[key]) {
                    onLoactionChangeCallback[key](this.props.docPageState.url);
                }
            }
        }
    }
    public componentWillReceiveProps(nextProps: IProps, nextContext: any) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            nextProps.startRequestPage(nextProps.location.pathname);
        }
    }

    public render() {
        if (!this.props.docPageState.isOk) {
            return (
                <div style={{ height: '100%' }}>
                    <div className="_container" role="document">
                        <main className ="_content _content-loading" role="main" tabIndex="-1">
                            <div  className="_page">
                            </div>
                        </main>
                    </div>
                </div>
            );
        }
        if (this.props.docPageState.err) {
            console.log('DocPage' + this.props.docPageState.err.stack);
            return (
                <div style={{ height: '100%' }}>
                    <div className="_container" role="document">
                        <PageNotFound pathname = {this.props.location.pathname} onClickRetry={
                            (event: Event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.props.startRequestPage(this.props.location.pathname);
                            }
                        }/>
                    </div>
                </div>
            );
        }
        return (
            <DocContentPage {...this.props.docPageState}/>
        );
    }
}

class DocContentPage extends React.Component<IDocPageState, any> {
    private rootElem: HTMLElement;

    public componentDidMount() {
        if (!this.rootElem || !this.rootElem.getElementsByTagName) {
            return;
        }
        let nextScroolToElement: string = null;
        let links = this.rootElem.getElementsByTagName('a');
        for (let link of links) {
            link.onclick = (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                if (link.host === docs_host_link) {
                    history.push({
                        pathname: link.pathname + link.hash,
                    });
                } else {
                    window.open(link.href);
                }
            };
        }
        nextScroolToElement = this.props.url.split('#')[1];
        if (nextScroolToElement) {
            let element = document.getElementById(nextScroolToElement);
            if (element) {
                this.rootElem.scrollTop = element.offsetTop;
            }
        } else {
            this.rootElem.scrollTop = 0;
        }
    }

    public render() {
        let clickExpendedItem = this.props.clickExpendedItem;
        let mDocInfo = clickExpendedItem.data.docInfo;
        let htmlContent = this.props.htmlResponse;
        if (mDocInfo && mDocInfo.links) {
            htmlContent = '<p class="_links">' +
                (mDocInfo.links.home ? ('<a href="XXXX" class="_links-link">Homepage</a>'.replace('XXXX', mDocInfo.links.home)) : '') +
                (mDocInfo.links.code ? ('<a href="XXXX" class="_links-link">Source code</a>'.replace('XXXX', mDocInfo.links.code)) : '') +
                '</p>' + htmlContent;
        }
        if (clickExpendedItem.data.docType && !clickExpendedItem.data.docEntry) {
            return (
                <div style={{ height: '100%' }}>
                    <div className="_container" role="document">
                        <main ref={ref => this.rootElem = ref} className ="_content" role="main" tabIndex="-1">
                            <div  className="_page">
                                <h1>{clickExpendedItem.data.name + ' / ' + clickExpendedItem.parent.data.name}</h1>
                                <ul>
                                    {clickExpendedItem.child.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <Link to={{ pathname: item.data.pathname }}>{item.data.name}</Link>
                                            </li >
                                        );
                                    }) }
                                </ul>
                            </div>
                        </main>
                    </div>
                    <BottomMark data = {this.props.clickExpendedItem}/>
                </div>
            );
        }

        return (
            <div style={{ height: '100%' }}>
                <div className="_container" role="document">
                    <main ref={ref => this.rootElem = ref} className ="_content" role="main" tabIndex="-1">
                        <div  dangerouslySetInnerHTML={{ __html: htmlContent }}
                            className={'_page ' + (mDocInfo ? '_' + mDocInfo.type : '') } >
                        </div>
                    </main>
                </div>
                <BottomMark data = {this.props.clickExpendedItem}/>
            </div>
        );
    }
}
interface IBottomMarkProps {
    data: ICanExpendedItem;
}
class BottomMark extends React.Component<IBottomMarkProps, any> {
    public render() {
        let {docInfo, docType, docEntry} = this.props.data.data;
        return (
            <div role="complementary" className="_path" style={{ display: !docType && !docEntry ? 'none' : 'block' }}>
                <Link to={docInfo.pathname} className={'_path-item _icon-' + docInfo.slug.split('~')[0]}> { docInfo.name + ' ' + (docInfo.version || '') }</Link>
                <Link to={docType ? docType.pathname : ''} className="_path-item">{docType ? docType.name : ''}</Link>
                <span className="_path-item">{docEntry ? docEntry.name : ''}</span>
            </div >
        );
    }
}
export {DocPage}
