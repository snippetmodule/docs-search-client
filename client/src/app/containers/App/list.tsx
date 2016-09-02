import * as React from 'react';
import { Link } from 'react-router';
import {history} from '../../routes';
import ReactList from '../../utils/react-lists';
import {IDocInfo} from '../../core/model';
import * as appConfig from '../../config';
import {ICanExpendedItem, ICanExpendedState, ExpandedDocList} from './ExpandedDocList';

function getItemCss(paddingLeft: number, isSelected: boolean) {
    return {
        paddingLeft: paddingLeft,
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
    _key: number;
    _index: number;
    _isSelected: boolean;
    stateItem: ICanExpendedItem;
    onClickItem: () => void;
    enableDoc: (docInfo: IDocInfo) => void;
    disableDoc: (docInfo: IDocInfo) => void;
}
class DisableDocItem extends React.Component<IRenderItemProp, any>{
    private spanEnableRef: (HTMLSpanElement);
    public render() {
        let {_key, _isSelected, stateItem} = this.props;
        return (
            <Link key={_key} to="" style={getItemCss(stateItem.deep * 8, _isSelected) }
                onClick={event => { event.preventDefault(); this.props.onClickItem(); } }
                onMouseOver={event => { this.spanEnableRef.innerText = 'enable'; } }
                onMouseOut={event => { this.spanEnableRef.innerText = stateItem.docInfo.release || ''; } }
                >
                <span ref={ref => this.spanEnableRef = ref} style={{ float: 'right', marginLeft: '0' }}
                    onClick={event => this.props.enableDoc(this.props.stateItem.docInfo) }>
                    {stateItem.docInfo.release}
                </span>
                <span style={{ display: 'block' }}>{stateItem.name}</span>
            </Link>
        );
    }
}
class TopEnableDocItem extends React.Component<IRenderItemProp, any>{
    private spanDisenableRef: (HTMLSpanElement);
    public render() {
        let {_key, _isSelected, stateItem} = this.props;
        // console.log('TopEnableDocItem ' + this.props.stateItem.name + ' key:' + _key);
        return (
            <div key={_key} style={getItemCss(stateItem.deep * 8, _isSelected) }
                onClick={event => { event.preventDefault(); this.props.onClickItem(); } }
                onMouseOver={event => { if (this.props.stateItem.isExpended) { this.spanDisenableRef.innerText = 'disable'; } } }
                onMouseOut={event => { this.spanDisenableRef.innerText = ''; } }
                >
                <span ref={ref => this.spanDisenableRef = ref} style={{ float: 'right', marginLeft: '0' }}
                    onClick={event => this.props.disableDoc(this.props.stateItem.docInfo) }>
                </span>
                <span style={{ display: 'block' }}>{stateItem.name}</span>
            </div>
        );
    }
}
export class DefaultList extends React.Component<any, ICanExpendedState> {
    public spanEnableRefs: {
        [key: string]: (HTMLSpanElement);
    } = {};
    constructor() {
        super();
        this.state = new ExpandedDocList();
    }
    private onClickItem(index: number, stateItem: ICanExpendedItem, isCanExpended: boolean) {
        if (isCanExpended) {
            stateItem.isExpended = !stateItem.isExpended;
        }
        this.state.selectedIndex = index;
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
        appConfig.default.enableDoc(docInfo).then(() => {
            this.setState(new ExpandedDocList(true));
        }).catch(err => console.log('enableDoc:' + docInfo.slug + err.stack));
    }
    private disableDoc(docInfo: IDocInfo) {
        appConfig.default.disableDoc(docInfo).then(() => {
            this.setState(new ExpandedDocList(true));
        }).catch(err => console.log('enableDoc:' + docInfo.slug + err.stack));
    }
    private renderEnableItem(index, key) {
        let stateItem = this.state.listItems[index];
        return (
            <Link key={key} to="" style={getItemCss(stateItem.deep * 8, index === this.state.selectedIndex) }
                onClick={event => { event.preventDefault(); this.onClickItem(index, stateItem, false); } }>
                {stateItem.name}
            </Link>
        );
    }

    private renderCanExpendedItem(index, key) {
        let stateItem = this.state.listItems[index];
        return (
            <div key={key} to="" style={getItemCss(stateItem.deep * 8, index === this.state.selectedIndex) }
                onClick={event => { event.preventDefault(); this.onClickItem(index, stateItem, true); } }>
                <span>
                    { stateItem.child.length === 0 ? ' ' : (stateItem.isExpended ? '-' : '+') }
                </span>
                <span>{stateItem.name}</span>
                <span>{stateItem.child.length === 0 ? ' ' : '(' + stateItem.child.length + ')'}</span>
            </div>
        );
    }
    private renderItem(index, key) {
        // console.log('DefaultList .....renderItem' + ' time:' + new Date().getTime() + ' index:' + index + 'key' + key);
        let stateItem = this.state.listItems[index];
        if (stateItem.child.length === 0) {
            if (stateItem.docInfo.storeValue) {
                return this.renderEnableItem(index, key);
            }
            return (<DisableDocItem _key={key} _index= {index} stateItem= {stateItem} _isSelected={index === this.state.selectedIndex}
                onClickItem={() => { event.preventDefault(); this.onClickItem(index, stateItem, false); } }
                enableDoc={this.enableDoc} disableDoc={this.disableDoc} />);
        } else if (stateItem.deep === 0 && stateItem.name !== 'disable') {
            console.log('DefaultList11111 .....renderItem' + ' time:' + new Date().getTime() + ' index:' + index + 'key' + key);
            return (<TopEnableDocItem _key={key} _index= {index} stateItem= {stateItem} _isSelected={index === this.state.selectedIndex}
                onClickItem={() => { event.preventDefault(); this.onClickItem(index, stateItem, true); } }
                enableDoc={this.enableDoc} disableDoc={this.disableDoc}  />);
        }
        return this.renderCanExpendedItem(index, key);
    }
    public render() {
        // console.log('DefaultList .....render ' + ' time:' + new Date().getTime());
        return (
            <div style={{ paddingLeft: '2rem', width: '18rem', paddingBottom: '3.5rem' }}>
                <ReactList
                    itemRenderer={this.renderItem.bind(this) }
                    length={this.state.listItems.length }
                    type ="simple"
                    />
            </div>
        );
    }
}
