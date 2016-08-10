
import * as React from 'react';
import { DocsModel } from '../../core/model';
import { Link } from 'react-router';

interface ISearchProps {
    error?: string;
    searchResult: DocsModel[];
}
interface IMenuProps {
    data: DocsModel;
}
class Menu extends React.Component<IMenuProps, any> {
    public render() {
        // console.log('Menu key' + this.props.data.key);
        return (
            <li key = {this.props.data.key}>
                <Link to={this.props.data.value.entries[0].path}> {this.props.data.key}</Link>
                <ul>
                    {this.props.data.value.entries.map(function (item, index) {
                        return (
                            <li>
                                <Link key={index} to={item.path}> {item.name}</Link>
                            </li>
                        );
                    }) }
                </ul>
            </li >
        );
    }
}

class Left extends React.Component<ISearchProps, any> {
    public render() {
        if (this.props.error) {
            return (<div> {this.props.error} </div>);
        } else if (this.props.searchResult.length === 0) {
            return (<div> １１１１ </div>);
        } else {
            return (
                <ul >
                    {this.props.searchResult.map(function (item, index) {
                        return (<Menu  key = {index} data={item} > </Menu>);
                    }) }
                </ul>
            );
        }
    }
}

export {Left }
