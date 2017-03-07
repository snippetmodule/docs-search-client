const localForage: LocalForage = require('localforage');

const localStorage: LocalForage = localForage.createInstance({
    driver: localForage.LOCALSTORAGE, // Force WebSQL; same as using setDriver()
    name: 'docs',
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
    description: 'docs localStorage description',
});
const webSql: LocalForage = localForage.createInstance({
    driver: localForage.WEBSQL, // Force WebSQL; same as using setDriver()
    name: 'docs',
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
    description: 'docs localStorage description',
});
const indexDB: LocalForage = localForage.createInstance({
    driver: localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name: 'docs',
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
    description: 'docs localStorage description',
});
export { localStorage, webSql, indexDB }
