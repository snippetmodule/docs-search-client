import * as React from 'react';
import { ISearchItem, IDocInfo } from '../../core/model';
import { history } from '../../routes';
import ReactList from './ReactList';
import { onDocsPageLoactionChangeCallback } from '../DocPage';

let classNames = require('classnames');

interface ISearchResultListProps {
    enableDocs: (selectedPath: string, docInfo: IDocInfo) => any;
    setSelectDoc: (selectedPath: string) => any;
    searchResult: Array<ISearchItem>;
}
interface ISearchResultListState {
    selectedIndex: number;
}
let selectedIndex = -1;
export class SearchResultList extends React.Component<ISearchResultListProps, ISearchResultListState> {
    private mListRef: any;

    private mListItemRef: {
        [key: string]: HTMLElement;
    } = {};
    public state = { selectedIndex: -1 };

    public componentWillMount() {
        onDocsPageLoactionChangeCallback('SearchResultList', locationUrl => {
            for (let i = 0; i < this.props.searchResult.length; i++) {
                let searchResultItem = this.props.searchResult[i];
                if (searchResultItem.pathname === locationUrl) {
                    if (selectedIndex !== i) { selectedIndex = i; this.forceUpdate(); }
                }
            }
        });
    }
    public componentWillUnmount() {
        onDocsPageLoactionChangeCallback('SearchResultList', null);
    }

    public componentDidUpdate(prevProps: any, prevState: void, prevContext: any) {
        if (this.mListRef) {
            this.mListRef.scroolToPosition(selectedIndex);
        }
    }
    public getSearchTag(input: string): { name: string, slug: string } {
        for (let index = selectedIndex; index < selectedIndex + 5 && index < this.props.searchResult.length; index++) {
            let searchItem = this.props.searchResult[index];
            if (searchItem && searchItem.doc.storeValue && searchItem.name.toLowerCase().startsWith(input.toLowerCase())) {
                return { name: searchItem.doc.name, slug: searchItem.doc.slug };
            }
        }
        return null;
    }
    public keyEnterHandler() {
        if (selectedIndex === -1) {
            history.push({
                pathname: this.props.searchResult[0].pathname,
            });
        }
    }
    private onClickItem(index: number, searchResultItem: ISearchItem) {
        selectedIndex = index;
        this.forceUpdate();
        history.push({
            pathname: searchResultItem.pathname,
        });
    }
    public shouldComponentUpdate?(nextProps: ISearchResultListProps, nextState: void, nextContext: any): boolean {
        if (nextProps.searchResult !== this.props.searchResult) {
            selectedIndex = -1;
            this.mListRef = null;
            return true;
        }
        return false;
    }
    // public componentWillReceiveProps(nextProps: ISearchResultListProps, nextContext: any) {
    //     selectedIndex = -1;
    //     this.mListRef = null;
    // }
    private renderDisableItem(searchResultItem: ISearchItem, index: number, key: string) {
        let iconClass = '_icon-' + searchResultItem.slug.split('~')[0];
        let ltemClass = (index === selectedIndex)
            ? classNames('_list-item', '_list-hove', '_list-result', iconClass, 'focus', 'active')
            : classNames('_list-item', '_list-hove', '_list-result', iconClass, index === 0 && selectedIndex === -1 ? 'focus' : '');
        return (
            <a key={key} href="" className={ltemClass} ref={ref => this.mListItemRef[key] = ref}
                onClick={event => { event.preventDefault(); this.onClickItem(index, searchResultItem); } }
                onMouseOver={event => { this.mListItemRef[key].style.textDecoration = 'underline'; } }
                onMouseOut={event => { this.mListItemRef[key].style.textDecoration = 'none'; } }
                >
                <span className="_list-enable" onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.props.enableDocs(searchResultItem.pathname, searchResultItem.doc);
                } } data-enable={searchResultItem.name}>Enable</span>
                <span className="_list-text">{searchResultItem.name}</span>
            </a >
        );
    }
    private renderItem(index, key) {
        let searchResultItem: ISearchItem = this.props.searchResult[index];
        if (!searchResultItem) {
            return null; // 页面可能 频繁刷新中
        }
        if (!searchResultItem.doc.storeValue) {
            return this.renderDisableItem(searchResultItem, index, key);
        }
        let iconindex = searchResultItem.doc.slug.indexOf('~');
        let iconClass = '_icon-' + (iconindex === -1 ? searchResultItem.doc.slug : searchResultItem.doc.slug.substr(0, iconindex));
        let ltemClass = (index === selectedIndex)
            ? classNames('_list-item', '_list-hove', '_list-result', iconClass, 'focus', 'active')
            : classNames('_list-item', '_list-hove', '_list-result', iconClass, index === 0 && selectedIndex === -1 ? 'focus' : '');
        return (
            <a key={key} href="" className={ltemClass} ref={ref => this.mListItemRef[key] = ref}
                onClick={event => { event.preventDefault(); this.onClickItem(index, searchResultItem); } }
                onMouseOver={event => { this.mListItemRef[key].style.textDecoration = 'underline'; } }
                onMouseOut={event => { this.mListItemRef[key].style.textDecoration = 'none'; } }
                >
                <span className="_list-reveal" data-reset-list="" title="Reveal in list"
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.props.setSelectDoc(searchResultItem.pathname);
                    } }></span>
                {searchResultItem.name}
            </a >
        );
    }
    public render() {
        return (
            <ReactList ref={ref => this.mListRef = ref}
                itemRenderer={this.renderItem.bind(this)}
                length={this.props.searchResult.length}
                itemHeight={30}
                />
        );
    }
}