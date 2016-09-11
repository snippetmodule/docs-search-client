import {DocsModelEntriyType, DocsModelTypeType, IDocInfo, ISearchItem} from './model';
import {localStorage } from './storage';
import * as Cookies from 'js-cookie';
import {Searcher}from './Searcher';

// 根据docsInfoArrays 初始化 mSearcher
function initSearcher(docsInfoArrays: IDocInfo[]): Searcher<ISearchItem> {
    let searchItems: ISearchItem[] = [];
    docsInfoArrays.map<{ entries: ISearchItem[], types: ISearchItem[] }>(
        (docsItem: IDocInfo) => {
            if (!docsItem.storeValue) {
                return { entries: [], types: [] };
            }
            let _entries: ISearchItem[];
            let _types: ISearchItem[];
            _entries = docsItem.storeValue.entries.map((item: DocsModelEntriyType) => {
                return { name: item.name, pathname: item.pathname, slug: docsItem.slug, doc: docsItem };
            });
            _types = docsItem.storeValue.types.map((item: DocsModelTypeType) => {
                return { name: item.name, pathname: item.pathname, slug: docsItem.slug, doc: docsItem };
            });
            return { entries: _entries, types: _types };
        }).map((item: { entries: ISearchItem[], types: ISearchItem[] }) => {
            return [...item.entries, ...item.types];
        }).forEach(item => {
            searchItems = searchItems.concat(item);
        });

    searchItems.push(...docsInfoArrays.filter(item => {
        if (item.storeValue) {
            return false;
        }
        return true;
    }).map(item => {
        return { name: item.slug, pathname: item.pathname, slug: item.slug, doc: item };
    }));
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
                let value: IDocInfo = <IDocInfo>(await localStorage.getItem(key));
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
        docInfo.storeValue.entries.forEach(item => item.pathname = docInfo.pathname + item.path);
        docInfo.storeValue.types.forEach(item => item.pathname = docInfo.pathname + item.slug + '/');
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

    private mSearcher: Searcher<ISearchItem>;
    constructor(private docsInfoArrays: Array<IDocInfo> = []) {
        this.docsInfoArrays.forEach(item => item.pathname = '/docs/' + item.slug + '/');
        this.isAutoUpdate = Cookies.get('Docs_IsAutoUpdate') === 'false' ? false : true; // 默认为true
        this.isDocChangedByUser = Cookies.get('Docs_isDocChangedByUser') === 'true' ? true : false; // 默认为false
    }
    public async init() {
        await initDocsArray(this.docsInfoArrays, this.isDocChangedByUser ? [] : config.default_docs);
        this.mSearcher = initSearcher(this.docsInfoArrays);
        if (this.docsInfoArrays.length === 0) {
            throw new Error('docsArrays is empty');
        }
    }

    public get getDocsInfoArrays() {
        return this.docsInfoArrays;
    }

    public async addDoc(docInfo: IDocInfo): Promise<IDocInfo> {
        if (!docInfo) {
            return;
        }
        this.isDocChangedByUser = true;
        this.save();
        // 无论localstorage 有无,均下载
        await downloadDoc(docInfo);
        await this.init();
    }

    public async removeDoc(docInfo: IDocInfo) {
        if (!docInfo) {
            return;
        }
        this.isDocChangedByUser = true;
        this.save();
        await localStorage.removeItem(docInfo.slug);
        for (let doc of this.docsInfoArrays) {
            if (doc.slug === docInfo.slug) {
                doc.storeValue = undefined;
                break;
            }
        }
        await this.init();
    }
    public setIsAutoUpdate(isUpdate: boolean = true) {
        this.isAutoUpdate = isUpdate;
        this.save();
    }
    public getConfig() {
        return config;
    }
    private save() {
        Cookies.set('Docs_IsAutoUpdate', this.isAutoUpdate, { expires: 1e8, secure: true });
        Cookies.set('Docs_isDocChangedByUser', this.isDocChangedByUser);
    }
    public search(input: string): Promise<Array<ISearchItem>> {
        return new Promise((resolve, reject) => {
            resolve(this.mSearcher.search(input));
        });
    }
}

export {Docs}
