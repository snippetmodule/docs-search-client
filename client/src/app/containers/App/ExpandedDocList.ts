
import {DocsModelEntriyType, DocsModelTypeType, IDocInfo} from '../../core/model';
import * as appConfig from '../../config';

export interface ICanExpendedItem {
    name: string;
    type: string;
    isExpended: boolean; // 是否已经展开
    child: ICanExpendedItem[];
    deep?: number; // 此节点在整个树中的的深度
    link?: string; // 点击链接地址
    linkParams?: any; // 点击链接参数
    docInfo: IDocInfo;
}

export interface ICanExpendedState {
    listItems: ICanExpendedItem[];
    selectedIndex: number;
}

let enableDocs: ICanExpendedItem[];
let disableDocs: ICanExpendedItem;
let _selectedIndex = 0;

export class ExpandedDocList implements ICanExpendedState {
    public listItems: ICanExpendedItem[];
    constructor(force: boolean = false) {
        if (force || !enableDocs) { this.init(); this.selectedIndex = 0; }
        this.listItems = this.generalList();
    }
    public set selectedIndex(index: number) {
        _selectedIndex = index;
    }
    public get selectedIndex() {
        return _selectedIndex;
    }
    private init() {
        enableDocs = [];
        disableDocs = {
            name: 'disable',
            type: 'disable',
            isExpended: false,
            deep: 0,
            child: [],
            docInfo: null,
        };
        for (let docItem of appConfig.default.docs.getDocsInfoArrays) {
            if (docItem.storeValue) {
                let types: ICanExpendedItem[] = docItem.storeValue.types.map((item: DocsModelTypeType) => {
                    let subChild: ICanExpendedItem[] = item.childs.map((entry: DocsModelEntriyType) => {
                        return { name: entry.name, type: entry.name, link: docItem.slug + '/' + entry.path + '.html', isExpended: false, child: [], docInfo: docItem };
                    });
                    return { name: item.name, type: item.name, isExpended: false, child: subChild, docInfo: docItem };
                });
                enableDocs.push({ name: docItem.name, type: docItem.type, link: docItem.slug + '/index.html', isExpended: false, child: types, docInfo: docItem });
            } else {
                let disableChilds = disableDocs.child;
                let isHas = false;
                for (let item of disableChilds) {
                    if (item.type === docItem.type) {
                        let _docInfo = item.docInfo;
                        if (_docInfo) {
                            item.child.push({ name: _docInfo.name + ' ' + (_docInfo.version || ''), type: _docInfo.type, isExpended: false, link: _docInfo.slug + '/index.html', deep: 1, child: [], docInfo: _docInfo });
                            item.docInfo = null;
                        }
                        item.child.push({ name: docItem.name + ' ' + (docItem.version || ''), type: docItem.type, isExpended: false, link: docItem.slug + '/index.html', deep: 1, child: [], docInfo: docItem });
                        isHas = true;
                        continue;
                    }
                }
                if (!isHas) {
                    disableDocs.child.push({ name: docItem.name, type: docItem.type, isExpended: false, link: docItem.slug + '/index.html', deep: 1, child: [], docInfo: docItem });
                }
            }
        }
    }
    // 标记节点在树中的深度
    private markNodeDeep(enableDocs: ICanExpendedItem[]): number {
        let firstList: ICanExpendedItem[] = [...enableDocs];
        let secondList: ICanExpendedItem[] = [];
        let deep = 0;
        do {
            if (firstList.length !== 0) {
                for (let item of firstList) {
                    item.deep = deep;
                    secondList.push(...item.child);
                }
                firstList.splice(0, firstList.length);
                deep++;
            }
            if (secondList.length !== 0) {
                for (let item of secondList) {
                    item.deep = deep;
                    firstList.push(...item.child);
                }
                secondList.splice(0, secondList.length);
                deep++;
            }
        } while (firstList.length !== 0 || secondList.length !== 0);
        return deep - 1;
    }

    private generalList(): ICanExpendedItem[] {
        let lists: ICanExpendedItem[] = [];
        let temp: ICanExpendedItem[] = [...enableDocs, disableDocs];
        this.markNodeDeep(enableDocs);
        this.markNodeDeep([disableDocs]);
        while (temp.length !== 0) {
            let item = temp.shift();
            lists.push(item);
            if (item.isExpended) {
                temp.unshift(...item.child);
            }
        }
        return lists;
    }
}