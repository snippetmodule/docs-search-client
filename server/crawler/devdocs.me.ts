import * as restify from 'restify';
import * as fetch from 'isomorphic-fetch';
import * as fs from 'fs-extra';

let rootPath = '../api-docs/';

interface IDocsItem {
    name: string,
    slug: string,
    type: string,
    version: string,
    index_path?: string,
    db_path?: string,
    links?: {
        home: string,
        code: string
    },
    mtime: number,
    db_size: number
}

async function getDocsListImpl() {
    let res: ResponseInterface = await fetch('http://www.devdocs.me/assets/docs.js');
    let result: string;
    if (res.ok) {
        result = await res.text();
        result = result.substring(result.indexOf('app.DOCS =') + 10, result.lastIndexOf(';'));
        if (!fs.existsSync(rootPath)) {
            fs.mkdir(rootPath);
        }
        fs.writeFile(rootPath + 'list.json', result, error => console.log('list.json     :' + error));
        getDocs(result);
    } else {
        throw new Error();
    }
}

async function download(url: string, path: string) {
    let res: ResponseInterface = await fetch(url);
    let result: string;
    if (res.ok) {
        result = await res.text();
        fs.writeFile(path, result, error => console.log(url + '    ' + path + ' :' + error));
        return new Promise<string>((resove, reject) => {
            resove(result);
        });
    } else {
        throw new Error();
    }
}
async function getDocsItem(docsItem: IDocsItem) {
    let path = rootPath + docsItem.slug;
    if (!fs.existsSync(path)) {
        fs.mkdir(path);
    }
    let savePath = path + '/index.json';
    if (!fs.existsSync(savePath)) {
        await download('http://www.devdocs.me/docs/' + docsItem.slug + '/index.json', savePath);
    }
    savePath = path + '/db.json';
    if (!fs.existsSync(savePath)) {
        await download('http://www.devdocs.me/docs/' + docsItem.slug + '/index.json', savePath);
    }
}
async function getDocs(list: string) {
    //console.log('------------devdocs.me-----------start');
    let object: IDocsItem[] = JSON.parse(list);
    for (let item of object) {
        getDocsItem(item);
    }
    //console.log('------------devdocs.me-----------end');
}
export function getDocsList(req: restify.Request, res: restify.Response, next: restify.Next) {
    console.log('devdovs.me.ts getDocsList:'+req.params.force);
    if (req.params.force) {
        fs.removeSync(rootPath);
    }
    console.log('getDocsList:'+req.params.force);
    getDocsListImpl()
        .then(result => {
            res.json(200, { result })
        })
        .catch(error => {
            res.json(400, error)
        });
}
interface CheckResult {
    [key: string]: {
        path: string,
        index: boolean,
        db: boolean,
    }
}
export function clearDocsList(req: restify.Request, res: restify.Response, next: restify.Next) {
    fs.removeSync(rootPath);
    res.json(200, { message: 'ok' });
}

export function checkDocsList(req: restify.Request, res: restify.Response, next: restify.Next) {
    if (!fs.existsSync(rootPath + 'list.json')) {
        res.json(400, { message: 'list.json file　not found' });
    }
    let docsList: string = fs.readFileSync(rootPath + 'list.json', 'utf-8');
    if (!docsList) {
        res.json(400, { message: 'file　not found' });
    }
    let docsArray: IDocsItem[] = JSON.parse(docsList);
    let result: CheckResult[] = [];
    for (let docsItem of docsArray) {
        let path: string = rootPath + docsItem.slug;
        let resultItem = {};
        resultItem[docsItem.slug] = {
            path: path,
            index: fs.existsSync(path + '/index.json'),
            db: fs.existsSync(path + '/db.json'),
        }
        result.push(<CheckResult>resultItem);
    }
    res.json(200, { result });
}

