'use strict';

var getPolyfill = require('./polyfill');
var define = require('define-properties');
var shimSet = require('es-set/shim');

module.exports = function shimSetIsDisjointFrom() {
	shimSet();

	var polyfill = getPolyfill();
	define(
		Set.prototype,
		{ isDisjointFrom: polyfill },
		{ isDisjointFrom: function () { return Set.prototype.isDisjointFrom !== polyfill; } }
	);

	return polyfill;
};
