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
// ReactCreateClass 中copy 出来的
/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
export function createMergedResultFunction(one, two) {
    return function mergedResult() {
        let a = one;
        let b = two;
        if (a == null) {
            return b;
        } else if (b == null) {
            return a;
        }
        let c = {};
        mergeIntoWithNoDuplicateKeys(c, a);
        mergeIntoWithNoDuplicateKeys(c, b);
        return c;
    };
}
/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeIntoWithNoDuplicateKeys(one, two) {

    for (let key in two) {
        if (two.hasOwnProperty(key)) {
            one[key] = two[key];
        }
    }
    return one;
}
