import * as React from 'react';
import { Link } from 'react-router';
import {history} from '../../routes';
import ReactList from '../../utils/react-lists';
import {IDocInfo} from '../../core/model';
import * as appConfig from '../../config';
import {ICanExpendedItem, ICanExpendedState, ExpandedDocList, setSelectionIndex} from './ExpandedDocList';

function getItemCss(deep: number, isSelected: boolean) {
    return {
        paddingLeft: 0.75 * (deep + 1) + 'rem',
        paddingRight: '0.75rem',
        background: isSelected ? '#398df0' : '#f9f9f9',
        boxShadow: 'inset -1px 0 #e3e3e3',
        width: '100%',
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        wordSrap: 'normal',
        overflowSrap: 'normal',
        textOverflow: 'ellipsis',
        textDecoration: 'none',
    };
}
interface IRenderItemProp {
    _isSelected: boolean;
    stateItem: ICanExpendedItem;
    onClickItem: (event) => void;
    enableDoc: (event) => void;
    disableDoc: (event) => void;
}

class DisableDocItem extends React.Component<IRenderItemProp, any> {
    private spanEnableRef: (HTMLSpanElement);
    public render() {
        let {_isSelected, stateItem} = this.props;
        return (
            <Link to="" style={getItemCss(stateItem.deep, _isSelected) }
                onClick={this.props.onClickItem }
                onMouseOver={event => { this.spanEnableRef.innerText = 'enable'; } }
                onMouseOut={event => { this.spanEnableRef.innerText = stateItem.docInfo.release || ''; } }
                >
                <span ref={ref => this.spanEnableRef = ref} style={{ float: 'right', marginLeft: '0' }}
                    onClick={this.props.enableDoc}>
                    {stateItem.docInfo.release}
                </span>
                <span style={{ display: 'block' }}>{stateItem.name}</span>
            </Link>
        );
    }
}

class TopEnableDocItem extends React.Component<IRenderItemProp, any> {
    private spanDisenableRef: (HTMLSpanElement);
    public render() {
        let {_isSelected, stateItem} = this.props;
        return (
            <div style={getItemCss(stateItem.deep, _isSelected) }
                onClick={this.props.onClickItem }
                onMouseOver={event => { if (this.props.stateItem.isExpended) { this.spanDisenableRef.innerText = 'disable'; } } }
                onMouseOut={event => { this.spanDisenableRef.innerText = ''; } }
                >
                <span ref={ref => this.spanDisenableRef = ref} style={{ float: 'right', marginLeft: '0' }}
                    onClick={this.props.disableDoc }>
                </span>
                <span>
                    { stateItem.child.length === 0 ? ' ' : (stateItem.isExpended ? '-' : '+') }
                </span>
                <span>{stateItem.docInfo.slug}</span>
            </div>
        );
    }
}

class ExpandDocItem extends React.Component<IRenderItemProp, any> {
    public render() {
        let {_isSelected, stateItem} = this.props;
        return (
            <div style={getItemCss(stateItem.deep, _isSelected) }
                onClick={this.props.onClickItem}>
                <span>
                    { stateItem.child.length === 0 ? ' ' : (stateItem.isExpended ? '-' : '+') }
                </span>
                <span>{stateItem.name}</span>
                <span>{stateItem.child.length === 0 ? ' ' : '(' + stateItem.child.length + ')'}</span>
            </div>
        );
    }
}
export class DefaultList extends React.Component<any, ICanExpendedState> {
    constructor() {
        super();
        this.state = new ExpandedDocList();
    }
    private onClickItem(index: number, stateItem: ICanExpendedItem, isCanExpended: boolean) {
        if (isCanExpended) {
            stateItem.isExpended = !stateItem.isExpended;
        }
        this.state.selectedIndex = index;
        setSelectionIndex(index);
        this.setState(new ExpandedDocList());
        if (stateItem.link) {
            history.replace({
                pathname: 'page',
                query: { url: stateItem.link },
            });
        } else {
            history.replace({
                pathname: 'page',
                state: { data: stateItem.child },
            });
        }

    }
    private enableDoc(docInfo: IDocInfo) {
        appConfig.default.docs.addDoc(docInfo).then((res) => {
            this.setState(new ExpandedDocList(true));
        }).catch(err => console.log('enableDoc:' + docInfo.slug + err.stack));
    }
    private disableDoc(docInfo: IDocInfo) {
        appConfig.default.docs.removeDoc(docInfo).then((res) => {
            this.setState(new ExpandedDocList(true));
        }).catch(err => console.log('enableDoc:' + docInfo.slug + err.stack));
    }
    private renderEnableItem(index, key) {
        let stateItem = this.state.listItems[index];
        return (
            <Link key={key} to="" style={getItemCss(stateItem.deep, index === this.state.selectedIndex) }
                onClick={event => { event.preventDefault(); this.onClickItem(index, stateItem, false); } }>
                {stateItem.name}
            </Link>
        );
    }
    private renderItem(index, key) {
        let stateItem = this.state.listItems[index];
        if (stateItem.child.length === 0) {
            if (stateItem.docInfo.storeValue) {
                return this.renderEnableItem(index, key);
            }
            return (
                <DisableDocItem key={key} stateItem= {stateItem} _isSelected={index === this.state.selectedIndex}
                    onClickItem={() => { event.preventDefault(); event.stopPropagation(); this.onClickItem(index, stateItem, false); } }
                    enableDoc={ (event) => { event.stopPropagation(); this.enableDoc(stateItem.docInfo); } }
                    disableDoc={(event) => { event.stopPropagation(); this.disableDoc(stateItem.docInfo); } }  />
            );
        } else if (stateItem.deep === 0 && stateItem.name !== 'disable') {
            // console.log('TopEnableDocItem ' + this.state.toString() + stateItem.name + ' index:' + index + ' selectedIndex:' + this.state.selectedIndex);
            return (
                <TopEnableDocItem key={key} stateItem= {stateItem} _isSelected={index === this.state.selectedIndex}
                    onClickItem={(event) => { event.preventDefault(); event.stopPropagation(); this.onClickItem(index, stateItem, true); } }
                    enableDoc={ (event) => { event.stopPropagation(); this.enableDoc(stateItem.docInfo); } }
                    disableDoc={(event) => { event.stopPropagation(); this.disableDoc(stateItem.docInfo); } } />
            );
        }
        return (
            <ExpandDocItem key={key} stateItem= {stateItem} _isSelected={index === this.state.selectedIndex}
                onClickItem={(event) => { event.preventDefault(); event.stopPropagation(); this.onClickItem(index, stateItem, true); } }
                enableDoc={ (event) => { event.stopPropagation(); this.enableDoc(stateItem.docInfo); } }
                disableDoc={(event) => { event.stopPropagation(); this.disableDoc(stateItem.docInfo); } } />
        );
    }
    public render() {
        return (
            <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                <ReactList
                    itemRenderer={this.renderItem.bind(this) }
                    length={this.state.listItems.length }
                    type ="uniform"
                    />
            </div>
        );
    }
}
