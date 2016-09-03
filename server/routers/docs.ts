import * as restify from 'restify';
import * as fs from 'fs-extra';
import * as asyncjs from 'async';

let rootPath = '../api-docs/';
let docsDB: {
    [key: string]: {
        [key: string]: string;
    };
} = {};

let docsLoadingState: boolean = false;

function init() {
    if (!fs.existsSync(rootPath)) {
        return;
    }
    console.log('init------start ');
    let fileList: string[] = fs.readdirSync(rootPath);
    docsLoadingState = false;
    asyncjs.eachSeries(fileList, (file, callback) => {
        if (!fs.statSync(rootPath + file).isDirectory()) {
            return callback(null);
        }
        fs.readFile(rootPath + file + '/db.json', { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                console.log('load file ' + file + 'error:' + err);
            } else {
                docsDB[file] = JSON.parse(data);
            }
            callback(null);
        });
    }, err => {
        if (!err) {
            docsLoadingState = true;
        }
        console.log('init------end ');
    });
}

init();

export function getDocsByUrl(req: restify.Request, res: restify.Response, next: restify.Next) {
    console.log('getDocsByUrl: ' + JSON.stringify(req.params));
    let urlParams: string[] = [];
    req.params.url1 && urlParams.push(req.params.url1);
    req.params.url2 && urlParams.push(req.params.url2);
    req.params.url3 && urlParams.push(req.params.url3);
    req.params.url = urlParams.join('/');
    getDocs(req, res, next);
}
export function getDocs(req: restify.Request, res: restify.Response, next: restify.Next) {
    let docType: string = req.params.docType;
    let url: string = req.params.url;
    console.log('getDocs: ' + JSON.stringify(req.params));
    if (url === 'db.json' || url === 'index.html' || url === 'index.json') {
        fs.readFile(rootPath + docType + '/' + url, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                res.json(400, err);
            } else {
                res.writeHead(200, {
                    'Content-Type': url.endsWith('.html') ? 'application/json' : 'text/html',
                });
                res.write(data);
                res.end();
            }
        });
    } else {
        url = url.replace('.html', '');
        if (!docsLoadingState) {
            res.json(400, { message: 'docsDB not load ok' });
        } else {
            let isHasDos = (docType in docsDB);
            let result;
            if (isHasDos) {
                result = docsDB[docType][url];
            }
            if (result) {
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                });
                res.write(result);
                res.end();
            } else {
                res.json(400, { message: 'not found' });
            }

        }
    }
}