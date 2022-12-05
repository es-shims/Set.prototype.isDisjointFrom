'use strict';

var $Set = require('es-set/polyfill')();
var forEach = require('for-each');
var v = require('es-value-fixtures');
var debug = require('object-inspect');

module.exports = function (isDisjointFrom, t) {
	t.test('throws on non-set receivers', function (st) {
		forEach(v.primitives.concat(v.objects), function (nonSet) {
			st['throws'](
				function () { isDisjointFrom(nonSet, {}); },
				TypeError,
				debug(nonSet) + ' is not a Set'
			);
		});

		st.end();
	});

	t.test('non-Setlike `other`', function (st) {
		var set = new $Set([1, 2]);

		forEach(v.primitives, function (primitive) {
			st['throws'](
				function () { isDisjointFrom(set, primitive); },
				TypeError,
				debug(primitive) + ' is not a Set-like'
			);
		});

		st.test('unable to get a Set Record', function (s2t) {
			forEach(v.objects, function (nonSetlike) {
				s2t['throws'](
					function () { isDisjointFrom(set, nonSetlike); },
					TypeError,
					debug(nonSetlike) + ' is an Object, but is not Set-like'
				);
			});

			forEach([NaN, 'NaN'], function (nonNumber) {
				var nanSizedSetlike = {
					has: function () {},
					keys: function () {},
					size: nonNumber
				};
				s2t['throws'](
					function () { isDisjointFrom(set, nanSizedSetlike); },
					TypeError,
					debug(nanSizedSetlike) + ' has a NaN `.size`'
				);
			});

			forEach(v.nonFunctions, function (nonFunction) {
				var badHas = {
					has: nonFunction,
					keys: function () {},
					size: 0
				};
				var badKeys = {
					has: function () {},
					keys: nonFunction,
					size: 0
				};

				s2t['throws'](
					function () { isDisjointFrom(set, badHas); },
					TypeError,
					debug(badHas) + ' has a non-callable `.has`'
				);
				s2t['throws'](
					function () { isDisjointFrom(set, badKeys); },
					TypeError,
					debug(badKeys) + ' has a non-callable `.keys`'
				);
			});

			s2t.end();
		});

		st.end();
	});

	t.test('disjoint sets', function (st) {
		var set1 = new $Set([1, 2, 3]);
		var set2 = new $Set([4, 5, 6]);
		var set3 = new $Set([1, 2, 3, 4, 5, 6]);

		st.equal(
			isDisjointFrom(set1, set2),
			true,
			debug(set1) + ' is disjoint from ' + debug(set2)
		);
		st.equal(
			isDisjointFrom(set2, set1),
			true,
			debug(set2) + ' is disjoint from ' + debug(set1)
		);
		st.equal(
			isDisjointFrom(set3, set1),
			false,
			debug(set3) + ' is not disjoint from ' + debug(set1)
		);
		st.equal(
			isDisjointFrom(set3, set2),
			false,
			debug(set3) + ' is not disjoint from ' + debug(set2)
		);

		st.end();
	});

	return t.comment('tests completed');
};
