
import {DocsModelEntriyType, DocsModelTypeType, IDocInfo} from '../../core/model';
import * as appConfig from '../../config';

export interface ICanExpendedItem {
    name: string;
    type: string; // 用于文档分类
    path: string; // LinkPage 中用到的 path
    isExpended: boolean; // 是否已经展开
    child: ICanExpendedItem[];
    deep: number; // 此节点在整个树中的的深度
    docInfo: IDocInfo;
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
export function getTypesByUrlPath(pathname: String): DocsModelEntriyType[] {
    if (!pathname.endsWith('/')) {
        return null;
    }
    pathname = pathname.replace('/docs/', '');
    let index = pathname.indexOf('/');
    let docType = pathname.substr(0, index);
    let typePath = pathname.substr(index + 1, pathname.length - index - 2);
    for (let doc of enableDocs) {
        if (doc.docInfo.slug === docType) {
            for (let type of doc.docInfo.storeValue.types) {
                if (type.slug === typePath) {
                    return type.childs;
                }
            }
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
            name: 'disable',
            type: 'disable',
            isExpended: false,
            path: '',
            deep: 0,
            child: [],
            docInfo: null,
        };
        for (let docItem of appConfig.default.docs.getDocsInfoArrays) {
            if (docItem.storeValue) {
                let types: ICanExpendedItem[] = docItem.storeValue.types.map((item: DocsModelTypeType) => {
                    let subChild: ICanExpendedItem[] = item.childs.map((entry: DocsModelEntriyType) => {
                        return { name: entry.name, type: entry.name, path: docItem.slug + '/' + entry.path, isExpended: false, deep: 0, child: [], docInfo: docItem };
                    });
                    return { name: item.name, type: item.name, path: docItem.slug + '/' + item.slug + '/', isExpended: false, deep: 0, child: subChild, docInfo: docItem };
                });
                enableDocs.push({ name: docItem.name, type: docItem.type, path: docItem.slug + '/index.html', isExpended: false, deep: 0, child: types, docInfo: docItem });
            } else {
                let disableChilds = disableDocs.child;
                let isHas = false;
                for (let item of disableChilds) {
                    if (item.type === docItem.type) {
                        let _docInfo = item.docInfo;
                        if (_docInfo) {
                            item.child.push({ name: _docInfo.name + ' ' + (_docInfo.version || ''), type: _docInfo.type, isExpended: false, path: _docInfo.slug + '/index.html', deep: 1, child: [], docInfo: _docInfo });
                            item.docInfo = null;
                        }
                        item.child.push({ name: docItem.name + ' ' + (docItem.version || ''), type: docItem.type, isExpended: false, path: docItem.slug + '/index.html', deep: 1, child: [], docInfo: docItem });
                        isHas = true;
                        continue;
                    }
                }
                if (!isHas) {
                    disableDocs.child.push({ name: docItem.name, type: docItem.type, isExpended: false, path: docItem.slug + '/index.html', deep: 1, child: [], docInfo: docItem });
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
    private getSelectedIndexByPath(path: string): number {
        if (this.listItems[this.selectedIndex].path === path) {
            return -1;
        }
        for (let index = 0; index < this.listItems.length; index++) {
            if (this.listItems[index].path === path) {
                return index;
            }
        }
        return -1;
    }
    private _setSelectedIndexByUrlPath(locationUrl: string): boolean {
        locationUrl = locationUrl.replace('/docs/', '');
        let index = locationUrl.indexOf('/');
        let docType = locationUrl.substr(0, index);
        let typePath = locationUrl.substr(index + 1, locationUrl.length - index - 2);
        if (this.getSelectedIndexByPath(typePath) !== -1) {
            return false;
        }
        let newIndex = 0;
        let isFind = false;
        for (let docItem of enableDocs) {
            if (docItem.docInfo.slug === docType) {
                docItem.isExpended = true;
            }
        }
        let lists: ICanExpendedItem[] = [];
        let temp: ICanExpendedItem[] = [...enableDocs, disableDocs];
        this.markNodeDeep(enableDocs);
        this.markNodeDeep([disableDocs]);
        while (temp.length !== 0) {
            let item = temp.shift();
            lists.push(item);
            if (item.path === typePath) {
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