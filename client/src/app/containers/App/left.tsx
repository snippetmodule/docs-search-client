
import * as React from 'react';
import { ISearchItem, IDocInfo } from '../../core/model';
import { DefaultList } from './DefaultList';
import { SearchResultList } from './SearchResultList';
import * as appConfig from '../../config';

interface ISearchState {
    input: string;
    isSearch: boolean;
    error?: boolean;
    message?: Array<ISearchItem>;
}
class Left extends React.Component<any, ISearchState> {
    private mSearchResultListRef: SearchResultList;

    private enableDocs(selectedPath: string, docInfo: IDocInfo) {
        appConfig.default.selectedPath = selectedPath;
        appConfig.default.docs.addDoc(docInfo).then((res) => {
            this.setState({ input: '' });
        }).catch(err => console.log('enableDoc err:' + docInfo.slug + err.stack));
    }
    private setSelectDoc(selectedPath: string) {
        appConfig.default.selectedPath = selectedPath;
        this.setState({ input: '' });
    }

    public getSearchTag(): { name: string, slug: string } {
        if (!this.state.message || !this.mSearchResultListRef) {
            return null;
        }
        return this.mSearchResultListRef.getSearchTag(this.state.input);
    }
    public keyEnterHandler() {
        if (!this.state.message || !this.mSearchResultListRef) {
            return null;
        }
        return this.mSearchResultListRef.keyEnterHandler();
    }
    public render() {
        if (!this.state || !this.state.input) {
            return (<DefaultList {...this.props} />);
        }
        if (this.state.error) {
            return (<div> {this.state.error} </div>);
        }
        return (
            <SearchResultList ref={ref => this.mSearchResultListRef = ref}
                enableDocs={this.enableDocs.bind(this)}
                setSelectDoc={this.setSelectDoc.bind(this)}
                searchResult={this.state.message} />
        );
    }

}

export { Left }
