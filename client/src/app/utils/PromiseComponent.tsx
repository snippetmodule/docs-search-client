
import * as React from 'react';
import { assignProperty } from './react-utils';

interface IParamType {
    [key: string]: any;
}
export interface IPromiseComponentProps {
    params?: IParamType;
    renderLoading?: () => JSX.Element;
    renderFailure?: (err: Error, reloadFun: () => any) => JSX.Element;
    renderFetched: (data: any, reloadFun: () => any) => JSX.Element;
    shouldContainerUpdate?: (IParamType) => boolean; // 第一次promise 请求后，prop 改变后，是否还要重新请求
    fragments: {
        [fragmentName: string]: (IParamType) => Promise<any>;
    };
}
interface IPromiseComponentState {
    [key: string]: any;
    err?: Error;
}
export class PromiseComponent extends React.Component<IPromiseComponentProps, IPromiseComponentState> {
    private fetching: boolean = false;
    private _mounted: boolean;

    public getFragment(fragmentName: string, params: IParamType) {
        if (!this.props.fragments[fragmentName]) {
            throw new Error('PromiseComponent has no ' + fragmentName + 'fragment');
        }

        params = Object.assign({}, this.props.params || {}, params || {});
        return this.props.fragments[fragmentName](params);
    }
    public async getAllFragments(params: IParamType, optionalFragmentNames: string[]) {
        let promises = [];
        optionalFragmentNames = optionalFragmentNames || [];
        Object.keys(this.props.fragments).forEach((fragmentName) => {
            if (optionalFragmentNames.length && optionalFragmentNames.indexOf(fragmentName) < 0) {
                return;
            }
            let promise = this.getFragment(
                fragmentName, params
            ).then((fragmentResult) => {
                return assignProperty({}, fragmentName, fragmentResult);
            }).catch(err => {
                throw err;
            });
            promises.push(promise);
        });
        return Promise.all(promises).then((fetchedFragments) => {
            return Object.assign.apply(null, fetchedFragments);
        });
    }

    public componentDidMount() {
        // Keep track of the mounted state manually, because the official isMounted() method
        // returns true when using renderToString() from react-dom/server.
        this._mounted = true;
        if (!this.fetching) {
            let missingFragments = this.missingFragments(false);
            if (missingFragments.length) {
                this.forceFetch({}, missingFragments);
            }
        }
    }
    public componentWillUnmount() {
        this._mounted = false;
    }
    public _isMounted() {
        // See the official `isMounted` discussion at https://github.com/facebook/react/issues/2787
        return !!this._mounted;
    }
    /**
     * @returns {Promise|Boolean}
     */
    public async forceFetch(nextPram: IParamType, optionalFragmentNames: string[] = []) {
        this.fetching = true;
        nextPram = nextPram || {};
        if (this.props.shouldContainerUpdate && Object.keys(nextPram).length) {
            if (!this.props.shouldContainerUpdate.call(this, nextPram)) {
                return Promise.resolve(null);
            }
        }
        try {
            let fetchedFragments = await this.getAllFragments(this.props.params, optionalFragmentNames);
            this.safeguardedSetState(Object.assign({ err: undefined }, fetchedFragments));
        } catch (_err) {
            this.safeguardedSetState({ err: _err });
        }
        this.fetching = false;
    }

    public safeguardedSetState(stateChanges: IPromiseComponentState) {
        if (!this._isMounted()) {
            return;
        }
        this.setState(stateChanges);
    }

    public missingFragments(nullAllowed): string[] {
        let state = this.state || {};
        let props = this.props || {};
        if (!Object.keys(this.props.fragments).length) {
            return [];
        }
        let missing: string[] = [];
        for (let fragmentName of Object.keys(this.props.fragments)) {
            if (props.hasOwnProperty(fragmentName) ||
                state.hasOwnProperty(fragmentName)) {
                if (nullAllowed) {
                    continue;
                }
                if (props[fragmentName] || state[fragmentName]) {
                    continue;
                }
            }
            missing.push(fragmentName);
        }
        return missing;
    }

    public componentWillMount() {
        let missingFragments = this.missingFragments(true);
        if (missingFragments.length) {
            this.forceFetch({}, missingFragments);
        }
    }

    public componentWillReceiveProps(nextProps: IPromiseComponentProps) {
        this.forceFetch(nextProps.params);
    }
    private reload() {
        if (this._isMounted) {
            this.state = {};
            this.forceUpdate();
            this.forceFetch(this.props.params);
        }
    }
    public render() {
        // Don't render without data.
        if (this.state && this.state.err) {
            console.log(`PromiseComponent err：${this.state.err.stack}`);
            return (this.props.renderFailure && this.props.renderFailure(this.state.err, this.reload.bind(this))) || null;
        } else if (this.missingFragments(true).length) {
            return (this.props.renderLoading && this.props.renderLoading()) || null;
        } else {
            return this.props.renderFetched(this.state, this.reload.bind(this));
        }
    }
};