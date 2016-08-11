import {DocsModelEntriyType, DocsModelTypeType, DocsModel} from './model';
import {localStorage } from './storage';

export let docsArrays: Array<DocsModel> = [];

export async function init() {
    await test().catch(error => console.log('docs init test =' + ' ' + error));
    await localStorage.iterate(function (value, key, iterationNumber) {
        docsArrays.push({
            key: key,
            value: JSON.parse(value),
        });
    }).catch(function (error) {
        if (error) {
            console.log('docs init error ' + error);
        }
    });
}
export function search(input: string): Promise<Array<DocsModel>> {
    if (!input || input.length === 0) {
        return new Promise((resolve, reject) => { resolve([]); });
    }
    return new Promise((resolve, reject) => {
        let regexp = new RegExp('^' + input, 'i');
        let result: Array<DocsModel> = docsArrays.map((item: DocsModel) => {
            let entries: DocsModelEntriyType[] = item.value.entries;
            let types: DocsModelTypeType[] = item.value.types;

            entries = entries.filter((item: DocsModelEntriyType): boolean => {
                return item.name.match(regexp) == null ? false : true;
            });
            types = types.filter((item: DocsModelTypeType) => {
                return item.name.match(regexp) == null ? false : true;
            });
            return { key: item.key, value: { entries: entries, types: types } };
        }).filter((item: DocsModel) => {
            if (item.value.entries.length === 0 && item.value.types.length === 0) {
                return false;
            }
            return true;
        });
        resolve(result);
    });

}
export function storeDocs(key: string, value: any) {
    localStorage.setItem(key, value).catch(error => console.log('docs store key ' + key + ' ' + error));
    init();
}
async function downAndStore(url: string, key: string) {
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
    // return fetch(url, {
    //     headers: {
    //         'Accept': 'application/json',
    //     },
    // }).then<string>((res: IResponse) => {
    //     if (res.ok) {
    //         return res.text()
    //             .then(res =>
    //                 localStorage.setItem(key, res).catch(error => console.log('docs downAndStore key ' + key + ' ' + error)));
    //     } else {
    //         return res.text();
    //     }
    // }).catch(error => console.log('docs downAndStore url =' + url + ' ' + error));
}

export async function test() {
    await downAndStore('http://devdocs.io/docs/git/index.json?1469993122', 'git');
    await downAndStore('http://devdocs.io/docs/haxe~java/index.json?1457299146', 'java');
    await downAndStore('http://devdocs.io/docs/javascript/index.json?1469397360', 'javascript');
}
