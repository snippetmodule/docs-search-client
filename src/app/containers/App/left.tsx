
import * as React from 'react';
import { DocsModel } from '../../core/model';
import { Link } from 'react-router';
import { ISearchState } from '../../redux/reducers/searchdocs';
import { search } from '../../core/docs';

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
    private defaultState: ISearchState = null;
    constructor(props, state) {
        super(props, state);
        search('')
            .then(
            res => { this.defaultState = { isSearch: false, message: res }; this.forceUpdate(); })
            .catch(error => console.log(' App init defaultState error' + error));
    }
    public render() {
        if (!this.props.searchState || !this.props.searchState.message || this.props.searchState.message.length === 0) {
            return (<div> １１１１ </div>);
        } else if (this.props.searchState.error) {
            return (<div> {this.props.searchState.error} </div>);
        } else {
            let searchResult = this.props.searchState.message
                ? this.props.searchState.message
                : (this.defaultState ? this.defaultState.message : []);
            return (
                <ul >
                    {searchResult.map(function (item, index) {
                        return (<Menu key={item.key} data={item} > </Menu>);
                    }) }
                </ul>
            );
        }
    }
}

export {Left }
