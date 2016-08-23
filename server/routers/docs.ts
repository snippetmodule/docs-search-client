import * as restify from 'restify';
import * as fs from 'fs-extra';

export function getDocs(req: restify.Request, res: restify.Response, next: restify.Next) {
    let floder = req.params.floder;
    let filename = req.params.filename;
    fs.readFile('../api-docs/' + floder + '/' + filename, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            res.json(400, err);
        } else {
            res.json(200, JSON.parse(data));
        }
    });
}