import * as React from 'react';

interface IReactListProps {
    itemRenderer: (index, key) => JSX.Element;
    itemHeight: number;
    length: number;
}

interface IReactListState {
    forceSelectedIndex: number;
    from: number;
    to: number; // 当前列表显示的开始位置,和结束位置 
}
export default class ReactList extends React.Component<IReactListProps, IReactListState> {
    public state = { from: 0, to: 0, forceSelectedIndex: -1 };
    private mListRef: Element;
    private mCacheLists: JSX.Element[] = [];

    public componentWillReceiveProps(nextProps: IReactListProps, nextContext: any) {
        this.mCacheLists.splice(0);
    }
    public componentDidUpdate(prevProps: IReactListProps, prevState: IReactListState, prevContext: any): void {
        if (this.state.forceSelectedIndex !== -1) {
            this.mListRef.scrollTop = this.props.itemHeight * this.state.from;
        }
    }
    public componentDidMount() {
        window.addEventListener('resize', this.updateScrollPosition.bind(this));
        this.mListRef.addEventListener('scroll', this.updateScrollPosition.bind(this));
        this.updateScrollPosition();
    }
    public componentWillUnmount() {
        window.removeEventListener('resize', this.updateScrollPosition.bind(this));
        this.mListRef.removeEventListener('scroll', this.updateScrollPosition.bind(this));
    }
    public updateScrollPosition() {
        if (!this.mListRef) {
            return;
        }
        let newScrollPosition = Math.ceil(this.mListRef.scrollTop / this.props.itemHeight);
        let _to = newScrollPosition + Math.floor(this.mListRef.clientHeight / this.props.itemHeight);
        this.setState({ from: newScrollPosition, to: _to, forceSelectedIndex: -1 });
    }
    public scroolToPosition(position: number) {
        let nextSeletexItem: any = this.mListRef.childNodes[0].childNodes[position];
        if (nextSeletexItem
            && nextSeletexItem.offsetTop >= this.mListRef.scrollTop
            && nextSeletexItem.offsetTop <= this.mListRef.scrollTop + this.mListRef.clientHeight) {
            // 在显示区域 已显示,无需做滚动处理
            return;
        }
        let _to = position + Math.ceil(this.mListRef.clientHeight / this.props.itemHeight);
        _to = _to > this.props.length ? this.props.length - 1 : _to;
        this.setState({ from: position, to: _to, forceSelectedIndex: position });
    }
    private getCurrentItems() {
        let { to } = this.state;
        if (this.mCacheLists.length < to) {
            for (let index = this.mCacheLists.length; index <= to && index < this.props.length; index++) {
                this.mCacheLists.push(this.props.itemRenderer(index, index));
            }
        }
        return this.mCacheLists.slice(0, to + 1);
    }
    public render() {
        let items = this.getCurrentItems();
        return (
            <section ref={ref => { this.mListRef = ref; } } className="_sidebar" tabIndex={-1} >
                {
                    this.props.length === 0
                        ? <div role="navigation" className="_list _resizer-left-div" style={{ height: '100%' }}>
                           <div style={{ textAlign: 'center' }}>没有搜到.</div>
                        </div>
                        :
                        <div role="navigation" className="_list _resizer-left-div" style={{ height: this.props.length * this.props.itemHeight }}>
                            {items}
                        </div>
                }
                <div className="_sidebar-footer _resizer-left-div" style={{ display: 'none' }}>
                    <button type="button" className="_sidebar-footer-link _sidebar-footer-edit" data-pick-docs="">Select documentation</button>
                    <button type="button" className="_sidebar-footer-link _sidebar-footer-light" title="Toggle light" data-light="">Toggle light</button>
                    <button type="button" className="_sidebar-footer-link _sidebar-footer-layout" title="Toggle layout" data-layout="">Toggle layout</button>
                </div>
            </section>
        );
    }
};