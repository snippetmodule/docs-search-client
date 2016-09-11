import * as React from 'react';
import {history} from '../../routes';
import ReactList from '../../utils/react-lists';
import {IDocInfo} from '../../core/model';
import * as appConfig from '../../config';
import {ICanExpendedItem, ICanExpendedState, ExpandedDocList, setSelectionIndex} from './ExpandedDocList';
import {onDocsPageLoactionChangeCallback} from '../DocPage/';
import {EnableDocItem } from './EnableDocItem';
import {DisenableDocItem } from './DisenableDocItem';

export interface IRenderItemProp {
    _isSelected: boolean;
    stateItem: ICanExpendedItem;
    onClickItem: (event) => void;
    enableDoc: (event) => void;
    disableDoc: (event) => void;
}

export class DefaultList extends React.Component<any, ICanExpendedState> {
    private mListRef: any;
    constructor() {
        super();
        this.state = new ExpandedDocList();
    }
    private onClickItem(index: number, stateItem: ICanExpendedItem) {
        if (stateItem.child.length > 0) {
            stateItem.isExpended = !stateItem.isExpended;
        }
        this.state.selectedIndex = index;
        setSelectionIndex(index);
        this.setState(new ExpandedDocList());
        if (stateItem.data.name === 'disable') {
            return;
        }
        if (stateItem.data.pathname) {
            let state = {
                docSlug: stateItem.data.docInfo ? stateItem.data.docInfo.slug : null,
                typeSlug: stateItem.data.docType ? stateItem.data.docType.slug : null,
                entrySlug: stateItem.data.docEntry ? stateItem.data.docEntry.path : null,
            };
            history.push({ pathname: stateItem.data.pathname, state: state });
        }
    }
    private enableDoc(docInfo: IDocInfo) {
        appConfig.default.docs.addDoc(docInfo).then((res) => {
            this.setState(new ExpandedDocList(true));
        }).catch(err => console.log('enableDoc err:' + docInfo.slug + err.stack));
    }
    private disableDoc(docInfo: IDocInfo) {
        appConfig.default.docs.removeDoc(docInfo).then((res) => {
            this.setState(new ExpandedDocList(true));
        }).catch(err => console.log('disableDoc err:' + docInfo.slug + err.stack));
    }

    private renderItem(index, key) {
        let stateItem: ICanExpendedItem = this.state.listItems[index];
        let itemProps: IRenderItemProp = {
            stateItem: stateItem,
            _isSelected: index === this.state.selectedIndex,
            onClickItem: (event) => { event.preventDefault(); event.stopPropagation(); this.onClickItem(index, stateItem); },
            enableDoc: (event) => { event.preventDefault(); event.stopPropagation(); this.enableDoc(stateItem.data.docInfo); },
            disableDoc: (event) => { event.preventDefault(); event.stopPropagation(); this.disableDoc(stateItem.data.docInfo); },
        };
        if (!stateItem.data.docInfo || !stateItem.data.docInfo.storeValue) {
            return (<DisenableDocItem key={key} {...itemProps} />);
        } else {

            return (<EnableDocItem key={key} {...itemProps} />);
        }
    }
    public render() {
        return (
            <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', height: '100%', boxShadow: 'inset -1px 0 #e3e3e3' }}>
                <ReactList ref={ref => this.mListRef = ref}
                    itemRenderer={this.renderItem.bind(this) }
                    length={this.state.listItems.length }
                    />
            </div>
        );
    }
    public componentWillMount() {
        onDocsPageLoactionChangeCallback('DefaultList', locationUrl => {
            if (this.state.setSelectedIndexByUrlPath(locationUrl)) {
                this.setState(new ExpandedDocList());
            }
        });
    }
    public componentWillUnmount() {
        onDocsPageLoactionChangeCallback('DefaultList', null);
    }
    public componentDidUpdate(prevProps: any, prevState: void, prevContext: any) {
        let {from, size} = this.mListRef.state;
        if (this.state.selectedIndex > from + size || this.state.selectedIndex < from) {
            this.mListRef.scrollTo(this.state.selectedIndex);
        }
    }
}
