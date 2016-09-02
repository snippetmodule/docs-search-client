import {Docs} from './core/Docs';
import {DocsSetting} from './core/DocsSetting';
import {IDocInfo} from './core/model';
let _htmlConfig = {
    env: process.env.NODE_ENV || 'development',
    isDevelopment: this.env === 'development' ? true : false,

    // This part goes to React-Helmet for Head of our HTML
    app: {
        head: {
            title: 'docs-search-client',
            titleTemplate: 'docs-search-client: %s',
            meta: [
                { charset: 'utf-8' },
                { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
                { name: 'viewport', content: 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0' },
                { name: 'description', content: 'React Redux Typescript' },
            ],
        },
    },
};

let DOCS = require('../../../api-docs/list.js').DOCS;

let app = {
    htmlConfig: _htmlConfig,
    docSetting: new DocsSetting(),
    docs: new Docs(DOCS),
    init: async function () {
        await this.docs.init();
    },
    enableDoc: async function (docInfo: IDocInfo) {
        await this.docSetting.addDoc(docInfo);
        await this.docs.init();
    },
    disableDoc: async function (docInfo: IDocInfo) {
        await this.docSetting.removeDoc(docInfo);
        await this.docs.init();
    },
};

export default app;