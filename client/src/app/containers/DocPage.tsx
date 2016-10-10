import * as React from 'react';
import { Link } from 'react-router';
import { PageNotFound } from './PageNotFound';
import { getDocInfoByUrlPath, ICanExpendedItem } from '../containers/App/ExpandedDocList';
import * as appConfig from '../config';
import { history } from '../routes';
import { PromiseComponent } from '../utils/PromiseComponent';

let docs_host_link = appConfig.default.docs.getConfig().docs_host_link;

let onLoactionChangeCallback: {
    [key: string]: (string) => void
} = {};
export function onDocsPageLoactionChangeCallback(key: string, callback: (string) => void) {
    onLoactionChangeCallback[key] = callback;
}

interface IDocPageState {
    url: string;
    htmlResponse?: string;
    clickExpendedItem?: ICanExpendedItem;
}

class DocContentPage extends React.Component<IDocPageState, any> {
    private rootElem: HTMLElement;
    public componentDidUpdate() {
        if (!this.rootElem || !this.rootElem.getElementsByTagName) {
            return;
        }
        let nextScroolToElement: string = null;
        let links = this.rootElem.getElementsByTagName('a');
        for (let i = 0; i < links.length; i++) {
            let link = links[i];
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
        let htmlContent = this.props.htmlResponse;
        let iconCss = (clickExpendedItem && clickExpendedItem.data.docInfo ? '_' + clickExpendedItem.data.docInfo.type : '');
        if (clickExpendedItem) {
            let mDocInfo = clickExpendedItem.data.docInfo;
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
                            <main ref={ref => this.rootElem = ref} className="_content" role="main" tabIndex={-1}>
                                <div className="_page">
                                    <h1>{clickExpendedItem.data.name + ' / ' + clickExpendedItem.parent.data.name}</h1>
                                    <ul>
                                        {clickExpendedItem.child.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <Link to={{ pathname: item.data.pathname }}>{item.data.name}</Link>
                                                </li >
                                            );
                                        })}
                                    </ul>
                                </div>
                            </main>
                        </div>
                        <BottomMark data={this.props.clickExpendedItem} />
                    </div>
                );
            }
        }

        return (
            <div style={{ height: '100%' }}>
                <div className="_container" role="document">
                    <main ref={ref => this.rootElem = ref} className="_content" role="main" tabIndex={-1}>
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }}
                            className={'_page ' + iconCss} >
                        </div>
                    </main>
                </div>
                {this.props.clickExpendedItem ? <BottomMark data={this.props.clickExpendedItem} /> : ''}
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
                <Link to={docInfo.pathname} className={'_path-item _icon-' + docInfo.slug.split('~')[0]}> {docInfo.name + ' ' + (docInfo.version || '')}</Link>
                <Link to={docType ? docType.pathname : ''} className="_path-item">{docType ? docType.name : ''}</Link>
                <span className="_path-item">{docEntry ? docEntry.name : ''}</span>
            </div >
        );
    }
}
interface IDocPageProps {
    location?: any;
}
interface IDocPageState {
    url: string;
}
class DocPage extends React.Component<IDocPageProps, void> {
    constructor(props) {
        super(props);
    }
    public componentDidUpdate(prevProps: IDocPageProps, prevState: void, prevContext: any) {
        if (onLoactionChangeCallback
            && this.props.location.pathname !== prevProps.location.pathname) {
            for (let key in onLoactionChangeCallback) {
                if (onLoactionChangeCallback[key]) {
                    onLoactionChangeCallback[key](this.props.location.pathname);
                }
            }
        }
    }
    public shouldComponentUpdate?(nextProps: IDocPageProps, nextState: void, nextContext: any): boolean {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            return true;
        }
        return false;
    }
    private renderLoading() {
        return (
            <div style={{ height: '100%' }}>
                <div className="_container" role="document">
                    <main className="_content _content-loading" role="main" tabIndex={-1}>
                        <div className="_page">
                        </div>
                    </main>
                </div>
            </div>
        );
    }
    private renderFetched(data, reload: () => any) {
        return (<DocContentPage {...data.getHtml} />);
    }
    private renderFailure(err: Error, reload: () => any) {
        console.log('DocPage' + err.stack);
        return (
            <div style={{ height: '100%' }}>
                <div className="_container" role="document">
                    <PageNotFound pathname={this.props.location.pathname} onClickRetry={
                        (event: Event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            reload();
                        }
                    } />
                </div>
            </div>
        );
    }
    private async fetchData(params) {
        let _url = this.props.location.pathname;
        let _clickExpendedItem: ICanExpendedItem = getDocInfoByUrlPath(_url);
        if (_clickExpendedItem && _clickExpendedItem.data.docType && !_clickExpendedItem.data.docEntry) {
            return { url: _url, htmlResponse: null, clickExpendedItem: _clickExpendedItem };
        }
        let res = await fetch(appConfig.default.docs.getConfig().docs_host + _url, {
            headers: {
                Accept: 'text/html',
            },
        });
        if (res.ok) {
            let text = await res.text();
            return { url: _url, htmlResponse: text, clickExpendedItem: _clickExpendedItem };
        } else {
            throw new Error(`fetch error url:${res.url} status:${res.status} statusText:${res.statusText}`);
        }
    }
    public render() {
        return (
            <PromiseComponent
                params={null}
                renderLoading={this.renderLoading.bind(this)}
                renderFetched={this.renderFetched.bind(this)}
                renderFailure={this.renderFailure.bind(this)}
                fragments={{
                    getHtml: this.fetchData.bind(this),
                }}
                />
        );
    }
}
export { DocPage }
