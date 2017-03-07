import * as React from 'react';
import { IRenderItemProp } from './DefaultList';

const classNames = require('classnames');
class TopEnableDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        const {_isSelected, stateItem} = this.props;
        const openClass = stateItem.isExpended ? 'open' : '';
        const selectClass = _isSelected ? ['focus', 'active'] : '';
        const splits = stateItem.data.docInfo.slug.split('~');
        const iconClass = '_icon-' + splits[0];
        return (
            <a className={classNames('_list-item', iconClass, '_list-dir', openClass, selectClass)}
                onClick={this.props.onClickItem}
                >
                <span className="_list-arrow"></span>
                <span className="_list-enable"
                    style={{ color: '#fff !important', display: this.props.stateItem.isExpended && _isSelected ? 'block' : 'none' }}
                    onClick={this.props.disableDoc}>Disable</span>
                <span className="_list-count"
                    style={{ display: this.props.stateItem.isExpended && _isSelected ? 'none' : 'block' }}
                    >{stateItem.data.docInfo.release}</span>
                {stateItem.data.name}
            </a>
        );
    }
}
class ExpandDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        const {_isSelected, stateItem} = this.props;
        const openClass = stateItem.isExpended ? 'open' : '';
        const selectClass = _isSelected ? ['focus', 'active'] : '';
        return (
            <div className="_list-sub">
                <a className={classNames('_list-item', '_list-dir', openClass, selectClass)}
                    onClick={this.props.onClickItem}>
                    <span className="_list-arrow"></span>
                    <span className="_list-count">{stateItem.child.length === 0 ? ' ' : stateItem.child.length}</span>
                    {stateItem.data.name}
                </a>
            </div>
        );
    }
}

export class EnableDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        if (this.props.stateItem.child.length === 0) { // 叶子节点
            if (this.props.stateItem.data.docInfo.storeValue) {
                const selectClass = this.props._isSelected ? ['focus', 'active'] : '';
                return (
                    <div className="_list-sub">
                        <a className={classNames('_list-item', '_list-hover', selectClass)}
                            onClick={this.props.onClickItem}
                            >
                            {this.props.stateItem.data.name}
                        </a>
                    </div>
                );
            }
        } else if (this.props.stateItem.deep === 0) {
            return (
                <TopEnableDocItem  {...this.props} />
            );
        }
        return (
            <ExpandDocItem {...this.props} />
        );
    }
}