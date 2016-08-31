import * as restify from 'restify';
import * as fetch from 'isomorphic-fetch';
import * as fs from 'fs-extra';
import * as asyncjs from 'async';

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
    let res: IResponse = await fetch(
        'http://cdn.devdocs.io/assets/docs-71a1b5319f1da19014ec52369623974ccb9017b2ff926ed892b16001bb5ebc84.js'
        , {
            headers: {
                Referer: 'http://devdocs.io/'
            }
        });
    let result: string;
    if (res.ok) {
        result = await res.text();
        result = result.replace('app.DOCS', 'let DOCS');
        // result = result.substring(result.indexOf('app.DOCS = ') + 11, result.lastIndexOf(';'));
        result = result + '\n exports.DOCS= DOCS;'
        if (!fs.existsSync(rootPath)) {
            fs.mkdir(rootPath);
        }
        fs.writeFile(rootPath + 'list.js', result, error => {
            if (error) {
                console.log('list.js     :' + error)
            } else {
                if (mTasks) {
                    mTasks.isCancenl = true;
                }
                let {DOCS} = require("../../" + rootPath + 'list.js');
                mTasks = new TasksPromise(DOCS);
            }
        });
    } else {
        console.log('getDocsListImpl download list.js error ');
        if (mTasks) {
            mTasks.isCancenl = true;
        }
        let {DOCS} = require("../../" + rootPath + 'list.js');
        mTasks = new TasksPromise(DOCS);
        // throw new Error();
    }
}

export function getDocsList(req: restify.Request, res: restify.Response, next: restify.Next) {
    console.log('devdocs.io.ts getDocsList:' + req.params.force);
    if (req.params.force) {
        fs.removeSync(rootPath);
    }
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
    if (mTasks) {
        mTasks.isCancenl = true;
    }
    fs.removeSync(rootPath);
    res.json(200, { message: 'ok' });
}

export function checkDocsList(req: restify.Request, res: restify.Response, next: restify.Next) {
    if (!fs.existsSync(rootPath + 'list.js')) {
        res.json(400, { message: 'list.js file　not found' });
    }
    let {DOCS} = require("../../" + rootPath + 'list.js');
    let docsArray: IDocsItem[] = DOCS;
    let result: CheckResult[] = [];
    for (let docsItem of docsArray) {
        let path: string = rootPath + docsItem.slug;
        let resultItem = {};
        resultItem[docsItem.slug] = {
            path: path,
            index: fs.existsSync(path + '/index.json'),
            indexhtml: fs.existsSync(path + '/index.html'),
            db: fs.existsSync(path + '/db.json'),
        }
        result.push(<CheckResult>resultItem);
    }
    res.json(200, { result });
}

let mTasks: TasksPromise;

class TasksPromise {
    private isCancel: boolean = false;

    constructor(private docsArray: IDocsItem[]) {
        console.log('------------devdocs.io-----------start');
        asyncjs.eachSeries(this.docsArray, (item: IDocsItem, callback) => {
            // console.log('------------item start ' + item.slug);
            if (this.isCancel) {
                console.log('task has canceled ');
                callback('task has canceled ');
            } else {
                let path = rootPath + item.slug;
                let promises: Promise<any>[] = [];
                if (!fs.existsSync(path)) {
                    fs.mkdir(path);
                }
                let savePath = path + '/index.json';
                if (!fs.existsSync(savePath)) {
                    promises.push(this.download('http://docs.devdocs.io/' + item.slug + '/index.json', savePath));
                }
                savePath = path + '/db.json';
                if (!fs.existsSync(savePath)) {
                    promises.push(this.download('http://docs.devdocs.io/' + item.slug + '/db.json', savePath));
                }
                savePath = path + '/index.html';
                if (!fs.existsSync(savePath)) {
                    promises.push(this.download('http://docs.devdocs.io/' + item.slug + '/index.html', savePath));
                }
                if (promises.length !== 0) {
                    Promise.all(promises).then(res => {
                        // console.log('------------item end1   ' + item.slug);
                        callback(null);
                    }).catch(err => {
                        console.log('------------item err ' + item.slug);
                        // console.log('------------item end2   ' + item.slug);
                        callback(err);
                    });
                } else {
                    console.log(item.slug + ' has downloaded!!!');
                    // console.log('------------item end3   ' + item.slug);
                    callback(null);
                }
            }

        }, err => {
            console.log('------------devdocs.io-----------end' + err);
            console.log('------------devdocs.io-----------end isCancel=' + this.isCancel);
        });

    }

    public set isCancenl(cancel: boolean) {
        this.isCancel = cancel;
    }

    private download(url: string, path: string): Promise<void> {
        return fetch(url)
            .then(res => res.text())
            .then(res => fs.writeFile(path, res, error => console.log(url + '    ' + path + ' :' + error)))
            .catch(err => console.log(url + '    ' + path + ' :' + err));
    }
}
