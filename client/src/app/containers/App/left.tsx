
import * as React from 'react';
import {ISearchItem} from '../../core/model';
import {ISearchState} from '../../redux/reducers/searchdocs';
import ReactList from '../../utils/react-lists';
import {DefaultList} from './DefaultList';
import {history} from '../../routes';
import {onDocsPageLoactionChangeCallback} from '../DocPage/';
const { connect } = require('react-redux');

let classNames = require('classnames');
let _getSearchTag: () => { name: string, slug: string };

export function getSearchTag(): { name: string, slug: string } {
    if (_getSearchTag) {
        return _getSearchTag();
    }
    return null;
};
interface ISearchProps {
    searchState?: ISearchState;
}
@connect(state => ({ searchState: state.searchDocsReducer }))
class Left extends React.Component<ISearchProps, void> {
    private mListRef: any;
    private selectedIndex = -1;

    private mListItemRef: {
        [key: string]: HTMLElement;
    } = {};
    private onClickItem(index: number, searchResultItem: ISearchItem) {
        this.selectedIndex = index;
        this.forceUpdate();
        history.push({
            pathname: searchResultItem.pathname,
        });
    }
    public componentWillReceiveProps(nextProps: ISearchProps, nextContext: any) {
        this.selectedIndex = -1;
        this.mListRef = null;
    }
    private renderDisableItem(searchResultItem: ISearchItem, index: number, key: string) {
        let iconClass = '_icon-' + searchResultItem.slug.split('~')[0];
        let ltemClass = (index === this.selectedIndex)
            ? classNames('_list-item', '_list-hove', '_list-result', iconClass, 'focus', 'active')
            : classNames('_list-item', '_list-hove', '_list-result', iconClass, index === 0 && this.selectedIndex === -1 ? 'focus' : '');
        return (
            <a key={key} href="" className={ltemClass} ref={ref => this.mListItemRef[key] = ref}
                onClick = { event => { event.preventDefault(); this.onClickItem(index, searchResultItem); } }
                onMouseOver={event => { this.mListItemRef[key].style.textDecoration = 'underline'; } }
                onMouseOut={event => { this.mListItemRef[key].style.textDecoration = 'none'; } }
                >
                <span className="_list-enable" data-enable={searchResultItem.name}>Enable</span>
                <span className="_list-text">{searchResultItem.name }</span>
            </a >
        );
    }
    private renderItem(index, key) {
        let searchResultItem: ISearchItem = this.props.searchState.message[index];
        if (!searchResultItem) {
            return (<a key={key} />); // 页面可能 频繁刷新中
        }
        if (!searchResultItem.doc.storeValue) {
            return this.renderDisableItem(searchResultItem, index, key);
        }
        let iconindex = searchResultItem.doc.slug.indexOf('~');
        let iconClass = '_icon-' + (iconindex === -1 ? searchResultItem.doc.slug : searchResultItem.doc.slug.substr(0, iconindex));
        let ltemClass = (index === this.selectedIndex)
            ? classNames('_list-item', '_list-hove', '_list-result', iconClass, 'focus', 'active')
            : classNames('_list-item', '_list-hove', '_list-result', iconClass, index === 0 && this.selectedIndex === -1 ? 'focus' : '');
        return (
            <a key={key} href="" className={ltemClass} ref={ref => this.mListItemRef[key] = ref}
                onClick = { event => { event.preventDefault(); this.onClickItem(index, searchResultItem); } }
                onMouseOver={event => { this.mListItemRef[key].style.textDecoration = 'underline'; } }
                onMouseOut={event => { this.mListItemRef[key].style.textDecoration = 'none'; } }
                >
                <span className="_list-reveal" data-reset-list="" title="Reveal in list"></span>
                {searchResultItem.name }
            </a >
        );
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
        if (searchState.input.length !== 0 && (!searchResult || searchResult.length === 0)) {
            return (
                <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', height: '100%', boxShadow: 'inset -1px 0 #e3e3e3' }}>
                    <div style={{ textAlign: 'center' }}>没有搜到.</div>
                </div>
            );
        }
        return (
            <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', height: '100%', boxShadow: 'inset -1px 0 #e3e3e3' }}>
                <ReactList ref={ref => this.mListRef = ref}
                    itemRenderer={this.renderItem.bind(this) }
                    length={50}
                    />
            </div>);
    }
    public componentWillMount() {
        onDocsPageLoactionChangeCallback('Left', locationUrl => {
            if (!this.props.searchState.input) {
                return;
            }
            let {searchState} = this.props;
            let searchResult = searchState.message;
            if (searchState.error) {
                return;
            }
            if (!searchResult) {
                return;
            }
            for (let i = 0; i < this.props.searchState.message.length; i++) {
                let searchResultItem = this.props.searchState.message[i];
                if (searchResultItem.pathname === locationUrl) {
                    if (this.selectedIndex !== i) { this.selectedIndex = i; this.forceUpdate(); }
                }
            }
        });
    }
    public componentWillUnmount() {
        onDocsPageLoactionChangeCallback('Left', null);
        _getSearchTag = null;
    }
    public componentDidUpdate(prevProps: any, prevState: void, prevContext: any) {
        if (!this.mListRef) { return; }
        let {from, size} = this.mListRef.state;
        if (this.selectedIndex > from + size || this.selectedIndex < from) {
            this.mListRef.scrollTo(this.selectedIndex);
        }
        _getSearchTag = () => {
            if (!this.props.searchState.message) {
                return null;
            }
            for (let index = this.selectedIndex; index < this.selectedIndex + 5 && index < this.props.searchState.message.length; index++) {
                let searchItem = this.props.searchState.message[index];
                if (searchItem && searchItem.doc.storeValue && searchItem.name.toLowerCase().startsWith(this.props.searchState.input.toLowerCase())) {
                    return { name: searchItem.doc.name, slug: searchItem.doc.slug };
                }
            }
            return null;
        };
    }
}

export { Left }
