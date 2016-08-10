
import * as React from 'react';
import { DocsModel } from '../../core/model';
import { Link } from 'react-router';
import { ISearchState } from '../../redux/reducers/searchdocs';

import { docsArrays } from '../../core/docs';

const { connect } = require('react-redux');

interface ISearchProps {
    searchState?: ISearchState;
}

interface IMenuProps {
    data: DocsModel;
}

class Menu extends React.Component<IMenuProps, any> {
    public render() {
        return (
            <li>
                <Link to={this.props.data.value.entries[0].path}> {this.props.data.key}</Link>
                <ul>
                    {this.props.data.value.entries.map(function (item, index) {
                        return (
                            <li key={index}>
                                <Link to={item.path}> {item.name}</Link>
                            </li>
                        );
                    }) }
                </ul>
            </li >
        );
    }
}

@connect(state => ({ searchState: state.searchDocs }))
class Left extends React.Component<ISearchProps, void> {
    public render() {
        let {searchState} = this.props;
        let searchResult = searchState.message ? searchState.message : docsArrays;

        if (this.props.searchState.error) {
            return (<div> {this.props.searchState.error} </div>);
        }
        return (
            <ul >
                {searchResult.map(function (item, index) {
                    return (<Menu key={item.key} data={item} > </Menu>);
                }) }
            </ul>
        );
    }
}

export {Left }
