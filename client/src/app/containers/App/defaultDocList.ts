
import {DocsModelEntriyType, DocsModelTypeType} from '../../core/model';
import * as appConfig from '../../config';

interface ICanExpendedItem {
    name: string;
    isExpended: boolean; // 是否已经展开
    child: ICanExpendedItem[];
    deep?: number; // 此节点在整个树中的的深度
    link?: string; // 点击链接地址
    linkParams?: any; //点击链接参数
    [key: string]: any;
}

export interface ICanExpendedState {
    enableDocs: ICanExpendedItem[];
    disableDocs: ICanExpendedItem;
    listItems: ICanExpendedItem[];
    expandItem: (index: number, stateItem) => ICanExpendedState;
}
let defaultState: ICanExpendedState;

export function getDefaultState(): ICanExpendedState {
    if (defaultState) {
        return defaultState;
    }
    let enableDocs: ICanExpendedItem[] = [];
    let disableDocs = {
        name: 'disable',
        isExpended: false,
        deep: 0,
        child: [],
    };
    for (let docItem of appConfig.default.docs.getDocsInfoArrays) {
        if (docItem.storeValue) {
            let types: ICanExpendedItem[] = docItem.storeValue.types.map((item: DocsModelTypeType) => {
                let subChild: ICanExpendedItem[] = item.childs.map((entry: DocsModelEntriyType) => {
                    return { name: entry.name, isExpended: false, child: [] };
                });
                console.log();
                return { name: item.name, isExpended: false, child: subChild };
            });
            enableDocs.push({ name: docItem.name, link: docItem.slug + '/index.html', isExpended: false, child: types });
        } else {
            disableDocs.child.push({ name: docItem.name, isExpended: false, link: docItem.slug + '/index.html', deep: 1, child: [] });
        }
    }
    // 标记节点在树中的深度
    function markNodeDeep(enableDocs: ICanExpendedItem[]): number {
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

    function generalList(enableDocs: ICanExpendedItem[]): ICanExpendedItem[] {
        let lists: ICanExpendedItem[] = [];
        let temp: ICanExpendedItem[] = [...enableDocs];
        let maxDeep = markNodeDeep(enableDocs);

        while (temp.length !== 0) {
            let item = temp.shift();
            lists.push(item);
            if (item.isExpended) {
                temp.unshift(...item.child);
            }
        }
        lists.push(disableDocs);
        if (disableDocs.isExpended) {
            lists.push(...disableDocs.child);
        }
        return lists;
    }
    function expandItem(index: number, stateItem): ICanExpendedState {
        stateItem.isExpended = !stateItem.isExpended;
        return {
            enableDocs: enableDocs,
            disableDocs: disableDocs,
            listItems: generalList(enableDocs),
            expandItem: expandItem,
        };
    }
    defaultState = {
        enableDocs: enableDocs,
        disableDocs: disableDocs,
        listItems: generalList(enableDocs),
        expandItem: expandItem,
    }
    return defaultState;
}