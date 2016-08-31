import {IDocInfo} from './model';
import * as Cookies from 'js-cookie';
import {localStorage } from './storage';

enum DownLoadStatusType {
    start, downloading, sucess, fail
}
interface IDownLoadStatus {
    statusType?: DownLoadStatusType;
    progress?: number;
    docInfo: IDocInfo;
}

let defaultConfig = {
    default_docs: ['css', 'dom', 'dom_events', 'html', 'http', 'javascript'],
    docs_host: 'http://127.0.0.1:8081/docs?docType=',
    env: 'development',
    history_cache_size: 10,
    index_path: '/docs',
    max_results: 50,
    production_host: 'www.devdocs.me',
    search_param: 'q',
    sentry_dsn: '',
    version: '1450281649',
};

class DocsSetting {
    private isAutoUpdate: boolean = true;
    private downloadStatusList: IDownLoadStatus[];

    private config = defaultConfig;

    constructor() {
        let setting: DocsSetting = <DocsSetting>Cookies.getJSON('docs_settings');
        if (setting) {
            this.isAutoUpdate = setting.isAutoUpdate;
            this.downloadStatusList = setting.downloadStatusList;
            this.config = setting.config;
        }

    }
    // public async addOffLineDoc(docInfo: IDocInfo) {
    // }
    // public async removeOffLineDoc(docInfo: IDocInfo) {
    // }
    public async addDoc(docInfo: IDocInfo): Promise<IDocInfo> {
        if (docInfo) {
            let res = await fetch(this.config.docs_host + docInfo.slug + '&url=index.json', {
                headers: { Accept: 'application/json' },
            }).catch(error => console.log('initDocsArray　error：' + error));
            if (res && res.ok) {
                let responseString = await res.text();
                docInfo.storeValue = JSON.parse(responseString);
                this.config.default_docs.push(docInfo.slug);
                return localStorage.setItem(docInfo.slug, docInfo);
                // todo 通知docs类更新
            }
        }
    }

    public async removeDoc(docInfo: IDocInfo) {
        if (docInfo) {
            await localStorage.removeItem(docInfo.slug);
            let index = this.config.default_docs.indexOf(docInfo.slug);
            let docs = this.config.default_docs;
            this.config.default_docs = docs.splice(index, 1);
            // todo 通知docs类更新
        }
    }
    public setIsAutoUpdate(isUpdate: boolean = true) {
        this.isAutoUpdate = isUpdate;
        this.save();
    }
    public getConfig() {
        return this.config;
    }
    private save() {
        Cookies.set('docs_settings', this, { expires: 1e8, secure: true });
    }
}
export {DocsSetting}
