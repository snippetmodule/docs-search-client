import {Docs} from './core/Docs';

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

let docConfig = {
    default_docs: ['css', 'dom', 'dom_events', 'html', 'http', 'javascript'],
    docs_host: 'http://127.0.0.1:8081/docs/',
    env: 'development',
    history_cache_size: 10,
    index_path: '/docs',
    max_results: 50,
    production_host: 'www.devdocs.me',
    search_param: 'q',
    sentry_dsn: '',
    version: '1450281649',
};

interface IDocInfo {
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

let docInfos: IDocInfo[] = require('../../../api-docs/list.json');

let app = {
    htmlConfig: htmlConfig,
    docConfig: docConfig,
    docs: new Docs(),
    docInfos: docInfos,
};

export default app;