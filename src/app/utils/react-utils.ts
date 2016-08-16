import * as React from 'react';
import * as ReactDOM from 'react-dom';

export function isMounted(component: React.ReactInstance) {
    try {
        ReactDOM.findDOMNode(component);
        return true;
    } catch (e) {
        // Error: Invariant Violation: Component (with keys: props,context,state,refs,_reactInternalInstance) contains `render` method but is not mounted in the DOM
        return false;
    }
}