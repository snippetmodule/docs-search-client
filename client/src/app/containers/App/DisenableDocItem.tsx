import * as React from 'react';
import {IRenderItemProp} from './list';

let classNames = require('classnames/bind');
let listCss = require('./list-style.css');
let cx = classNames.bind(listCss);

class DisableDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        let {_isSelected, stateItem} = this.props;
        let selectClass = _isSelected ? ['focus', 'active'] : '';
        let index = stateItem.slug.indexOf('~');
        let iconClass = '_icon-' + (index === -1 ? stateItem.slug : stateItem.slug.substr(0, index));
        return (
            <a  className={cx('_list-item', iconClass, '_list-disabled', '_no_before', selectClass) }
                onClick={this.props.onClickItem}
                >
                <span className={cx('_list-enable') } onClick={this.props.enableDoc}>Enable</span>
                <span className={cx('_list-count') }>{stateItem.docInfo.release}</span>
                {stateItem.name}
            </a>
        );
    }
}
class TopCanExpandDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        let {_isSelected, stateItem} = this.props;
        let openClass = stateItem.isExpended ? 'open' : '';
        let selectClass = _isSelected ? ['focus', 'active'] : '';
        let index = stateItem.slug.indexOf('~');
        let iconClass = '_icon-' + (index === -1 ? stateItem.slug : stateItem.slug.substr(0, index));
        return (
            <a  className={cx('_list-item', '_list-dir', iconClass, '_list-disabled', openClass, selectClass) }
                onClick={this.props.onClickItem }
                >
                <span className={cx('_list-arrow') }></span>
                {stateItem.name}
            </a>
        );
    }
}

class TopCantExpandDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        let {_isSelected, stateItem} = this.props;
        let selectClass = _isSelected ? ['focus', 'active'] : '';
        let index = stateItem.docInfo.slug.indexOf('~');
        let iconClass = '_icon-' + (index === -1 ? stateItem.docInfo.slug : stateItem.docInfo.slug.substr(0, index));
        return (
            <a  className={cx('_list-item', iconClass, '_list-disabled', selectClass) }
                onClick={this.props.onClickItem }
                >
                <span className={cx('_list-enable') } onClick={this.props.enableDoc}>Enable</span>
                <span className={cx('_list-count') }>2.1.0</span>
                {stateItem.name}
            </a>
        );
    }
}
class DisenableDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        let {stateItem, _isSelected, onClickItem} = this.props;
        let selectClass = _isSelected ? ['focus', 'active'] : '';
        if (stateItem.name === 'Disable') {
            let openClass = stateItem.isExpended ? 'open' : '';
            let count = 0;
            for (let child of stateItem.child) {
                if (child.child.length === 0) {
                    count++;
                } else {
                    count += child.child.length;
                }
            }
            return (
                <a  className={cx('_list-item', '_list-dir', '_no_before', openClass, selectClass) }
                    onClick={onClickItem}
                    >
                    <span className={cx('_list-arrow') }></span>
                    <span className={cx('_list-count') }>{ count || ''}</span>
                    {stateItem.name}
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
export {DisenableDocItem}
