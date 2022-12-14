'use strict';

var GetIntrinsic = require('get-intrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $Set = require('es-set/polyfill')();

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

var callBind = require('call-bind');
var callBound = require('call-bind/callBound');

var $nativeSetForEach = callBound('Set.prototype.forEach', true);
var $polyfillSetForEach = callBind($Set.prototype.forEach);
var $setForEach = function (set, callback) {
	if ($nativeSetForEach) {
		try {
			return $nativeSetForEach(set, callback);
		} catch (e) { /**/ }
	}
	return $polyfillSetForEach(set, callback);
};

var $nativeSetHas = callBound('Set.prototype.has', true);
var $polyfillSetHas = callBind($Set.prototype.has);
var $setHas = function (set, key) {
	if ($nativeSetHas) {
		try {
			return $nativeSetHas(set, key);
		} catch (e) { /**/ }
	}
	return $polyfillSetHas(set, key);
};

var $nativeSetSize = callBound('Set.prototype.size', true);
var $polyfillSetSize = gOPD ? callBind(gOPD($Set.prototype, 'size').get) : null;
var legacySetSize = function setSize(set) {
	var count = 0;
	$setForEach(set, function () {
		count += 1;
	});
	return count;
};
var setSize = function (S) {
	if ($nativeSetSize) {
		try {
			return $nativeSetSize(S);
		} catch (e) { /**/ }
	}
	return $polyfillSetSize ? $polyfillSetSize(S) : legacySetSize(S);
};

module.exports = function isDisjointFrom(other) {
	var O = this; // step 1

	// RequireInternalSlot(O, [[SetData]]); // step 2
	if (!isSet(O) && !(O instanceof $Set)) {
		throw new $TypeError('Method Set.prototype.isDisjointFrom called on incompatible receiver ' + O);
	}

	var otherRec = GetSetRecord(other); // step 3

	var thisSize = setSize(O); // step 4

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
