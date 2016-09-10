import * as React from 'react';
import {IRenderItemProp} from './list';

let classNames = require('classnames');
class TopEnableDocItem extends React.Component<IRenderItemProp, any> {
    private spanDisenableRef: (HTMLSpanElement);
    public render() {
        let {_isSelected, stateItem} = this.props;
        let openClass = stateItem.isExpended ? 'open' : '';
        let selectClass = _isSelected ? ['focus', 'active'] : '';
        let splits = stateItem.data.docInfo.slug.split('~');
        let iconClass = '_icon-' + splits[0];
        return (
            <a  className={classNames('_list-item', iconClass, '_list-dir', openClass, selectClass) }
                onClick={this.props.onClickItem }
                onMouseOver={event => {
                    if (this.props.stateItem.isExpended && _isSelected) {
                        this.spanDisenableRef.innerText = 'disable';
                    }
                } }
                onMouseOut={event => { this.spanDisenableRef.innerText = ''; } }
                >
                <span className="_list-arrow"></span>
                <span className="_list-enable" style={{ color: '#fff !important', display: 'block' }}ref={ref => this.spanDisenableRef = ref}
                    onClick={this.props.disableDoc }></span>
                {stateItem.data.name}
            </a>
        );
    }
}
class ExpandDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        let {_isSelected, stateItem} = this.props;
        let openClass = stateItem.isExpended ? 'open' : '';
        let selectClass = _isSelected ? ['focus', 'active'] : '';
        return (
            <div className={classNames('_list', '_list-sub') } >
                <a  className={classNames('_list-item', '_list-dir', openClass, selectClass) }
                    onClick={this.props.onClickItem}>
                    <span className="_list-arrow"></span>
                    <span className="_list-count">{ stateItem.child.length === 0 ? ' ' : stateItem.child.length}</span>
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
                let selectClass = this.props._isSelected ? ['focus', 'active'] : '';
                return (
                    <div className={classNames('_list', '_list-sub') } >
                        <a className={classNames('_list-item', '_list-hover', selectClass) }
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