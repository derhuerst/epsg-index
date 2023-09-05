// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module'
const require = createRequire(import.meta.url)

import test from 'tape'

const epsg4326 = require('./s/4326.json')
const all = require('./all.json')

test('EPSG:4326 a.k.a WGS 84', (t) => {
	t.ok(epsg4326)
	t.equal(epsg4326.code, '4326')
	t.equal(epsg4326.kind, 'CRS-GEOGCRS')
	t.ok(epsg4326.name)
	t.ok(epsg4326.wkt)
	t.ok(epsg4326.proj4)
	t.ok(epsg4326.unit)
	t.ok(epsg4326.area)
	t.deepEqual(epsg4326.bbox, [90, -180, -90, 180])
	t.ok('accuracy' in epsg4326)

	t.end()
})

const looksValid = (t, cs) => {
	t.ok(cs)

	t.equal(typeof cs.code, 'string')
	t.ok(cs.code)
	t.equal(typeof cs.kind, 'string', cs.code)
	t.ok(cs.kind, cs.code)
	t.equal(typeof cs.name, 'string', cs.code)
	t.ok(cs.name, cs.code)

	if (cs.wkt) t.equal(typeof cs.wkt, 'string', cs.code)
	if (cs.proj4) t.equal(typeof cs.proj4, 'string', cs.code)

	if (cs.bbox) {
		t.ok(Array.isArray(cs.bbox), cs.code)
		t.equal(cs.bbox.length, 4, cs.code)
	}
	if (cs.unit) t.equal(typeof cs.unit, 'string', cs.code)
	if (cs.area) t.equal(typeof cs.area, 'string', cs.code)
	if (cs.accuracy) t.equal(typeof cs.accuracy, 'number', cs.code)
}

test('all', (t) => {
	for (let code in all) {
		looksValid(t, all[code])
	}
	t.end()
})
