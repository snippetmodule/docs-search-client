import Fuse = require('fuse.js');

interface ISearchItem {
    name: string;
    author?: {
        firstName: string,
        lastName: string
    };
}

class Searcher<T> {
    private fuseOption = {
        caseSensitive: false,
        // include: ['matches', 'score'],
        shouldSort: true,
        tokenize: false,
        threshold: 0.6,
        location: 0,
        distance: 99,
        maxPatternLength: 32,
        keys: [''],
        // keys: ['name', 'author.firstName'],
    };
    private fuse;

    constructor(private mList: T[], private keys: string[]) {
        this.reset(this.mList);
    }
    public reset(mList: T[]) {
        this.fuseOption.keys = this.keys;
        this.fuse = new Fuse(this.mList, this.fuseOption);
    }
    public search(input: string): T[] {
        return this.fuse.search(input);
    }
}
export {Searcher}