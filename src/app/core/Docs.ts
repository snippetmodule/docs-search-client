import {DocsModelEntriyType, DocsModelTypeType, DocsModel, ISearchResultItem} from './model';
import {localStorage } from './storage';
import {Searcher}from './Searcher';
type SearchType = { name: string, [key: string]: any };

class Docs {
    private mSearcher: Searcher<SearchType>;
    constructor(private docsArrays: Array<DocsModel> = []) {
    }

    private initSearcher() {
        let searchItems: SearchType[] = [];
        this.docsArrays.map<{ entries: DocsModelEntriyType[], types: DocsModelTypeType[] }>(
            (item: DocsModel) => {
                let entries: DocsModelEntriyType[] = item.value.entries;
                let types: DocsModelTypeType[] = item.value.types;
                types = types.map((item: DocsModelTypeType) => {
                    item.childs = entries.filter((entry: DocsModelEntriyType) => {
                        return entry.type === item.name;
                    });
                    return item;
                });
                item.value.types = types;
                return { entries: entries, types: types };
            }).map((item: { entries: DocsModelEntriyType[], types: DocsModelTypeType[] }) => {
                return [...item.entries, ...item.types];
            }).forEach(item => {
                searchItems = searchItems.concat(item);
            });
        this.mSearcher = new Searcher(searchItems, ['name']);
    }
    public async init() {
        let temp = this.docsArrays;
        await this.test().catch(error => console.log('docs init test =' + ' ' + error));
        await localStorage.iterate(function (value, key, iterationNumber) {
            temp.push({
                key: key,
                value: JSON.parse(value),
            });
        }).catch(function (error) {
            if (error) {
                console.log('docs init error ' + error);
            }
        });
        this.initSearcher();
    }
    private async test() {
        await this.downAndStore('http://devdocs.io/docs/git/index.json?1469993122', 'git');
        await this.downAndStore('http://devdocs.io/docs/haxe~java/index.json?1457299146', 'java');
        await this.downAndStore('http://devdocs.io/docs/javascript/index.json?1469397360', 'javascript');
    }
    private async downAndStore(url: string, key: string) {
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
