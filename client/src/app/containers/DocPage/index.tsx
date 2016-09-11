import * as React from 'react';
import { Link} from 'react-router';
import {IDocPageState} from '../../redux/reducers/docpage';
import {startRequestPage} from '../../redux/reducers/docpage';
import {getDocInfoByUrlPath, ICanExpendedItem} from '../App/ExpandedDocList';
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

    private mCanExpandedItem: ICanExpendedItem;
    constructor(props) {
        super(props);
        this.handlerNextProps(this.props, null);
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
        if (onLoactionChangeCallback && (this.props.init.isInited)) { // 更新完成后再发此回调
            for (let key in onLoactionChangeCallback) {
                if (onLoactionChangeCallback[key]) {
                    onLoactionChangeCallback[key](this.props.location.pathname);
                }
            }
        }
    }
    public shouldComponentUpdate(nextProps: IProps, nextState: void, nextContext: any): boolean {
        if (this.props.init.isInited && this.props.location.pathname === nextProps.location.pathname) {
            return false;
        }
        return true;
    }
    private handlerNextProps(nextProps: IProps, curProps: IProps) {
        let nextUrlParams: string[] = nextProps.location.pathname.split('#');
        let curUrlParams: string[] = !curProps ? [] : curProps.location.pathname.split('#');

        this.mCanExpandedItem = getDocInfoByUrlPath(nextUrlParams[0]);
        if (nextProps.location.state && nextProps.location.state.typeSlug && !nextProps.location.state.entrySlug) { // 显示的为 types 列表
            this.nextScroolToElement = null;
            nextProps.init.isInited = true;
            return;
        }
        if (nextUrlParams[0] !== curUrlParams[0]) { // url 不一致 
            nextProps.startRequestPage(nextUrlParams[0]);
            nextProps.init.isInited = false;
            nextProps.init.content = undefined;
        }
        this.nextScroolToElement = nextUrlParams[1];
    }
    public componentWillReceiveProps(nextProps: IProps, nextContext: any) {
        if (this.props.location.pathname === nextProps.location.pathname) { // 说明不需要处理，之前已经处理过
            return;
        }
        this.handlerNextProps(nextProps, this.props);
    }

    public render() {
        let { init} = this.props;
        let mDocInfo = this.mCanExpandedItem.data.docInfo;
        let htmlContent = init.content;
        if (mDocInfo && mDocInfo.links) {
            htmlContent = '<p class="_links">' +
                (mDocInfo.links.home ? ('<a href="XXXX" class="_links-link">Homepage</a>'.replace('XXXX', mDocInfo.links.home)) : '') +
                (mDocInfo.links.code ? ('<a href="XXXX" class="_links-link">Source code</a>'.replace('XXXX', mDocInfo.links.code)) : '') +
                '</p>' + htmlContent;
        }
        if (this.props.location.state && this.props.location.state.typeSlug && !this.props.location.state.entrySlug) {
            return (
                <div  ref={ref => this.rootElem = ref} className="_content">
                    <div className="_page">
                        <h1>{this.mCanExpandedItem.data.name + ' / ' + this.mCanExpandedItem.parent.data.name}</h1>
                        <ul>
                            {this.mCanExpandedItem.child.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={{ pathname: item.data.pathname }}>{item.data.name}</Link>
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
                    className={'_page ' + (mDocInfo ? '_' + mDocInfo.type : '') } >
                </div>
            </div>
        );
    }
}
export {DocPage}
