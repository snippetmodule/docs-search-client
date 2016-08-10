
import * as React from 'react';
import { ISearchState, ISearchAction, getSearchResult } from '../../redux/reducers/searchdocs';
const { connect } = require('react-redux');

interface ISearchProps {
    searchState: ISearchState;
    getSearchResult: Redux.ActionCreator<ISearchAction>;
}

@connect(
    state => ({
        searchState: state.searchState,
    })
)


class Left extends React.Component<any, ISearchState> {
    public getInitialState() {
        return { isSearching: false };
    }
    public render() {
        return (
            <div >
                <div> {this.state.isSearch} </div>
            </div>
        );
    }
}

export {Left }
