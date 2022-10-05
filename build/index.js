'use strict'

const {join: pathJoin} = require('path')
const {writeFile} = require('fs/promises')

const {
	fetchPage: _fetchPage,
	fetchSystem: _fetchSystem,
} = require('./fetch')

const BASE_DIR = pathJoin(__dirname, '..')
const SYSTEMS_DIR = pathJoin(BASE_DIR, 's')

const fetchSystem = async (code) => {
	const s = await _fetchSystem(code)
	const selfLink = Array.isArray(s.Links) ? s.Links.find(l => l.rel === 'self') || null : null

	// todo: validate using schema?
	return {
		'@id': selfLink && selfLink.href || null,
		code: s.Code ? s.Code + '' : null,
		name: s.Name || null,
		kind: s.Kind || null,

		remark: s.Remark || null,
		dataSource: s.DataSource || null,
		informationSource: s.informationSource || null,
		deprecated: s.Deprecated,
		revisionDate: s.RevisionDate || null,
		// todo: s.{GeoidModels,Usage,Deformations,Alias}
		// todo: s.{Changes,Deprecations,Supersessions}

		datum: s.Datum ? {
			'@id': s.Datum.href || null,
			code: s.Datum.Code ? s.Datum.Code + '' : null,
			name: s.Datum.Name || null,
		} : null,
		baseCoordRefSystem: s.BaseCoordRefSystem ? {
			'@id': s.BaseCoordRefSystem.href || null,
			code: s.BaseCoordRefSystem.Code ? s.BaseCoordRefSystem.Code + '' : null,
			name: s.BaseCoordRefSystem.Name || null,
		} : null,
		conversion: s.Conversion ? {
			'@id': s.Conversion.href || null,
			code: s.Conversion.Code ? s.Conversion.Code + '' : null,
			name: s.Conversion.Name || null,
		} : null,

		// todo: wkt, proj4, bbox, unit, accuracy
		// from https://apps.epsg.org/api/v1/CoordRefSystem/{id}/export/?format=wkt ?
	}
}

const fetchPage = async (pageIdx) => {
	const page = await _fetchPage(pageIdx)

	const systemCodes = page.Results.map(system => system.Code + '')
	return {
		systemCodes,
		totalSystems: page.TotalResults,
		pageSize: page.PageSize,
	}
}

;(async () => {
	const page0 = await fetchPage(0)
	const {totalSystems, pageSize} = page0

	const allSystemCodes = new Set(page0.systemCodes)
	for (let pageIdx = 1; pageIdx < Math.ceil(totalSystems / pageSize); pageIdx++) {
		const {systemCodes} = await fetchPage(pageIdx)
		console.info(`fetched page ${pageIdx}`)

		for (const code of systemCodes) allSystemCodes.add(code)
	}

	let fetchedSystems = 0
	const _systems = await Promise.all(Array.from(allSystemCodes).map((async (code) => {
		const system = await fetchSystem(code)
		fetchedSystems++
		console.info(`fetched system ${code} – ${fetchedSystems}/${totalSystems} systems`)

		const dest = pathJoin(SYSTEMS_DIR, system.code + '.json')
		await writeFile(dest, JSON.stringify(system))
		return system
	})))

	// todo: build all.json
	const byCode = {}
	for (const s of _systems) byCode[s.code] = s
	const allDest = pathJoin(BASE_DIR, 'all.json')
	await writeFile(allDest, JSON.stringify(byCode))
})()
.catch((err) => {
	console.error(err)
	process.exit(1)
})
