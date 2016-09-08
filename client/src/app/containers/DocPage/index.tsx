import * as React from 'react';
import { Link} from 'react-router';
import {IDocPageState} from '../../redux/reducers/docpage';
import {startRequestPage} from '../../redux/reducers/docpage';
import {DocsModelEntriyType, IDocInfo} from '../../core/model';
import {getDocInfoByUrlPath} from '../App/ExpandedDocList';
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
    init?: IDocPageState;
    startRequestPage?: (url: string) => void;
}

@connect(
    state => ({ init: state.initDocPageReducer }),
    dispatch => ({
        startRequestPage: (url: string) => (dispatch(startRequestPage(dispatch, url))),
    }))
class DocPage extends React.Component<IProps, void> {
    private rootElem: HTMLElement;
    private nextScroolToElement: string = null;

    private mDocInfo: IDocInfo;
    private mEntryTypes: DocsModelEntriyType[];

    constructor(props) {
        super(props);
        let curUrl: string = this.props.location.pathname;
        this.initDocInfo(curUrl);
        if (!this.mEntryTypes && curUrl) {
            let indexCurrUrl = curUrl.indexOf('#');
            curUrl = indexCurrUrl === -1 ? curUrl : curUrl.substr(0, indexCurrUrl);
            this.props.startRequestPage(curUrl);
        }

    }
    private initDocInfo(curUrl: string) {
        let result = getDocInfoByUrlPath(curUrl);
        if (result) {
            this.mDocInfo = result.docInfo;
            this.mEntryTypes = result.types;
        }
    }
    public componentDidUpdate(prevProps: IProps, prevState: void, prevContext: any) {
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
        if (this.nextScroolToElement) {
            let element = document.getElementById(this.nextScroolToElement);
            if (element) {
                this.rootElem.scrollTop = element.offsetTop;
            }
        } else {
            this.rootElem.scrollTop = 0;
        }
        if (onLoactionChangeCallback && (this.mEntryTypes || this.props.init.isInited)) { // 更新完成后再发此回调
            for (let key in onLoactionChangeCallback) {
                if (onLoactionChangeCallback[key]) {
                    onLoactionChangeCallback[key](this.props.location.pathname);
                }
            }
        }
    }
    public componentWillReceiveProps(nextProps: IProps, nextContext: any) {
        this.nextScroolToElement = null;
        let nextUrl: string = nextProps.location.pathname;
        let curUrl: string = this.props.location.pathname || '';
        let indexNextUrl = nextUrl.indexOf('#');
        let indexCurrUrl = curUrl.indexOf('#');
        let nextScroolTo: string = indexNextUrl === -1 ? '' : nextUrl.substr(indexNextUrl + 1, nextUrl.length);

        this.initDocInfo(nextUrl);
        if (this.mEntryTypes) {
            return;
        }
        if (!nextScroolTo) { // 不包含＃
            if (nextUrl !== curUrl && nextUrl) {
                nextProps.startRequestPage(nextUrl);
                nextProps.init.isInited = false;
                nextProps.init.content = undefined;
            }
        } else {
            nextUrl = nextUrl.substr(0, indexNextUrl);
            curUrl = curUrl.substr(0, indexCurrUrl);
            if (nextUrl !== curUrl) {
                nextProps.startRequestPage(nextUrl);
                nextProps.init.isInited = false;
                nextProps.init.content = undefined;
            } else {
                this.nextScroolToElement = nextScroolTo.replace('.html', '');
            }
        }
    }

    public render() {
        let { init} = this.props;
        let htmlContent = init.content;
        if (this.mDocInfo && this.mDocInfo.links) {
            htmlContent = '<p class="_links">' +
                (this.mDocInfo.links.home ? ('<a href="XXXX" class="_links-link">Homepage</a>'.replace('XXXX', this.mDocInfo.links.home)) : '') +
                (this.mDocInfo.links.code ? ('<a href="XXXX" class="_links-link">Source code</a>'.replace('XXXX', this.mDocInfo.links.code)) : '') +
                '</p>' + htmlContent;
        }
        if (this.mEntryTypes) {
            return (
                <div  ref={ref => this.rootElem = ref} className="_content">
                    <div className="_page">
                        <h1>{}</h1>
                        <ul>
                            {this.mEntryTypes.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={{ pathname: '/docs/' + item.doc.slug + '/' + item.path }}>{item.name}</Link>
                                    </li >
                                );
                            }) }
                        </ul>
                    </div>
                </div>
            );
        }
        if (!init.isInited && !init.content) {
            return (
                <div ref={ref => this.rootElem = ref} className="_content">
                    加载中
                </div>);
        }

        return (
            <div ref={ref => this.rootElem = ref} className="_content">
                <div dangerouslySetInnerHTML={{ __html: htmlContent }}
                    className={'_page ' + (this.mDocInfo ? '_' + this.mDocInfo.type : '') } >
                </div>
            </div>
        );
    }
}
export {DocPage}
