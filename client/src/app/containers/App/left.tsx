
import * as React from 'react';
import { ISearchItem } from '../../core/model';
// import { ISearchState } from '../../redux/reducers/searchdocs';
import ReactList from './ReactList';
import { DefaultList } from './DefaultList';
import { history } from '../../routes';
import * as appConfig from '../../config';
import { onDocsPageLoactionChangeCallback } from '../DocPage';

let classNames = require('classnames');

interface ISearchState {
    input: string;
    isSearch: boolean;
    error?: boolean;
    message?: Array<ISearchItem>;
}
class Left extends React.Component<void, ISearchState> {
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
    public componentWillReceiveProps(nextProps: ISearchState, nextContext: any) {
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
                onClick={event => { event.preventDefault(); this.onClickItem(index, searchResultItem); } }
                onMouseOver={event => { this.mListItemRef[key].style.textDecoration = 'underline'; } }
                onMouseOut={event => { this.mListItemRef[key].style.textDecoration = 'none'; } }
                >
                <span className="_list-enable" onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    appConfig.default.selectedPath = searchResultItem.pathname;
                    appConfig.default.docs.addDoc(searchResultItem.doc).then((res) => {
                        this.state.input = '';
                        this.forceUpdate();
                    }).catch(err => console.log('enableDoc err:' + searchResultItem.doc.slug + err.stack));
                } } data-enable={searchResultItem.name}>Enable</span>
                <span className="_list-text">{searchResultItem.name}</span>
            </a >
        );
    }
    private renderItem(index, key) {
        let searchResultItem: ISearchItem = this.state.message[index];
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
                onClick={event => { event.preventDefault(); this.onClickItem(index, searchResultItem); } }
                onMouseOver={event => { this.mListItemRef[key].style.textDecoration = 'underline'; } }
                onMouseOut={event => { this.mListItemRef[key].style.textDecoration = 'none'; } }
                >
                <span className="_list-reveal" data-reset-list="" title="Reveal in list"
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        appConfig.default.selectedPath = searchResultItem.pathname;
                        this.state.input = '';
                        this.forceUpdate();
                    } }></span>
                {searchResultItem.name}
            </a >
        );
    }
    public render() {
        if (!this.state || !this.state.input) {
            return (<DefaultList />);
        }
        if (this.state.error) {
            return (<div> {this.state.error} </div>);
        }
        return (
            <ReactList ref={ref => this.mListRef = ref}
                itemRenderer={this.renderItem.bind(this)}
                length={this.state.message.length}
                itemHeight={30}
                />
        );
    }
    public componentWillMount() {
        onDocsPageLoactionChangeCallback('Left', locationUrl => {
            if (!this.state.input) {
                return;
            }
            let searchResult = this.state.message;
            if (this.state.error) {
                return;
            }
            if (!searchResult) {
                return;
            }
            for (let i = 0; i < this.state.message.length; i++) {
                let searchResultItem = this.state.message[i];
                if (searchResultItem.pathname === locationUrl) {
                    if (this.selectedIndex !== i) { this.selectedIndex = i; this.forceUpdate(); }
                }
            }
        });
    }
    public componentWillUnmount() {
        onDocsPageLoactionChangeCallback('Left', null);
    }
    public getSearchTag(): { name: string, slug: string } {
        if (!this.state.message) {
            return null;
        }
        for (let index = this.selectedIndex; index < this.selectedIndex + 5 && index < this.state.message.length; index++) {
            let searchItem = this.state.message[index];
            if (searchItem && searchItem.doc.storeValue && searchItem.name.toLowerCase().startsWith(this.state.input.toLowerCase())) {
                return { name: searchItem.doc.name, slug: searchItem.doc.slug };
            }
        }
        return null;
    }
    public keyEnterHandler() {
        if (!this.state.message) {
            return null;
        }
        if (this.selectedIndex === -1) {
            history.push({
                pathname: this.state.message[0].pathname,
            });
        }
    }
    public componentDidUpdate(prevProps: any, prevState: void, prevContext: any) {
        if (this.mListRef) {
            this.mListRef.scroolToPosition(this.selectedIndex);
        }
    }
}

export { Left }
