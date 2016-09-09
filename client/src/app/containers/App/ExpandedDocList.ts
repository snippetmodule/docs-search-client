
import {DocsModelEntriyType, DocsModelTypeType, IDocInfo} from '../../core/model';
import * as appConfig from '../../config';

export interface ICanExpendedItem {
    isExpended: boolean; // 是否已经展开
    child: ICanExpendedItem[];
    deep: number; // 此节点在整个树中的的深度
    parent: ICanExpendedItem; // 父节点
    data: { docInfo: IDocInfo, docType: DocsModelTypeType, docEntry: DocsModelEntriyType, path: string, name: string };
}

export interface ICanExpendedState {
    setSelectedIndexByUrlPath: (locationUrl: string) => boolean;
    listItems: ICanExpendedItem[];
    selectedIndex: number;
}

let enableDocs: ICanExpendedItem[];
let disableDocs: ICanExpendedItem;
let _selectedIndex = 0;

export function setSelectionIndex(index: number) {
    _selectedIndex = index;
}
export function getDocInfoByUrlPath(pathname: String): ICanExpendedItem {
    let temp = [...enableDocs, disableDocs];
    while (temp.length > 0) {
        let item = temp.shift();
        if (item.data.path === pathname) {
            return item;
        }
        temp.push(...item.child);
    }
    return null;
}

export class ExpandedDocList implements ICanExpendedState {
    public listItems: ICanExpendedItem[];
    public setSelectedIndexByUrlPath: (locationUrl: string) => boolean = this._setSelectedIndexByUrlPath.bind(this);
    constructor(force: boolean = false, public selectedIndex: number = _selectedIndex) {
        if (force || !enableDocs) { this.init(); selectedIndex = _selectedIndex = 0; }
        this.listItems = this.generalList();
        // this.selectedIndex = _selectedIndex;
        // console.log('ExpandedDocList new ' + force + _selectedIndex);
    }
    private init() {
        enableDocs = [];
        disableDocs = {
            isExpended: true,
            deep: 0,
            child: [],
            data: { name: 'Disable', path: null, docInfo: null, docType: null, docEntry: null },
            parent: null,
        };
        for (let docItem of appConfig.default.docs.getDocsInfoArrays) {
            if (docItem.storeValue) {
                let parentItem: ICanExpendedItem = {
                    isExpended: false, deep: 0, child: [], parent: null,
                    data: { name: docItem.name, docInfo: docItem, docType: null, docEntry: null, path: '/docs/' + docItem.slug + '/' },
                };
                parentItem.child = docItem.storeValue.types.map((item: DocsModelTypeType) => {
                    let parentTypes: ICanExpendedItem = {
                        isExpended: false, deep: 0, child: [], parent: parentItem,
                        data: { name: item.name, docInfo: docItem, docType: item, docEntry: null, path: '/docs/' + docItem.slug + '/' + item.slug + '/' },
                    };
                    parentTypes.child = item.childs.map((entry: DocsModelEntriyType) => {
                        return {
                            isExpended: false, deep: 0, child: [], parent: parentTypes, isEnable: true,
                            data: { name: entry.name, docInfo: docItem, docType: item, docEntry: entry, path: '/docs/' + docItem.slug + '/' + entry.path },
                        };
                    });
                    return parentTypes;
                });
                enableDocs.push(parentItem);
            } else {
                if (docItem.slug.indexOf('~') === -1) {
                    disableDocs.child.push({
                        isExpended: false, deep: 1, child: [], parent: disableDocs,
                        data: { name: docItem.name, docInfo: docItem, docType: null, docEntry: null, path: '/docs/' + docItem.slug + '/' },
                    });
                } else {
                    let disableChilds = disableDocs.child;
                    let parent;
                    for (let item of disableChilds) {
                        if (item.data.name === docItem.name) { // 以name 归类，不再以 docItem.slug 中 ～ 的前缀归类 
                            parent = item;
                        }
                    }
                    if (!parent) {
                        parent = {
                            isExpended: false, deep: 1, child: [], parent: disableDocs, isEnable: false,
                            data: { name: docItem.name, docInfo: null, docType: null, docEntry: null, path: null },
                        };
                        disableDocs.child.push(parent);
                    }
                    parent.child.push({
                        isExpended: false, deep: 1, child: [], parent: parent, isEnable: false,
                        data: { name: docItem.name, docInfo: docItem, docType: null, docEntry: null, path: '/docs/' + docItem.slug + '/' },
                    });
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

    private _setSelectedIndexByUrlPath(locationUrl: string): boolean {
        if (this.selectedIndex < this.listItems.length && this.selectedIndex > 0) {
            if (this.listItems[this.selectedIndex].data.path === locationUrl) {
                return false;  // 不用更新，selectedIndex 未变
            }
        }
        for (let index = 0; index < this.listItems.length; index++) {
            if (this.listItems[index].data.path === locationUrl) {
                this.selectedIndex = index;
                _selectedIndex = index;
                return true; // 只须更新 selectedIndex
            }
        }
        // 先找到对应的item　先根，再左右遍历
        let findedItem: ICanExpendedItem = null;
        let temp: ICanExpendedItem[] = [...enableDocs];
        while (temp.length !== 0) {
            let item = temp.shift();
            if (item.data.path === locationUrl) {
                findedItem = item;
                break;
            }
            temp.unshift(...item.child);
        }
        if (findedItem === null) { return false; }
        // 展开findedItem　的父节点
        while (findedItem.parent) {
            findedItem = findedItem.parent;
            findedItem.isExpended = true;
        }
        // 寻找选中项，并重新生成listItems
        let lists: ICanExpendedItem[] = [];
        let newIndex = 0;
        let isFind = false;
        temp = [...enableDocs, disableDocs];
        while (temp.length !== 0) {
            let item = temp.shift();
            lists.push(item);
            if (item.data.path === locationUrl) {
                isFind = true;
            }
            if (item.isExpended) {
                temp.unshift(...item.child);
            }
            if (!isFind) { newIndex++; }
        }
        this.selectedIndex = newIndex;
        _selectedIndex = newIndex;
        this.listItems = lists;
        return true;
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