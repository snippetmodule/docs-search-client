
export type DocsModelEntriyType = {
    name: string,
    path: string,
    type: string,
};
export type DocsModelTypeType = {
    name: string,
    slug: string,
    count: number,
    childs?: DocsModelEntriyType[],
};
export type DocsModel = {
    key: string,
    value: {
        entries: DocsModelEntriyType[],
        types: DocsModelTypeType[]
    }
};

export interface ISearchResultItem {
    name: string;
    path?: string;
    type?: string;
    slug?: string;
    count?: number;
    childs?: DocsModelEntriyType[];
}