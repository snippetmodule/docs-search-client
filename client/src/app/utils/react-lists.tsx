import * as React from 'react';

interface IReactListProps {
    itemRenderer: (index, key) => JSX.Element;
    length: number;
}
interface IReactListState {
    scrollPosition: number;
}
export default class ReactList extends React.Component<IReactListProps, IReactListState> {
    public state: IReactListState = { scrollPosition: 0 };

    private mListRef: Element;
    public scroolToPosition(position: number) {
        if (position < this.state.scrollPosition) {
            this.setState({ scrollPosition: position });
            return;
        }
        let nextSeletexItem: any = this.mListRef.childNodes[position];
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
            <section ref={ref => {
                this.mListRef = ref;
            } } className="_sidebar" tabIndex="-1" style={{ width: '18.6rem' }}>
                {items}
            </section>
        );
    }
};