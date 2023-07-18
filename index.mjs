import callBind from 'call-bind';
import RequireObjectCoercible from 'es-abstract/2023/RequireObjectCoercible.js';

import getPolyfill from 'set.prototype.isdisjointfrom/polyfill';

const bound = callBind(getPolyfill());

export default function isDisjointFrom(set, other) {
	RequireObjectCoercible(set);
	return bound(set, other);
}

export { default as getPolyfill } from 'set.prototype.isdisjointfrom/polyfill';
export { default as implementation } from 'set.prototype.isdisjointfrom/implementation';
export { default as shim } from 'set.prototype.isdisjointfrom/shim';
