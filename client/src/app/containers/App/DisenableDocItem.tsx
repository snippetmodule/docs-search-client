import * as React from 'react';
import { IRenderItemProp } from './DefaultList';
const classNames = require('classnames');

class DisableDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        const { _isSelected, stateItem } = this.props;
        const selectClass = _isSelected ? ['focus', 'active'] : '';
        const splits = stateItem.data.docInfo.slug.split('~');
        const iconClass = '_icon-' + splits[0];
        return (
            <a className={classNames('_list-item', iconClass, '_list-disabled', selectClass)}
                onClick={this.props.onClickItem}>
                <span className="_list-enable" onClick={this.props.enableDoc}>Enable</span>
                <span className="_list-count">{stateItem.data.docInfo.release}</span>
                {stateItem.data.name}
            </a>
        );
    }
}
class TopCanExpandDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        const { _isSelected, stateItem } = this.props;
        const openClass = stateItem.isExpended ? 'open' : '';
        const selectClass = _isSelected ? ['focus', 'active'] : '';
        const splits = stateItem.child[0].data.docInfo.slug.split('~');
        const iconClass = '_icon-' + splits[0];
        return (
            <a className={classNames('_list-item', '_list-dir', iconClass, '_list-disabled', openClass, selectClass)}
                onClick={this.props.onClickItem}>
                <span className="_list-arrow"></span>
                {stateItem.data.name}
            </a>
        );
    }
}

class TopCantExpandDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        const { _isSelected, stateItem } = this.props;
        const selectClass = _isSelected ? ['focus', 'active'] : '';
        const splits = stateItem.data.docInfo.slug.split('~');
        const iconClass = '_icon-' + splits[0];
        return (
            <a className={classNames('_list-item', iconClass, '_list-disabled', selectClass)}
                onClick={this.props.onClickItem}
            >
                <span className="_list-enable" onClick={this.props.enableDoc}>Enable</span>
                <span className="_list-count">{stateItem.data.docInfo.release}</span>
                {stateItem.data.name}
            </a>
        );
    }
}
class DisenableDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        const { stateItem, _isSelected, onClickItem } = this.props;
        const selectClass = _isSelected ? ['focus', 'active'] : '';
        if (stateItem.data.name === 'Disable') {
            const openClass = stateItem.isExpended ? 'open' : '';
            let count = 0;
            for (const child of stateItem.child) {
                if (child.child.length === 0) {
                    count++;
                } else {
                    count += child.child.length;
                }
            }
            return (
                <a className={classNames('_list-item', '_list-dir', '_list-item-no-before', openClass, selectClass)}
                    onClick={onClickItem}>
                    <span className="_list-arrow"></span>
                    <span className="_list-count">{count || ''}</span>
                    {stateItem.data.name}
                </a>
            );
        } else if (stateItem.deep === 1) {
            if (stateItem.child.length === 0) {
                return (
                    <TopCantExpandDocItem {...this.props} />
                );
            }
            return (
                <TopCanExpandDocItem {...this.props} />
            );
        } else {
            return (
                <DisableDocItem  {...this.props} />
            );
        }
    }
}
export { DisenableDocItem }
