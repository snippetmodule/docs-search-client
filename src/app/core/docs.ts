import {DocsModelEntriyType, DocsModelTypeType, DocsModel} from './model';
import {localStorage } from './storage';

export let docsArrays: Array<DocsModel> = [];

export function init() {
    localStorage.iterate(function (value, key, iterationNumber) {
        docsArrays.push({
            key: key,
            value: JSON.parse(value),
        });
    }, function (error) {
        console.log('docs init error ' + error);
    });
}
export function search(input: string): Promise<Array<DocsModel>> {
    return new Promise((resolve, reject) => {
        let regexp = new RegExp('^' + input, 'i');
        let result: Array<DocsModel> = docsArrays.map((item: DocsModel) => {
            let entries: DocsModelEntriyType[] = item.value.entries;
            let types: DocsModelTypeType[] = item.value.types;

            entries = entries.filter((item: DocsModelEntriyType): boolean => {
                return item.name.match(regexp) == null ? false : true;
            });
            types = entries.filter((item: DocsModelTypeType) => {
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
function downAndStore(url: string, key: string): Promise<any> {
    return fetch(url, {
        headers: {
            'Accept': 'application/json',
        },
    }).then(res => {
        if (res.ok) {
            return res.text()
                .then(res =>
                    localStorage.setItem(key, res).catch(error => console.log('docs downAndStore key ' + key + ' ' + error)));
        } else {
            return res.json()
                .then(res => console.log('docs downAndStore url =' + url + ' ' + res));
        }

    }).catch(error => console.log('docs downAndStore url =' + url + ' ' + error));
}
export function test() {
    Promise.all([
        downAndStore('http://devdocs.io/docs/git/index.json?1469993122', 'git'),
        downAndStore('http://devdocs.io/docs/haxe~java/index.json?1457299146', 'java'),
        downAndStore('http://devdocs.io/docs/javascript/index.json?1469397360', 'javascript'),
    ]).then(() => init()).catch(error => console.log('docs test ' + error));
}
test();
