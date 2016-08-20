import {Docs} from './Docs';

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
    docs_host: '/docs',
    env: 'development',
    history_cache_size: 10,
    index_path: '/docs',
    max_results: 50,
    production_host: 'www.devdocs.me',
    search_param: 'q',
    sentry_dsn: '',
    version: '1450281649',
};

let app = {
    htmlConfig: htmlConfig,
    docConfig: docConfig,
    docs: new Docs(),
};
export default app;