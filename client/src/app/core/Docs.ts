import {DocsModelEntriyType, DocsModelTypeType, IDocInfo, ISearchResultItem} from './model';
import {localStorage } from './storage';
import * as Cookies from 'js-cookie';
import {Searcher}from './Searcher';

type SearchType = { name: string, [key: string]: any };

// 根据docsInfoArrays 初始化 mSearcher
function initSearcher(docsInfoArrays: IDocInfo[]): Searcher<SearchType> {
    let searchItems: SearchType[] = [];
    docsInfoArrays.map<{ entries: DocsModelEntriyType[], types: DocsModelTypeType[] }>(
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
    return new Searcher(searchItems, ['name']);
}

async function initDocsArray(docsInfoArrays: IDocInfo[], downloadDocs: string[]) {
    let downloadInfos: IDocInfo[] = downloadDocs.map(item => {
        for (let docInfo of docsInfoArrays) {
            if (docInfo.slug === item) {
                return docInfo;
            }
        }
        return null;
    });
    for (let _downloadDocInfo of downloadInfos) {
        await downloadDoc(_downloadDocInfo);
    }
    let keys: string[] = await localStorage.keys();
    for (let key of keys) {
        for (let info of docsInfoArrays) {
            if (info.slug === key) {
                let value: IDocInfo = <IDocInfo> (await localStorage.getItem(key));
                if (value) {
                    info.storeValue = value.storeValue;
                }
            }
        }
    }
}
async function downloadDoc(docInfo: IDocInfo) {
    let res = await fetch(config.docs_host + '/docs/' + docInfo.slug + '/index.json', {
        headers: { Accept: 'application/json' },
    });
    if (res && res.ok) {
        let responseString = await res.text();
        docInfo.storeValue = JSON.parse(responseString);
        docInfo.storeValue.types = sortTyps(docInfo.storeValue.types);
        await localStorage.setItem(docInfo.slug, docInfo);
    }
}
let GUIDES_RGX = /(^|[\s\(])(guide|tutorial|reference|getting\ started)/i;
function _groupFor(type) {
    if (GUIDES_RGX.test(type.name)) {
        return 0;
    } else {
        return 1;
    }
};
function sortTyps(types: DocsModelTypeType[]): DocsModelTypeType[] {
    let result = [];
    let name;
    for (let i = 0, len = types.length; i < len; i++) {
        let type = types[i];
        (result[name = _groupFor(type)] || (result[name] = [])).push(type);
    }
    if (!result[0]) {
        result[0] = [];
    }
    if (!result[1]) {
        result[1] = [];
    }
    return [...(result[0]), ...result[1]];
}
let config = {
    default_docs: ['css', 'dom', 'dom_events', 'html', 'http', 'javascript'],
    docs_host: 'http://127.0.0.1:8081',
    docs_host_link: 'localhost:8080',
    env: 'development',
    history_cache_size: 10,
    index_path: '/docs',
    max_results: 50,
    production_host: 'www.devdocs.me',
    search_param: 'q',
    sentry_dsn: '',
    version: '1450281649',
};

class Docs {
    private isAutoUpdate: boolean;
    private isDocChangedByUser: boolean;

    private mSearcher: Searcher<SearchType>;
    constructor(private docsInfoArrays: Array<IDocInfo> = []) {
        this.isAutoUpdate = Cookies.get('Docs_IsAutoUpdate') === 'false' ? false : true; // 默认为true
        this.isDocChangedByUser = Cookies.get('Docs_isDocChangedByUser') === 'true' ? true : false; // 默认为false
    }
    public async init() {
        console.log('init start :' + new Date().getTime());
        await initDocsArray(this.docsInfoArrays, this.isDocChangedByUser ? [] : config.default_docs);
        this.mSearcher = initSearcher(this.docsInfoArrays);
        if (this.docsInfoArrays.length === 0) {
            throw new Error('docsArrays is empty');
        }
        console.log('init end:' + new Date().getTime());
    }

    public get getDocsInfoArrays() {
        return this.docsInfoArrays;
    }

    public async addDoc(docInfo: IDocInfo): Promise<IDocInfo> {
        if (!docInfo) {
            return;
        }
        // 无论localstorage 有无,均下载
        downloadDoc(docInfo);
        await this.init();
        Cookies.set('Docs_isDocChangedByUser', true);
    }

    public async removeDoc(docInfo: IDocInfo) {
        if (!docInfo) {
            return;
        }
        await localStorage.removeItem(docInfo.slug);
        for (let doc of this.docsInfoArrays) {
            if (doc.slug === docInfo.slug) {
                doc.storeValue = undefined;
            }
        }
        await this.init();
        Cookies.set('Docs_isDocChangedByUser', true);
    }
    public setIsAutoUpdate(isUpdate: boolean = true) {
        this.isAutoUpdate = isUpdate;
        Cookies.set('Docs_IsAutoUpdate', this.isAutoUpdate, { expires: 1e8, secure: true });
    }
    public getConfig() {
        return config;
    }

    public search(input: string): Promise<Array<ISearchResultItem>> {
        return new Promise((resolve, reject) => {
            resolve(this.mSearcher.search(input));
        });
    }
}

export {Docs}
