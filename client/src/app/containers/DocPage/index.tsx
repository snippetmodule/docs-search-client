import * as React from 'react';
import { Link} from 'react-router';
import {PageNotFound} from './PageNotFound';
import {IDocPageState} from '../../redux/reducers/docpage';
import {startRequestPage} from '../../redux/reducers/docpage';
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
    private rootElem: HTMLElement;

    constructor(props) {
        super(props);
        this.props.startRequestPage(this.props.location.pathname.split('#')[0]);
    }

    public componentDidUpdate(prevProps: IProps, prevState: void, prevContext: any) {
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
        nextScroolToElement = this.props.location.pathname.split('#')[1];
        if (nextScroolToElement) {
            let element = document.getElementById(nextScroolToElement);
            if (element) {
                this.rootElem.scrollTop = element.offsetTop;
            }
        } else {
            this.rootElem.scrollTop = 0;
        }
        if (onLoactionChangeCallback && (this.props.docPageState.isOk)) { // 更新完成后再发此回调
            for (let key in onLoactionChangeCallback) {
                if (onLoactionChangeCallback[key]) {
                    onLoactionChangeCallback[key](this.props.location.pathname);
                }
            }
        }
    }
    public componentWillReceiveProps(nextProps: IProps, nextContext: any) {
        let nextUrl: string = nextProps.location.pathname.split('#')[0];
        let curUrl: string = !this.props ? [] : this.props.location.pathname.split('#')[0];
        if (nextUrl !== curUrl) { // 外部传入地址location发生改变
            nextProps.startRequestPage(nextUrl);
            return;
        }
    }

    public render() {
        let { docPageState} = this.props;
        if (!this.props.docPageState.isOk) {
            return (
                <main ref={ref => this.rootElem = ref} className ="_content _content-loading" role="main" tabIndex="-1">
                    <div  className="_page">
                    </div>
                </main>
            );
        }
        if (this.props.docPageState.err) {
            return (
                <PageNotFound pathname = {this.props.location.pathname} onClickRetry={
                    (event: Event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.props.startRequestPage(this.props.location.pathname);
                    }
                }/>
            );
        }
        let clickExpendedItem = this.props.docPageState.clickExpendedItem;
        let mDocInfo = clickExpendedItem.data.docInfo;
        let htmlContent = docPageState.htmlResponse;
        if (mDocInfo && mDocInfo.links) {
            htmlContent = '<p class="_links">' +
                (mDocInfo.links.home ? ('<a href="XXXX" class="_links-link">Homepage</a>'.replace('XXXX', mDocInfo.links.home)) : '') +
                (mDocInfo.links.code ? ('<a href="XXXX" class="_links-link">Source code</a>'.replace('XXXX', mDocInfo.links.code)) : '') +
                '</p>' + htmlContent;
        }
        if (clickExpendedItem.data.docType && !clickExpendedItem.data.docEntry) {
            return (
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
            );
        }

        return (
            <main ref={ref => this.rootElem = ref} className ="_content" role="main" tabIndex="-1">
                <div  dangerouslySetInnerHTML={{ __html: htmlContent }}
                    className={'_page ' + (mDocInfo ? '_' + mDocInfo.type : '') } >
                </div>
            </main>
        );
    }
}
export {DocPage}
