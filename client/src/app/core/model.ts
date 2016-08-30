export type DocsModelEntriyType = {
    name: string,
    path: string,
    type: string,
    doc?: IDocInfo,
};
export type DocsModelTypeType = {
    name: string,
    slug: string,
    count: number,
    doc?: IDocInfo,
    childs?: DocsModelEntriyType[],
};

export interface IDocInfo {
    name: string;
    slug: string;
    type: string;
    version: string;
    release: string;
    links?: { home?: string; code?: string };
    mtime: number;
    db_size: number;
    storeValue?: {
        entries: DocsModelEntriyType[],
        types: DocsModelTypeType[]
    };
}

export interface ISearchResultItem {
    name: string;
    doc: IDocInfo;
    path?: string;
    type?: string;
    slug?: string;
    count?: number;
    childs?: DocsModelEntriyType[];
}