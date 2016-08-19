
// import LocalForage from 'localforage';
// import * as AppConfig from'./AppConfig';
// import * as Cookies from 'js-cookie';

// interface IConfig {
//     count: number;
//     hideDisabled: boolean;
//     hideIntro: boolean;
//     news: number;
//     autoUpdate: boolean;
// }
// class Settings {
//     private SETTINGS_KEY = 'settings';
//     private DOCS_KEY = 'docs';
//     private DARK_KEY = 'dark';
//     private LAYOUT_KEY = 'layout';
//     private SIZE_KEY = 'size';

//     private config: IConfig = {
//         count: 0,
//         hideDisabled: false,
//         hideIntro: false,
//         news: 0,
//         autoUpdate: true,
//     };
//     constructor(private mStore: LocalForage) {
//         this.mStore.getItem(this.SETTINGS_KEY).then(temp => {
//             if (!temp) {
//                 //this.applyLegacyValues(this.config); //用默认值
//                 this.save();
//             } else {
//                 this.config = <Config>temp;
//             }
//         });
//     }

//     // public applyLegacyValues(config) {
//     //     let key, v, value;
//     //     for (key in config) {
//     //         v = config[key];
//     //         if (!((value = this.mStore.get(key)) != null)) {
//     //             continue;
//     //         }
//     //         config[key] = value;
//     //         this.mStore.del(key);
//     //     }
//     // };


//     public save() {
//         return this.mStore.setItem(this.SETTINGS_KEY, this.config);
//     };

//     public set(key, value) {
//         this.config[key] = value;
//         return this.save();
//     };

//     public get(key) {
//         return this.config[key];
//     };

//     public hasDocs() {
//         return !!Cookies.get(this.DOCS_KEY);
//     };
//     public getDocs() {
//         return ((ref = Cookies.get(this.DOCS_KEY)) != null ? ref.split('/') : void 0) || AppConfig.default_docs;
//     };

//     public setDocs = function (docs) {
//         Cookies.set(this.DOCS_KEY, docs.join('/'), {
//             path: '/',
//             expires: 1e8,
//         });
//     };

//     public setDark(value) {
//         if (value) {
//             Cookies.set(this.DARK_KEY, '1', {
//                 path: '/',
//                 expires: 1e8,
//             });
//         } else {
//             Cookies.remove(this.DARK_KEY);
//         }
//     };

//     public setLayout(value) {
//         if (value) {
//             Cookies.set(this.LAYOUT_KEY, value, {
//                 path: '/',
//                 expires: 1e8,
//             });
//         } else {
//             Cookies.remove(this.LAYOUT_KEY);
//         }
//     };
//     public setSize(value) {
//         Cookies.set(this.SIZE_KEY, value, {
//             path: '/',
//             expires: 1e8,
//         });
//     };

//     public reset(): void {
//         Cookies.remove(this.DOCS_KEY);
//         Cookies.remove(this.DARK_KEY);
//         Cookies.remove(this.LAYOUT_KEY);
//         Cookies.remove(this.SIZE_KEY);
//         Cookies.remove(this.SETTINGS_KEY);
//     }

// }
// export {Settings}