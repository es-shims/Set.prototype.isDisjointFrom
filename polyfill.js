'use strict';

var Set = require('es-set/polyfill')();

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	if (typeof Set.prototype.isDisjointFrom === 'function') {
		var called = false;
		var setLike = {
			size: Infinity,
			has: function () {},
			keys: function () {
				called = true;
				return [].values();
			}
		};

		new Set([1]).isDisjointFrom(setLike);
		setLike.size = 2147483648; // 2 ** 31
		new Set([1]).isDisjointFrom(setLike);

		if (!called) {
			return Set.prototype.isDisjointFrom;
		}
	}
	return implementation;
};
