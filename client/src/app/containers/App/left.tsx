
import * as React from 'react';
import { Link } from 'react-router';
import {DocsModel, ISearchResultItem} from '../../core/model';
import {ISearchState} from '../../redux/reducers/searchdocs';
import {isMounted} from '../../utils/react-utils';
// import {docsArrays} from '../../core/docs';
import ReactList from '../../utils/react-lists';
const { connect } = require('react-redux');

interface IMyLinkProps {
    name: string;
    path: string;
}

class MyLink extends React.Component<IMyLinkProps, any> {
    public render() {
        return (
            <Link to={{ pathname: 'page', query: { url: this.props.path + '.html' } }} > { this.props.name }</Link >
        );
    }
}
interface IMenuProps {
    data: DocsModel;
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
        if (!docsItem.value.entries[0].path) {
            console.log('key1111:' + docsItem.key);
        }
        return (
            <li key={docsItem.key} ref="Menu">
                <MyLink  path={rootPath + docsItem.value.entries[0].path} name = {docsItem.key} />
                <ul>
                    {docsItem.value.entries.map(function (item, index) {
                        if (!item.path) {
                            console.log('key:' + docsItem.key + 'index ' + index + (item.path));
                        }
                        return (
                            <li key={index}>
                                <MyLink path={rootPath + item.path} name = {item.name} />
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
}
@connect(state => ({ searchState: state.searchDocs }))
class Left extends React.Component<ISearchProps, void> {
    public shouldComponentUpdate(nextProps: ISearchProps, nextState: void, nextContext: any): boolean {
        return this.props.searchState.input !== nextProps.searchState.input;
    }
    private renderItem(index, key) {
        let searchResultItem: ISearchResultItem = this.props.searchState.message[index];
        if (searchResultItem.path) {
            return (<li key={key}> <Link  to={{ pathname: 'page', query: { url: searchResultItem.path + '.html' } }} > { searchResultItem.name}</Link ></li>);
        } else {
            return (<li key={key}> <Link  to={{ pathname: 'page', query: { url: searchResultItem.path + '.html' } }} > { searchResultItem.name}</Link ></li>);
        }
        // return <div key={key}>{'index ' + index + 'key' + key}</div>;
    }
    public render() {
        let {searchState} = this.props;
        let searchResult = searchState.message;
        if (searchState.error) {
            return (<div> {searchState.error} </div>);
        }
        if (!searchResult) {
            return (<div> 空 </div>);
        }
        if (searchState.input.length !== 0 && searchResult.length === 0) {
            return (<div> 未找到搜索结果 </div>);
        }
        return (
            <ul style={{ overflowX: 'scroll', overflowY: 'hidden' }}>
                <ReactList
                    itemRenderer={this.renderItem.bind(this) }
                    length={50}
                    type ="uniform"
                    />
            </ul>);
    }
}

// @connect(state => ({ searchState: state.searchDocs }))
// class Left extends React.Component<ISearchProps, void> {
//     public shouldComponentUpdate(nextProps: ISearchProps, nextState: void, nextContext: any): boolean {
//         // if(this.)
//         return this.props.searchState.input !== nextProps.searchState.input;
//     }
//     // public linkClickHandle(routerPath: string, jumpUrl: string) {
//     //     console.trace();
//     //     this.props.startRequestPage(jumpUrl);
//     //     history.push({ pathname: routerPath, query: { url: jumpUrl } });
//     // }
//     public render() {
//         let {searchState} = this.props;
//         let searchResult = searchState.message ? searchState.message : docsArrays;
//         if (searchState.error) {
//             return (<div> {searchState.error} </div>);
//         }
//         if (searchState.input.length !== 0 && searchResult.length === 0) {
//             return (<div> 未找到搜索结果 </div>);
//         }
//         return (
//             <ul >
//                 {searchResult.map(function (item, index) {
//                     return (<Menu key={item.key} data={item} > </Menu>);
//                 }) }
//             </ul>
//         );
//     }
// }

export { Left }
