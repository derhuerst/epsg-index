'use strict'

const {stringify} = require('qs')
const fetch = require('node-fetch')
const createThrottle = require('p-throttle')
const {ok, strictEqual} = require('assert')

const BASE_URL = 'https://apps.epsg.org/api/v1/'
const USER_AGENT = 'https://github.com/derhuerst/epsg-index'

const rawFetchFromEpsgOrg = async (endpoint, query = {}) => {
	const url = BASE_URL + endpoint + '?' + stringify(query)
	const res = await fetch(url, {
		mode: 'cors', redirect: 'follow',
		headers: {
			'User-Agent': USER_AGENT,
			'Accept': 'application/json',
		},
	})
	if (!res.ok) {
		const err = new Error(res.statusText)
		err.query = query
		err.statusCode = res.status
		err.res = res
		throw err
	}
	return await res.json()
}

const throttle = createThrottle({
	limit: 50, // find proper limit
	interval: 60 * 1000,
})
const throttledFetchFromEpsgOrg = throttle(rawFetchFromEpsgOrg)

const fetchEpsgOrgPage = async (page, includeDeprecated = true, includeWorld = true) => {
	ok(Number.isInteger(page), 'page must be an integer')

	return await throttledFetchFromEpsgOrg('/GeodeticCoordRefSystem/', {
		includeDeprecated,
		includeWorld,
		sortField: 'Code',
		pageSize: 100,
		page,
	})
}

const fetchEpsgOrgSystem = async (code) => {
	strictEqual(typeof code, 'string', 'code must be a string')
	ok(code, 'code must not be empty')

	return await throttledFetchFromEpsgOrg(`/GeodeticCoordRefSystem/${code}`)
}

module.exports = {
	rawFetchFromEpsgOrg,
	fetchFromEpsgOrg: throttledFetchFromEpsgOrg,
	fetchPage: fetchEpsgOrgPage,
	fetchSystem: fetchEpsgOrgSystem,
}
