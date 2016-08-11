import * as React from 'react';
import {ILinkPageState} from '../../redux/reducers/linkpage';
import {startRequestPage} from '../../redux/reducers/linkpage';
const { connect } = require('react-redux');

interface ILinkContentPage {
    init?: ILinkPageState;
}

@connect(state => ({ init: state.initLinkPage }))
class LinkContentPage extends React.Component<ILinkContentPage, void> {
    public render() {
        let { init} = this.props;
        if (!init.isInited && !init.content) {
            return (<div>加载中</div>);
        }
        return (
            <div >
                {init.content}
            </div>
        );
    }
}
interface IProps {
    location?: any;
    startRequestPage?: (url: string) => void;
}
@connect(null,
    dispatch => ({
        startRequestPage: (url: string) => (dispatch(startRequestPage(dispatch, url))),
    }))
class LinkPage extends React.Component<IProps, void> {
    constructor(props) {
        super(props);
        console.log('loading url:' + this.props.location.query.url);
        this.props.startRequestPage(this.props.location.query.url);
    }
    public render() {
        return (
            <LinkContentPage />
        );
    }
}

export {LinkPage }
