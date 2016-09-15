import * as React from 'react';

interface IReactListProps {
    itemRenderer: (index, key) => JSX.Element;
    length: number;
}

export default class ReactList extends React.Component<IReactListProps, void> {
    private mListRef: Element;
    public scroolToPosition(position: number) {
        let nextSeletexItem: any = this.mListRef.childNodes[0].childNodes[position];
        if (!nextSeletexItem) {
            return;
        }
        if (nextSeletexItem.offsetTop - this.mListRef.scrollTop > this.mListRef.clientHeight) {
            this.mListRef.scrollTop = nextSeletexItem.offsetTop - this.mListRef.clientHeight / 2;
        }
    }
    public render() {
        let items = [];
        for (let index = 0; index < this.props.length; index++) {
            items.push(this.props.itemRenderer(index, index));
        }
        return (
            <section ref={ref => { this.mListRef = ref; } } className="_sidebar" tabIndex="-1" >
                <div role="navigation" className="_list _resizer-left-div">
                    {items}
                </div>
                <div className="_sidebar-footer _resizer-left-div" style={{ display: 'none' }}>
                    <button type="button" className="_sidebar-footer-link _sidebar-footer-edit" data-pick-docs="">Select documentation</button>
                    <button type="button" className="_sidebar-footer-link _sidebar-footer-light" title="Toggle light" data-light="">Toggle light</button>
                    <button type="button" className="_sidebar-footer-link _sidebar-footer-layout" title="Toggle layout" data-layout="">Toggle layout</button>
                </div>
            </section>
        );
    }
};