
import * as React from 'react';
import { Link } from 'react-router';
import {ISearchResultItem} from '../../core/model';
import {ISearchState} from '../../redux/reducers/searchdocs';
import ReactList from '../../utils/react-lists';
import {DefaultList} from './list';
const { connect } = require('react-redux');

interface ISearchProps {
    searchState?: ISearchState;
}

@connect(state => ({ searchState: state.searchDocs }))
class Left extends React.Component<ISearchProps, void> {
    // public shouldComponentUpdate(nextProps: ISearchProps, nextState: void, nextContext: any): boolean {
    //     return this.props.searchState.input !== nextProps.searchState.input;
    // }
    private renderItem(index, key) {
        let searchResultItem: ISearchResultItem = this.props.searchState.message[index];
        if (searchResultItem.path) {
            return (<li key={key}> <Link  to={{ pathname: '/docs/' + searchResultItem.doc.slug + '/' + searchResultItem.path }} > { searchResultItem.name}</Link ></li>);
        } else {
            return (<li key={key}> <Link  to={{ pathname: '/docs/' + searchResultItem.doc.slug + '/' + searchResultItem.slug + '/' }} > { searchResultItem.name}</Link ></li>);
        }
        // return <div key={key}>{'index ' + index + 'key' + key}</div>;
    }
    public render() {
        console.log('Left .....' + this.props.searchState.input + ' time:' + new Date().getTime());
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
