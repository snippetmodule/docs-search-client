import * as React from 'react';
import { Link } from 'react-router';
import {ILinkPageState} from '../../redux/reducers/linkpage';
import {startRequestPage} from '../../redux/reducers/linkpage';
const { connect } = require('react-redux');

interface IProps {
    location?: any;
    init?: ILinkPageState;
    startRequestPage?: (url: string) => void;
}
@connect(
    state => ({ init: state.initLinkPage }),
    dispatch => ({
        startRequestPage: (url: string) => (dispatch(startRequestPage(dispatch, url))),
    }))
class LinkPage extends React.Component<IProps, void> {
    constructor(props) {
        super(props);
        if (this.props.location.query.url) {
            console.log('loading url:' + this.props.location.query.url);
            this.props.startRequestPage(this.props.location.query.url);
        }
    }
    public componentWillReceiveProps(nextProps: IProps, nextContext: any) {
        if (nextProps.location.query.url !== this.props.location.query.url) {
            if (nextProps.location.query.url) {
                nextProps.startRequestPage(nextProps.location.query.url);
                nextProps.init.isInited = false;
                nextProps.init.content = undefined;
            }
        }
    }
    public render() {
        let { init} = this.props;
        if (this.props.location.state) {
            return (
                <div style={{ textAlign: 'left', padding: '1.25rem 1.5rem 0' }}>
                    <h1></h1>
                    <ul>
                        {this.props.location.state.data.map(item => {
                            return (
                                <li >
                                    <Link to={{ pathname: 'page', query: { url: item.link } }}>{item.name}</Link>
                                </li >
                            );
                        }) }
                    </ul>
                </div>
            );
        }
        if (!init.isInited && !init.content) {
            return (<div>加载中</div>);
        }
        return (
            <div style={{ textAlign: 'left', padding: '1.25rem 1.5rem 0' }} dangerouslySetInnerHTML={{ __html: init.content }}>
            </div>
        );
    }
}

export {LinkPage }
