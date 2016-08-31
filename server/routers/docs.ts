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

export function getDocs(req: restify.Request, res: restify.Response, next: restify.Next) {
    let floder:string = req.params.floder;
    let filename:string = req.params.filename;
    if (filename === 'db.json' || filename === 'index.html' || filename === 'index.json') {
        fs.readFile(rootPath + floder + '/' + filename, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                res.json(400, err);
            } else {
                res.writeHead(200, {
                    'Content-Type': filename.endsWith('.html') ? 'application/json' : 'text/html',
                });
                res.write(data);
                res.end();
            }
        });
    } else {
        filename = filename.replace('.html', '');
        if (!docsLoadingState) {
            res.json(400, { message: 'docsDB not load ok' });
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html',
            });
            res.write(docsDB[floder][filename]);
            res.end();
        }
    }

}