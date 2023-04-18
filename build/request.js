'use strict'

const {stringify} = require('qs')
const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})
const pRetry = require('p-retry')
const {AbortError: AbortRetryingError} = pRetry

const endpoint = 'https://epsg.io/'
const userAgent = 'https://github.com/derhuerst/epsg-index'

const _request = (query) => {
	query = Object.assign({format: 'json'}, query)

	return fetch(endpoint + '?' + stringify(query), {
		mode: 'cors', redirect: 'follow',
		headers: {
			'User-Agent': userAgent,
			'Accept': 'application/json',
		},
	})
	.then((res) => {
		if (!res.ok) {
			const err = res.status === 422
				? new Error(res.statusText)
				: new AbortRetryingError(res.statusText)
			err.query = query
			err.statusCode = res.status
			throw err
		}
		return res.json()
	})
}

const request = (...args) => {
	return pRetry(() => _request(...args), {
		retries: 2,
		minTimeout: 3000, // 3s
		factor: 3,
	})
}

module.exports = request
