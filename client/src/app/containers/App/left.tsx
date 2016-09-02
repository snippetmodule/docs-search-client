
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
    public spanRefs: {
        [key: string]: (HTMLSpanElement);
    } = {};
    private mItemCss = {
        paddingLeft: 0,
        width: '100%',
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        wordSrap: 'normal',
        overflowSrap: 'normal',
        textOverflow: 'ellipsis',
        textDecoration: 'none',
    };
    constructor() {
        super();
        this.state = new ExpandedDocList();
    }
    private onClickItem(stateItem: ICanExpendedItem, isCanExpended: boolean) {
        if (isCanExpended) {
            stateItem.isExpended = !stateItem.isExpended;
            this.setState(new ExpandedDocList());
        }
        if (stateItem.link) {
            history.replace({
                pathname: 'page',
                query: { url: stateItem.link },
            });
        } else {
            history.replace({
                pathname: 'page',
                state: { data: stateItem.child },
            });
        }

    }
    private renderEnableItem(index, key) {
        let stateItem = this.state.listItems[index];
        this.mItemCss.paddingLeft = stateItem.deep * 8;
        return (
            <Link key={key} to="" style={this.mItemCss}
                onClick={event => { event.preventDefault(); this.onClickItem(stateItem, false); } }>
                {stateItem.name}
            </Link>
        );
    }
    private renderDisableItem(index, key) {
        let stateItem = this.state.listItems[index];
        let spanEableRef = 'spanEable_' + index + '_' + key;
        this.mItemCss.paddingLeft = stateItem.deep * 8;
        return (
            <Link key={key} to="" style={this.mItemCss}
                onClick={event => { event.preventDefault(); this.onClickItem(stateItem, false); } }
                onMouseOver={event => {
                    let span = this.spanRefs[spanEableRef];
                    if (!span) { return; }
                    span.innerText = 'enable';
                } }
                onMouseOut={event => {
                    let span = this.spanRefs[spanEableRef];
                    if (!span) { return; }
                    span.innerText = stateItem.docInfo.release || '';
                } }
                >
                <span ref={ref => this.spanRefs[spanEableRef] = ref} style={{ float: 'right', marginLeft: '0' }}>{stateItem.docInfo.release}</span>
                <span style={{ display: 'block' }}>{stateItem.name}</span>
            </Link>
        );
    }
    private renderCanExpendedItem(index, key) {
        let stateItem = this.state.listItems[index];
        this.mItemCss.paddingLeft = stateItem.deep * 8;
        return (
            <div key={key} to="" style={this.mItemCss}
                onClick={event => { event.preventDefault(); this.onClickItem(stateItem, true); } }>
                <span>
                    { stateItem.child.length === 0 ? ' ' : (stateItem.isExpended ? '-' : '+') }
                </span>
                <span>{stateItem.name}</span>
                <span>{stateItem.child.length === 0 ? ' ' : '(' + stateItem.child.length + ')'}</span>
            </div>
        );
    }
    private renderItem(index, key) {
        let stateItem = this.state.listItems[index];
        if (stateItem.child.length === 0) {
            if (stateItem.docInfo.storeValue) {
                return this.renderEnableItem(index, key);
            }
            return this.renderDisableItem(index, key);
        }
        return this.renderCanExpendedItem(index, key);
    }
    public render() {
        return (
            <div style={{ overflowY: 'scroll', height: '100%', overflowX: 'hidden' ,paddingLeft:'2rem'}}>
                <ReactList
                    itemRenderer={this.renderItem.bind(this) }
                    length={this.state.listItems.length }
                    type ="uniform"
                    />
            </div>
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
