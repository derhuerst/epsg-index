'use strict'

const test = require('tape')

const epsg4326 = require('./s/4326.json')
const all = require('./all.json')

test('EPSG:4326 a.k.a WGS 84', (t) => {
	t.ok(epsg4326)
	t.equal(epsg4326.code, '4326')
	t.equal(epsg4326.kind, 'geographic 2D')

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

	if (cs.remark !== null) {
		t.equal(typeof cs.remark, 'string', cs.code)
		t.ok(cs.remark, cs.code)
	}

	t.equal(typeof cs.dataSource, 'string', cs.code)
	t.ok(cs.dataSource, cs.code)
	if (cs.informationSource !== null) {
		t.equal(typeof cs.informationSource, 'string', cs.code)
		t.ok(cs.informationSource, cs.code)
	}

	t.equal(typeof cs.revisionDate, 'string', cs.code)
	t.ok(cs.revisionDate, cs.code)
	t.ok(Number.isInteger(Date.parse(cs.revisionDate)), cs.code)

	if (cs.datum !== null) {
		t.equal(typeof cs.datum['@id'], 'string', cs.code)
		t.ok(cs.datum['@id'], cs.code)
		t.equal(typeof cs.datum.code, 'string', cs.code)
		t.ok(cs.datum.code, cs.code)
		t.equal(typeof cs.datum.name, 'string', cs.code)
		t.ok(cs.datum.name, cs.code)
	}

	if (cs.baseCoordRefSystem !== null) {
		t.equal(typeof cs.baseCoordRefSystem['@id'], 'string', cs.code)
		t.ok(cs.baseCoordRefSystem['@id'], cs.code)
		t.equal(typeof cs.baseCoordRefSystem.code, 'string', cs.code)
		t.ok(cs.baseCoordRefSystem.code, cs.code)
		t.equal(typeof cs.baseCoordRefSystem.name, 'string', cs.code)
		t.ok(cs.baseCoordRefSystem.name, cs.code)
	}

	if (cs.conversion !== null) {
		t.equal(typeof cs.conversion['@id'], 'string', cs.code)
		t.ok(cs.conversion['@id'], cs.code)
		t.equal(typeof cs.conversion.code, 'string', cs.code)
		t.ok(cs.conversion.code, cs.code)
		t.equal(typeof cs.conversion.name, 'string', cs.code)
		t.ok(cs.conversion.name, cs.code)
	}
}

test('all', (t) => {
	for (let code in all) {
		looksValid(t, all[code])
	}
	t.end()
})
