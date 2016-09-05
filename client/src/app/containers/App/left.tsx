
import * as React from 'react';
import { Link } from 'react-router';
import {ISearchResultItem} from '../../core/model';
import {ISearchState} from '../../redux/reducers/searchdocs';
import ReactList from '../../utils/react-lists';
import {DefaultList} from './list';
import {history} from '../../routes';
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
    private selectedIndex = 0;

    private onClickItem(index: number, searchResultItem: ISearchResultItem) {
        this.selectedIndex = index;
        this.forceUpdate();
        history.push({
            pathname: '/docs/' + searchResultItem.doc.slug + '/' + (searchResultItem.path ? searchResultItem.path : searchResultItem.slug + '/'),
        });
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
            <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', height: '100%', boxShadow: 'inset -1px 0 #e3e3e3' }}>>
                <ReactList
                    itemRenderer={this.renderItem.bind(this) }
                    length={50}
                    type ="uniform"
                    />
            </div>);
    }
}

export { Left }
