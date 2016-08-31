import * as React from 'react';
import { Link } from 'react-router';
import {ILinkPageState} from '../../redux/reducers/linkpage';
import {startRequestPage} from '../../redux/reducers/linkpage';
const { connect } = require('react-redux');

interface IProps {
    location?: any;
    init?: ILinkPageState;
    startRequestPage?: (url: string) => void;
}
@connect(
    state => ({ init: state.initLinkPage }),
    dispatch => ({
        startRequestPage: (url: string) => (dispatch(startRequestPage(dispatch, url))),
    }))
class LinkPage extends React.Component<IProps, void> {
    public refs: {
        [key: string]: (HTMLInputElement);
        rootElem?: HTMLInputElement;
    } = {};
    private nextScroolToElement: string = null;

    constructor(props) {
        super(props);
        if (this.props.location.query.url) {
            let curUrl: string = this.props.location.query.url || '';
            let indexCurrUrl = curUrl.indexOf('#');
            curUrl = indexCurrUrl === -1 ? curUrl : curUrl.substr(0, indexCurrUrl);
            this.props.startRequestPage(curUrl);
        }
    }
    public componentDidUpdate(prevProps: IProps, prevState: void, prevContext: any) {
        if (this.nextScroolToElement) {
            let element = document.getElementById(this.nextScroolToElement);
            if (element) {
                console.log('componentDidUpdate:' + this.refs.rootElem.scrollTop + '   ' + element.offsetTop);
                this.refs.rootElem.scrollTop = element.offsetTop;
                console.log('componentDidUpdate:' + this.refs.rootElem.scrollTop);
            }
        } else {
            this.refs.rootElem.scrollTop = 0;
        }
    }
    public componentWillReceiveProps(nextProps: IProps, nextContext: any) {
        this.nextScroolToElement = null;
        if (nextProps.location.state) {
            return;
        }
        let nextUrl: string = nextProps.location.query.url;
        let curUrl: string = this.props.location.query.url || '';
        let indexNextUrl = nextUrl.indexOf('#');
        let indexCurrUrl = curUrl.indexOf('#');
        let nextScroolTo: string = indexNextUrl === -1 ? '' : nextUrl.substr(indexNextUrl + 1, nextUrl.length);

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
        if (this.props.location.state) {
            return (
                <div ref="rootElem" className={s._content}>
                    <h1></h1>
                    <ul>
                        {this.props.location.state.data.map(item => {
                            return (
                                <li key={item.name}>
                                    <Link to={{ pathname: 'page', query: { url: item.link } }}>{item.name}</Link>
                                </li >
                            );
                        }) }
                    </ul>
                </div>
            );
        }
        if (!init.isInited && !init.content) {
            return (
                <div ref="rootElem" className={s._content}>
                    加载中
                </div>);
        }
        return (
            <div ref="rootElem" className={s._content}>
                <div dangerouslySetInnerHTML={{ __html: init.content }}/>
            </div>
        );
    }
}

export {LinkPage }
