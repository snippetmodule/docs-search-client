
export type DocsModelEntriyType = {
    name: string,
    path: string,
    type: string,
    doc?: DocsModel,
};
export type DocsModelTypeType = {
    name: string,
    slug: string,
    count: number,
    doc?: DocsModel,
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
    doc: DocsModel;
    path?: string;
    type?: string;
    slug?: string;
    count?: number;
    childs?: DocsModelEntriyType[];
}