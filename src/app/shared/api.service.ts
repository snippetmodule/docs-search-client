import {Injectable} from '@angular/core';
const localforage:LocalForage = require('localforage');

@Injectable()
export class ApiService {
    title = 'Angular 2';
    localStorage:LocalForage = localforage.createInstance({
        driver: localforage.LOCALSTORAGE,
        version: '0.1',
        size: 4980736
    });
    indexedDB:LocalForage = localforage.createInstance({
        driver: localforage.INDEXEDDB,
        name: 'docs',
        version: '0.1',
        size: 4980736
    });
}
