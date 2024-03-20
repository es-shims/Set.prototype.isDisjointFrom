'use strict';

var $TypeError = require('es-errors/type');

var $Set = require('es-set/polyfill')();

var Call = require('es-abstract/2024/Call');
var GetIteratorFromMethod = require('es-abstract/2024/GetIteratorFromMethod');
var GetSetRecord = require('./aos/GetSetRecord');
var IteratorClose = require('es-abstract/2024/IteratorClose');
var IteratorStep = require('es-abstract/2024/IteratorStep');
var IteratorValue = require('es-abstract/2024/IteratorValue');
var NormalCompletion = require('es-abstract/2024/NormalCompletion');
var SetDataSize = require('./aos/SetDataSize');
var ToBoolean = require('es-abstract/2024/ToBoolean');

var isSet = require('is-set');

var tools = require('es-set/tools');
var $setForEach = tools.forEach;
var $setHas = tools.has;
var $setSize = tools.size;

module.exports = function isDisjointFrom(other) {
	var O = this; // step 1

	// RequireInternalSlot(O, [[SetData]]); // step 2
	if (!isSet(O) && !(O instanceof $Set)) {
		throw new $TypeError('Method Set.prototype.isDisjointFrom called on incompatible receiver ' + O);
	}

	var otherRec = GetSetRecord(other); // step 3

	var thisSize = SetDataSize(O); // step 4

	if (thisSize <= otherRec['[[Size]]']) { // step 5
		try {
			$setForEach(O, function (e) {
				var index = 0; // step 5.a
				if (index < thisSize) { // step 5.a.i
					index += 1; // step 5.a.ii
					var inOther = ToBoolean(Call(otherRec['[[Has]]'], otherRec['[[Set]]'], [e])); // step 5.b.iii.1
					if (inOther) {
						// eslint-disable-next-line no-throw-literal
						throw false; // step 5.b.iii.2, kinda
					}
					thisSize += $setSize(O); // step 5.b.iii.4
				}
			});
		} catch (e) {
			if (e === false) {
				return false; // step 5.b.iii.2, the rest
			}
			throw e;
		}
	} else { // step 6
		var keysIter = GetIteratorFromMethod(otherRec['[[Set]]'], otherRec['[[Keys]]']); // step 6.a
		var next = true; // step 6.b
		while (next) { // step 6.c
			next = IteratorStep(keysIter); // step 6.c.i
			if (next) { // step 6.c.ii
				var nextValue = IteratorValue(next); // step 6.c.ii.1
				// if (SetDataHas(O.[[SetData]], nextValue)) { // step 6.c.ii.2
				if ($setHas(O, nextValue)) {
					IteratorClose(keysIter, NormalCompletion()); // step 6.c.ii.2.a
					return false; // step 6.c.ii.2.b
				}
			}
		}
	}

	return true; // step 7
};
