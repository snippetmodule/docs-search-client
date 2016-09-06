
import * as React from 'react';
import {ISearchResultItem} from '../../core/model';
import {ISearchState} from '../../redux/reducers/searchdocs';
import ReactList from '../../utils/react-lists';
import {DefaultList} from './list';
import {history} from '../../routes';
import {onDocsPageLoactionChangeCallback} from '../DocPage/';

const { connect } = require('react-redux');

interface ISearchProps {
    searchState?: ISearchState;
}
function getItemCss(deep: number, isSelected: boolean) {
    return {
        paddingTop: '.25rem',
        paddingBottom: '.25rem',
        paddingLeft: 0.75 * (deep + 1) + 'rem',
        paddingRight: '0.75rem',
        background: isSelected ? '#398df0' : '#f9f9f9',
        boxShadow: 'inset -1px 0 #e3e3e3',
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
}

@connect(state => ({ searchState: state.searchDocsReducer }))
class Left extends React.Component<ISearchProps, void> {
    private mListRef: any;
    private selectedIndex = -1;

    private onClickItem(index: number, searchResultItem: ISearchResultItem) {
        this.selectedIndex = index;
        this.forceUpdate();
        history.push({
            pathname: '/docs/' + searchResultItem.doc.slug + '/' + (searchResultItem.path ? searchResultItem.path : searchResultItem.slug + '/'),
        });
    }
    public componentWillReceiveProps(nextProps: ISearchProps, nextContext: any) {
        this.selectedIndex = -1;
    }
    private renderItem(index, key) {
        let searchResultItem: ISearchResultItem = this.props.searchState.message[index];
        return (
            <div key={key} to="" style={getItemCss(0, index === this.selectedIndex) }
                onClick={event => { event.preventDefault(); this.onClickItem(index, searchResultItem); } }>
                {searchResultItem.name}
            </div>
        );
    }
    public render() {
        this.mListRef = null;
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
            <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', height: '100%', boxShadow: 'inset -1px 0 #e3e3e3' }}>
                <ReactList ref={ref => this.mListRef = ref}
                    itemRenderer={this.renderItem.bind(this) }
                    length={50}
                    type ="uniform"
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
                let pathClick = '/docs/' + searchResultItem.doc.slug + '/' + (searchResultItem.path ? searchResultItem.path : searchResultItem.slug + '/');
                if (pathClick === locationUrl) {
                    if (this.selectedIndex !== i) { this.selectedIndex = i; this.forceUpdate(); }
                }
            }
        });
    }
    public componentWillUnmount() {
        onDocsPageLoactionChangeCallback('Left', null);
    }
    public componentDidUpdate(prevProps: any, prevState: void, prevContext: any) {
        if (!this.mListRef) { return; }
        let {from, size} = this.mListRef.state;
        if (this.selectedIndex > from + size || this.selectedIndex < from) {
            this.mListRef.scrollTo(this.selectedIndex);
        }
    }
}

export { Left }
