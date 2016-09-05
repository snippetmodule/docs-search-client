import * as React from 'react';
import { Link} from 'react-router';
import {IDocPageState} from '../../redux/reducers/docpage';
import {startRequestPage} from '../../redux/reducers/docpage';
import {DocsModelEntriyType} from '../../core/model';
import {getTypesByUrlPath} from '../App/ExpandedDocList';
import * as appConfig from '../../config';
import {history} from '../../routes';
const { connect } = require('react-redux');

let docs_host_link = appConfig.default.docs.getConfig().docs_host_link;

let onLoactionChangeCallback: (string) => void;
export function onDocsPageLoactionChangeCallback(callback: (string) => void) {
    onLoactionChangeCallback = callback;
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

    private mEntryTypes: DocsModelEntriyType[];
    constructor(props) {
        super(props);
        let curUrl: string = this.props.location.pathname;
        this.mEntryTypes = getTypesByUrlPath(curUrl);
        if (!this.mEntryTypes && curUrl) {
            let indexCurrUrl = curUrl.indexOf('#');
            curUrl = indexCurrUrl === -1 ? curUrl : curUrl.substr(0, indexCurrUrl);
            this.props.startRequestPage(curUrl);
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
                        pathname: link.pathname,
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
    }
    public componentWillReceiveProps(nextProps: IProps, nextContext: any) {
        this.nextScroolToElement = null;
        let nextUrl: string = nextProps.location.pathname;
        let curUrl: string = this.props.location.pathname || '';
        let indexNextUrl = nextUrl.indexOf('#');
        let indexCurrUrl = curUrl.indexOf('#');
        let nextScroolTo: string = indexNextUrl === -1 ? '' : nextUrl.substr(indexNextUrl + 1, nextUrl.length);

        this.mEntryTypes = getTypesByUrlPath(nextUrl);
        if (onLoactionChangeCallback) {
            onLoactionChangeCallback(nextUrl);
        }
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
        const s = require('./style.css');
        if (this.mEntryTypes) {
            return (
                <div ref={ref => this.rootElem = ref} className={s._content}>
                    <h1></h1>
                    <ul>
                        {this.mEntryTypes.map(item => {
                            return (
                                <li key={item.name}>
                                    <Link to={{ pathname: '/docs/' + item.doc.slug + '/' + item.path }}>{item.name}</Link>
                                </li >
                            );
                        }) }
                    </ul>
                </div>
            );
        }
        if (!init.isInited && !init.content) {
            return (
                <div ref={ref => this.rootElem = ref} className={s._content}>
                    加载中
                </div>);
        }
        return (
            <div ref={ref => this.rootElem = ref} className={s._content}>
                <div dangerouslySetInnerHTML={{ __html: init.content }}/>
            </div>
        );
    }
}
export {DocPage}
