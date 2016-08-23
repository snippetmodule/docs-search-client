import {DocsModelEntriyType, DocsModelTypeType, DocsModel, ISearchResultItem} from './model';
import {localStorage } from './storage';
import {Searcher}from './Searcher';
import app from '../config';

type SearchType = { name: string, [key: string]: any };

class Docs {
    private mSearcher: Searcher<SearchType>;
    constructor(private docsArrays: Array<DocsModel> = []) {
    }

    private initSearcher() {
        let searchItems: SearchType[] = [];
        this.docsArrays.map<{ entries: DocsModelEntriyType[], types: DocsModelTypeType[] }>(
            (docsItem: DocsModel) => {
                let entries: DocsModelEntriyType[] = docsItem.value.entries;
                let types: DocsModelTypeType[] = docsItem.value.types;
                entries = entries.map(item => {
                    item.doc = docsItem;
                    return item;
                });
                types = types.map((item: DocsModelTypeType) => {
                    item.childs = entries.filter((entry: DocsModelEntriyType) => {
                        return entry.type === item.name;
                    });
                    item.doc = docsItem;
                    return item;
                });
                docsItem.value.types = types;
                return { entries: entries, types: types };
            }).map((item: { entries: DocsModelEntriyType[], types: DocsModelTypeType[] }) => {
                return [...item.entries, ...item.types];
            }).forEach(item => {
                searchItems = searchItems.concat(item);
            });
        this.mSearcher = new Searcher(searchItems, ['name']);
    }
    public async init() {
        // let temp = this.docsArrays;
        await this.test().catch(error => console.log('docs init test =' + ' ' + error));
        // await localStorage.iterate(function (value, key, iterationNumber) {
        //     temp.push({
        //         key: key,
        //         value: JSON.parse(value),
        //     });
        // }).catch(function (error) {
        //     if (error) {
        //         console.log('docs init error ' + error);
        //     }
        // });
        this.initSearcher();
    }
    private async test() {
        let defaultDocs = app.docConfig.default_docs;
        let docsInfos = app.docInfos;
        for (let docs of defaultDocs) {
            for (let info of docsInfos) {
                if (info.slug === docs) {
                    let value: DocsModel = <DocsModel> (await localStorage.getItem(info.slug));
                    if (!value) {
                        let res = await fetch('docs/' + info.slug + '/index.json', {
                            headers: { 'Accept': 'application/json' },
                        });
                        if (res.ok) {
                            let responseString = await res.text();
                            value = JSON.parse(responseString);
                        }
                    }
                    if (value) {
                        await localStorage.setItem(info.slug, value);
                        this.docsArrays.push(value);
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
                'Accept': 'application/json',
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
