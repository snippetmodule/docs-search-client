
import * as React from 'react';
import { DocsModel } from '../../core/model';
import { Link } from 'react-router';
import { ILinkPageState, startInit} from '../../redux/reducers/LinkPage';

import { docsArrays } from '../../core/docs';

const { connect } = require('react-redux');
const { asyncConnect } = require('redux-connect');

interface IProps {
    url: string;
    init?: ILinkPageState;
    startInit?: (url: string) => void;
}

@connect(
    state => ({ init: state.initLinkPage }),
    dispatch => ({
        startInit: (url: string) => (dispatch(startInit(dispatch, url)))
    })
)
@connect(state => ({ searchState: state.searchDocs }))
class LinkPage extends React.Component<IProps, void> {
    public componentDidMount(){
        this.props.startInit(this.props.url);
    }
    public render() {
        let {url, init} = this.props;
        if (!init.isInited) {
            { this.props.startInit(this.props.url) }
            return (<div>加载中</div>);
        }
        return (
            <div >
                {init.content}
            </div>
        );
    }
}

export {LinkPage }
