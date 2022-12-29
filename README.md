# set.prototype.isdisjointfrom <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

ES Proposal spec-compliant shim for Set.prototype.isDisjointFrom. Invoke its "shim" method to shim `Set.prototype.isDisjointFrom` if it is unavailable or noncompliant.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment, and complies with the [proposed spec](https://github.com/tc39/proposal-set-methods). When shimmed, it uses [`es-set`](https://npmjs.com/es-set) to shim the `Set` implementation itself if needed.

Most common usage:
```js
var assert = require('assert');
var isDisjointFrom = require('set.prototype.isdisjointfrom');

var set1 = new Set([1, 2]);
var set2 = new Set([2, 3]);
var set3 = new Set([1]);

assert.equal(isDisjointFrom(set1, set2), false);
assert.equal(isDisjointFrom(set2, set1), false);
assert.equal(isDisjointFrom(set1, set3), false);
assert.equal(isDisjointFrom(set2, set3), true);
assert.equal(isDisjointFrom(set3, set2), true);

isDisjointFrom.shim();

assert.equal(set1.isDisjointFrom(set2), false);
assert.equal(set2.isDisjointFrom(set1), false);
assert.equal(set1.isDisjointFrom(set3), false);
assert.equal(set2.isDisjointFrom(set3), true);
assert.equal(set3.isDisjointFrom(set2), true);
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

## Set Method Packages
 - [union](https://npmjs.com/set.prototype.union)
 - [intersection](https://npmjs.com/set.prototype.intersection)
 - [difference](https://npmjs.com/set.prototype.difference)
 - [symmetricDifference](https://npmjs.com/set.prototype.symmetricdifference)
 - [isSubsetOf](https://npmjs.com/set.prototype.issubsetof)
 - [isSupersetOf](https://npmjs.com/set.prototype.issupersetof)
 - [isDisjointFrom](https://npmjs.com/set.prototype.isdisjointfrom)

[package-url]: https://npmjs.com/package/set.prototype.isdisjointfrom
[npm-version-svg]: http://versionbadg.es/es-shims/Set.prototype.isDisjointFrom.svg
[deps-svg]: https://david-dm.org/es-shims/Set.prototype.isDisjointFrom.svg
[deps-url]: https://david-dm.org/es-shims/Set.prototype.isDisjointFrom
[dev-deps-svg]: https://david-dm.org/es-shims/Set.prototype.isDisjointFrom/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Set.prototype.isDisjointFrom#info=devDependencies
[testling-svg]: https://ci.testling.com/es-shims/Set.prototype.isDisjointFrom.png
[testling-url]: https://ci.testling.com/es-shims/Set.prototype.isDisjointFrom
[npm-badge-png]: https://nodei.co/npm/set.prototype.isdisjointfrom.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/set.prototype.isdisjointfrom.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/set.prototype.isdisjointfrom.svg
[downloads-url]: http://npm-stat.com/charts.html?package=set.prototype.isdisjointfrom
[codecov-image]: https://codecov.io/gh/es-shims/Set.prototype.isDisjointFrom/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/es-shims/Set.prototype.isDisjointFrom/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/es-shims/Set.prototype.isDisjointFrom
[actions-url]: https://github.com/es-shims/Set.prototype.isDisjointFrom/actions
