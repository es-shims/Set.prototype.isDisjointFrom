'use strict';

var GetIntrinsic = require('get-intrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $Set = require('es-set/polyfill')();

var isNativeSet = typeof Set === 'function' && $Set === Set;

var Call = require('es-abstract/2022/Call');
var IteratorClose = require('es-abstract/2022/IteratorClose');
var IteratorStep = require('es-abstract/2022/IteratorStep');
var IteratorValue = require('es-abstract/2022/IteratorValue');
var NormalCompletion = require('es-abstract/2022/NormalCompletion');
var ToBoolean = require('es-abstract/2022/ToBoolean');

var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');

var GetKeysIterator = require('./aos/GetKeysIterator');
var GetSetRecord = require('./aos/GetSetRecord');

var isSet = require('is-set');

var callBind = isNativeSet || require('call-bind'); // eslint-disable-line global-require
var callBound = isNativeSet && require('call-bind/callBound'); // eslint-disable-line global-require

var $setForEach = isNativeSet ? callBound('Set.prototype.forEach') : callBind($Set.prototype.forEach);
var $setHas = isNativeSet ? callBound('Set.prototype.has') : callBind($Set.prototype.has);
var $setSize = isNativeSet ? callBound('Set.prototype.size') : gOPD ? callBind(gOPD($Set.prototype, 'size').get) : function setSize(set) {
	var count = 0;
	$setForEach(set, function () {
		count += 1;
	});
	return count;
};

module.exports = function isDisjointFrom(other) {
	var O = this; // step 1

	// RequireInternalSlot(O, [[SetData]]); // step 2
	if (!isSet(O) && !(O instanceof $Set)) {
		throw new $TypeError('Method Set.prototype.isDisjointFrom called on incompatible receiver ' + O);
	}

	var otherRec = GetSetRecord(other); // step 3

	var thisSize = $setSize(O); // step 4

	if (thisSize <= otherRec['[[Size]]']) { // step 5
		try {
			$setForEach(O, function (e) {
				var inOther = ToBoolean(Call(otherRec['[[Has]]'], otherRec['[[Set]]'], [e])); // step 6.a
				if (inOther) {
					// eslint-disable-next-line no-throw-literal
					throw false; // step 5.a.2, kinda
				}
			});
		} catch (e) {
			if (e === false) {
				return false; // step 5.a.2, the rest
			}
			throw e;
		}
	} else { // step 6
		var keysIter = GetKeysIterator(otherRec); // step 6.a
		var next = true; // step 6.b
		while (next) { // step 6.c
			next = IteratorStep(keysIter['[[Iterator]]']); // step 6.c.i
			if (next) { // step 6.c.ii
				var nextValue = IteratorValue(next); // step 6.c.ii.1
				// if (SetDataHas(O.[[SetData]], nextValue)) { // step 6.c.ii.2
				if ($setHas(O, nextValue)) {
					IteratorClose(keysIter['[[Iterator]]'], NormalCompletion());
					return false;
				}
			}
		}
	}

	return true; // step 7
};
