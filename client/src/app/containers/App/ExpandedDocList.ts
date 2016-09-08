
import {DocsModelEntriyType, DocsModelTypeType, IDocInfo} from '../../core/model';
import * as appConfig from '../../config';

export interface ICanExpendedItem {
    name: string;
    slug: string;
    path: string; // LinkPage 中用到的 path
    isExpended: boolean; // 是否已经展开
    child: ICanExpendedItem[];
    deep: number; // 此节点在整个树中的的深度
    docInfo: IDocInfo;
    parent: ICanExpendedItem; // 父节点
    isEnable: boolean; // 是否当前文档不可用
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
export function getDocInfoByUrlPath(pathname: String): { docInfo: IDocInfo, types: DocsModelEntriyType[] } {
    pathname = pathname.replace('/docs/', '');
    let index = pathname.indexOf('/');
    let docType = pathname.substr(0, index);
    let typePath = pathname.substr(index + 1, pathname.length - index - 2);
    let resultDocInfo;
    for (let doc of enableDocs) {
        if (doc.docInfo.slug === docType) {
            resultDocInfo = doc.docInfo;
        }
    }
    if (!pathname.endsWith('/') || !resultDocInfo) {
        return { docInfo: resultDocInfo, types: null };
    }
    for (let type of resultDocInfo.storeValue.types) {
        if (type.slug === typePath) {
            return { docInfo: resultDocInfo, types: type.childs };
        }
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
            name: 'Disable',
            slug: 'disable',
            isExpended: true,
            path: '',
            deep: 0,
            child: [],
            docInfo: null,
            parent: null,
            isEnable: false,
        };
        for (let docItem of appConfig.default.docs.getDocsInfoArrays) {
            if (docItem.storeValue) {
                let parentItem: ICanExpendedItem = { name: docItem.name, slug: docItem.slug, path: docItem.slug + '/index.html', isExpended: false, deep: 0, child: [], docInfo: docItem, parent: null, isEnable: true };
                parentItem.child = docItem.storeValue.types.map((item: DocsModelTypeType) => {
                    let parentTypes: ICanExpendedItem = { name: item.name, slug: docItem.slug, path: docItem.slug + '/' + item.slug + '/', isExpended: false, deep: 0, child: [], docInfo: docItem, parent: parentItem, isEnable: true };
                    parentTypes.child = item.childs.map((entry: DocsModelEntriyType) => {
                        return { name: entry.name, slug: docItem.slug, path: docItem.slug + '/' + entry.path, isExpended: false, deep: 0, child: [], docInfo: docItem, parent: parentTypes, isEnable: true };
                    });
                    return parentTypes;
                });
                enableDocs.push(parentItem);
            } else {
                if (docItem.slug.indexOf('~') === -1) {
                    disableDocs.child.push({ name: docItem.name, slug: docItem.slug, isExpended: false, path: docItem.slug + '/index.html', deep: 1, child: [], docInfo: docItem, parent: disableDocs, isEnable: false });
                } else {
                    let disableChilds = disableDocs.child;
                    let preSlug = docItem.slug.indexOf('~') === -1 ? docItem.slug : docItem.slug.substr(0, docItem.slug.indexOf('~'));
                    let parent;
                    for (let item of disableChilds) {
                        if (item.slug.startsWith(preSlug)) {
                            parent = item;
                        }
                    }
                    if (!parent) {
                        parent = { name: docItem.name, slug: docItem.slug, isExpended: false, path: null, deep: 1, child: [], docInfo: null, parent: disableDocs, isEnable: false };
                        disableDocs.child.push(parent);
                    }
                    parent.child.push({ name: docItem.name, slug: docItem.slug, isExpended: false, path: docItem.slug + '/index.html', deep: 1, child: [], docInfo: docItem, parent: parent, isEnable: false });
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
        locationUrl = locationUrl.replace('/docs/', '');
        if (this.selectedIndex < this.listItems.length && this.selectedIndex > 0) {
            if (this.listItems[this.selectedIndex].path === locationUrl) {
                return false;  // 不用更新，selectedIndex 未变
            }
        }
        for (let index = 0; index < this.listItems.length; index++) {
            if (this.listItems[index].path === locationUrl) {
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
            if (item.path === locationUrl) {
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
            if (item.path === locationUrl) {
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