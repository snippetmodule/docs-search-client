import {DocsModelEntriyType, DocsModelTypeType, IDocInfo, ISearchResultItem} from './model';
import {localStorage } from './storage';
import {Searcher}from './Searcher';
import app from '../config';
// import { getDefaultState } from '../containers/App/defaultDocList';

type SearchType = { name: string, [key: string]: any };

class Docs {
    private mSearcher: Searcher<SearchType>;
    constructor(private docsInfoArrays: Array<IDocInfo> = []) {
    }

    private initSearcher() {
        let searchItems: SearchType[] = [];
        this.docsInfoArrays.map<{ entries: DocsModelEntriyType[], types: DocsModelTypeType[] }>(
            (docsItem: IDocInfo) => {
                if (!docsItem.storeValue) {
                    return { entries: [], types: [] };
                }
                let _entries: DocsModelEntriyType[] = docsItem.storeValue.entries;
                let _types: DocsModelTypeType[] = docsItem.storeValue.types;
                _entries = _entries.map(item => {
                    item.doc = docsItem;
                    return item;
                });
                _types = _types.map((item: DocsModelTypeType) => {
                    item.childs = _entries.filter((entry: DocsModelEntriyType) => {
                        return entry.type === item.name;
                    });
                    item.doc = docsItem;
                    return item;
                });
                docsItem.storeValue.entries = _entries;
                docsItem.storeValue.types = _types;
                return { entries: _entries, types: _types };
            }).map((item: { entries: DocsModelEntriyType[], types: DocsModelTypeType[] }) => {
                return [...item.entries, ...item.types];
            }).forEach(item => {
                searchItems = searchItems.concat(item);
            });
        this.mSearcher = new Searcher(searchItems, ['name']);
    }

    public async init() {
        await this.initDocsArray();
        this.initSearcher();
        if (this.docsInfoArrays.length === 0) {
            throw new Error('docsArrays is empty');
        }
    }

    public get getDocsInfoArrays() {
        return this.docsInfoArrays;
    }

    private async initDocsArray() {
        let defaultDocs = app.docSetting.getConfig().default_docs;
        let docsInfos = this.docsInfoArrays;
        for (let docs of defaultDocs) {
            for (let info of docsInfos) {
                if (info.slug === docs) {
                    let value: IDocInfo = <IDocInfo> (await localStorage.getItem(info.slug));
                    if (!value) {
                        value = await app.docSetting.addDoc(info);
                    }
                    if (value) {
                        info.storeValue = value.storeValue;
                    }
                }
            }
        }
        // await this.downAndStore('http://devdocs.io/docs/git/index.json?1469993122', 'git');
        // await this.downAndStore('http://devdocs.io/docs/haxe~java/index.json?1457299146', 'java');
        // await this.downAndStore('http://devdocs.io/docs/javascript/index.json?1469397360', 'javascript');
    }

    public async downAndStore(url: string, key: string) {
        let res: any = await fetch(url, {
            headers: {
                Accept: 'application/json',
            },
        }).catch(error => console.log('docs test ' + error));
        if (res.ok) {
            res = await res.text();
            res = await localStorage.setItem(key, res);
        } else {
            await res.text();
        }
    }
    public storeDocs(key: string, value: any) {
        localStorage.setItem(key, value).catch(error => console.log('docs store key ' + key + ' ' + error));
        this.init();
    }
    public search(input: string): Promise<Array<ISearchResultItem>> {
        return new Promise((resolve, reject) => {
            resolve(this.mSearcher.search(input));
        });
    }
}

export {Docs}
