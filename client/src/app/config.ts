import {Docs} from './core/Docs';
import {DocsSetting} from './core/DocsSetting';

let htmlConfig = {
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

export interface IDocInfo {
    name: string;
    slug: string;
    type: string;
    version: string;
    index_path: string;
    db_path: string;
    links: { home?: string };
    mtime: number;
    db_size: number;
}

let {DOCS} = require('../../../api-docs/list.js');

let app = {
    htmlConfig: htmlConfig,
    docSetting: new DocsSetting(),
    docs: new Docs(),
    docInfos: DOCS,
};

export default app;