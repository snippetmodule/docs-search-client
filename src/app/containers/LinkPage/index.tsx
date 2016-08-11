import * as React from 'react';
import {ILinkPageState} from '../../redux/reducers/linkpage';

const { connect } = require('react-redux');

interface IProps {
    init?: ILinkPageState;
}

@connect(
    state => ({ init: state.initLinkPage })
)
class LinkPage extends React.Component<IProps, void> {
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

export {LinkPage }
