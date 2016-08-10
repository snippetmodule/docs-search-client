
export type DocsModelEntriyType = {
    name: string,
    path: string,
    type: string,
};
export type DocsModelTypeType = {
    name: string,
    path: string,
    type: string,
};
export type DocsModel = {
    key: string, value: {
        entries: DocsModelEntriyType[],
        types: DocsModelTypeType[]
    }
};
