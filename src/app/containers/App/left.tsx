
import * as React from 'react';
import {DocsModel} from '../../core/model';
import {ISearchState} from '../../redux/reducers/searchdocs';
import {isMounted} from '../../utils/react-utils';
import {docsArrays} from '../../core/docs';
import {startRequestPage} from '../../redux/reducers/linkpage';
import {history} from '../../routes';
const { connect } = require('react-redux');

interface IMyLinkProps {
    name: string;
    path: string;
    linkClickHandle: (routerPath: string, jumpUrl: string) => void;
}

class MyLink extends React.Component<IMyLinkProps, any> {
    private _onClick() {
        this.props.linkClickHandle('page', this.props.path);
    }
    public render() {
        return (
            <a onClick={this._onClick.bind(this) } > { this.props.name }</a >
        );
    }
}
interface IMenuProps {
    data: DocsModel;
    linkClickHandle: (routerPath: string, jumpUrl: string) => void;
}
class Menu extends React.Component<IMenuProps, any> {
    public shouldComponentUpdate(nextProps: ISearchProps, nextState: void, nextContext: any): boolean {
        if (isMounted(this.refs['Menu'])) {
            return true;
        }
        return false;
    }
    public render() {
        const docsItem: DocsModel = this.props.data;
        const rootPath: string = this.props.data.key + '/';
        let _linkClickHandle: (routerPath: string, jumpUrl: string) => void = this.props.linkClickHandle;
        if (!docsItem.value.entries[0].path) {
            console.log('key1111:' + docsItem.key);
        }
        return (
            <li key={docsItem.key} ref="Menu">
                <MyLink linkClickHandle={_linkClickHandle} path={rootPath + docsItem.value.entries[0].path} name = {docsItem.key} />
                <ul>
                    {docsItem.value.entries.map(function (item, index) {
                        if (!item.path) {
                            console.log('key:' + docsItem.key + 'index ' + index + (item.path));
                        }
                        return (
                            <li key={index}>
                                <MyLink linkClickHandle={_linkClickHandle} path={rootPath + item.path} name = {item.name} />
                            </li>
                        );
                    }) }
                </ul>
            </li >
        );
    }
}

interface ISearchProps {
    searchState?: ISearchState;
    startRequestPage?: (url: string) => void;
}
@connect(
    state => ({ searchState: state.searchDocs }),
    dispatch => ({
        startRequestPage: (url: string) => (dispatch(startRequestPage(dispatch, url))),
    }))
class Left extends React.Component<ISearchProps, void> {
    public shouldComponentUpdate(nextProps: ISearchProps, nextState: void, nextContext: any): boolean {
        // if(this.)
        return this.props.searchState.input !== nextProps.searchState.input;
    }
    public linkClickHandle(routerPath: string, jumpUrl: string) {
        console.trace();
        this.props.startRequestPage(jumpUrl);
        history.push({ pathname: routerPath });
    }
    public render() {
        let {searchState} = this.props;
        let searchResult = searchState.message ? searchState.message : docsArrays;
        let _linkClickHandle: (routerPath: string, jumpUrl: string) => void = this.linkClickHandle.bind(this);
        if (searchState.error) {
            return (<div> {searchState.error} </div>);
        }
        if (searchState.input.length !== 0 && searchResult.length === 0) {
            return (<div> 未找到搜索结果 </div>);
        }
        return (
            <ul >
                {searchResult.map(function (item, index) {
                    return (<Menu key={item.key} data={item} linkClickHandle ={_linkClickHandle} > </Menu>);
                }) }
            </ul>
        );
    }
}

export {Left }
