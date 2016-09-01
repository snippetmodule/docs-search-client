
import * as React from 'react';
import { Link } from 'react-router';
import {ISearchResultItem} from '../../core/model';
import {ISearchState} from '../../redux/reducers/searchdocs';
// import * as Immutable from 'immutable';
import {history} from '../../routes';
// import {isMounted} from '../../utils/react-utils';
// import {docsArrays} from '../../core/docs';
import ReactList from '../../utils/react-lists';
import {ICanExpendedItem, ICanExpendedState, ExpandedDocList} from './ExpandedDocList';
const { connect } = require('react-redux');

interface ISearchProps {
    searchState?: ISearchState;
}

class DefaultList extends React.Component<any, ICanExpendedState> {
    constructor() {
        super();
        this.state = new ExpandedDocList();
    }
    private onClickItem(stateItem: ICanExpendedItem) {
        stateItem.isExpended = !stateItem.isExpended;
        this.setState(new ExpandedDocList());
        if (stateItem.link) {
            history.push({
                pathname: 'page',
                query: { url: stateItem.link },
            });
        } else {
            history.push({
                pathname: 'page',
                state: { data: stateItem.child },
            });
        }

    }
    private renderItem(index, key) {
        let stateItem = this.state.listItems[index];
        if (stateItem.child.length === 0) {
            return (
                <li key={key} style={{ paddingLeft: stateItem.deep * 8 }}>
                    <span style={{ paddingLeft: stateItem.deep * 8, display: 'inline' }}>
                        { stateItem.child.length === 0 ? ' ' : (stateItem.isExpended ? '-' : '+') }
                    </span>
                    <Link to="" onClick={event => { event.preventDefault(); this.onClickItem(stateItem); } } >{stateItem.name}</Link>
                </li>
            );
        }
        return (
            <li key={key} onClick={event => { event.preventDefault(); this.onClickItem(stateItem); } }>
                <span style={{ paddingLeft: stateItem.deep * 8, display: 'inline' }}>
                    { stateItem.child.length === 0 ? ' ' : (stateItem.isExpended ? '-' : '+') }
                </span>
                <span>{stateItem.name}</span>
                <span>{stateItem.child.length === 0 ? ' ' : '(' + stateItem.child.length + ')'}</span>
            </li>
        );
    }
    public render() {
        return (
            <ul style={{ overflowY: 'scroll', height: '100%', overflowX: 'hidden' }}>
                <ReactList
                    itemRenderer={this.renderItem.bind(this) }
                    length={this.state.listItems.length }
                    type ="uniform"
                    />
            </ul>
        );
    }
}

@connect(state => ({ searchState: state.searchDocs }))
class Left extends React.Component<ISearchProps, void> {
    // public shouldComponentUpdate(nextProps: ISearchProps, nextState: void, nextContext: any): boolean {
    //     return this.props.searchState.input !== nextProps.searchState.input;
    // }
    private renderItem(index, key) {
        let searchResultItem: ISearchResultItem = this.props.searchState.message[index];
        if (searchResultItem.path) {
            return (<li key={key}> <Link  to={{ pathname: 'page', query: { url: searchResultItem.doc.slug + '/' + searchResultItem.path + '.html' } }} > { searchResultItem.name}</Link ></li>);
        } else {
            return (<li key={key}> <Link  to={{ pathname: 'page', query: { url: searchResultItem.doc.slug + '/' + searchResultItem.path + '.html' } }} > { searchResultItem.name}</Link ></li>);
        }
        // return <div key={key}>{'index ' + index + 'key' + key}</div>;
    }
    public render() {
        if (!this.props.searchState.input) {
            return (<DefaultList />);
        }
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
            <ul style={{ overflowY: 'scroll', height: '100%', overflowX: 'hidden' }}>
                <ReactList
                    itemRenderer={this.renderItem.bind(this) }
                    length={50}
                    type ="uniform"
                    />
            </ul>);
    }
}

export { Left }
