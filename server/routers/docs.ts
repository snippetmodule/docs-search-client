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
    });
}

init();

export function getDocs(req: restify.Request, res: restify.Response, next: restify.Next) {
    let floder = req.params.floder;
    let filename = req.params.filename;
    if (filename === 'db.json' || filename === 'index.html' || filename === 'index.json') {
        fs.readFile(rootPath + floder + '/' + filename, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                res.json(400, err);
            } else {
                res.json(200, JSON.parse(data));
            }
        });
    } else {
        filename = filename.replace('.html', '');
        if (!docsLoadingState) {
            res.json(400, { message: 'docsDB not load ok' });
        } else {
            res.json(200, docsDB[floder][filename]);
        }
    }

}