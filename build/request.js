'use strict'

const {stringify} = require('qs')
const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})

const endpoint = 'https://epsg.io/'
const userAgent = 'https://github.com/derhuerst/epsg-index'

const request = (query) => {
	query = Object.assign({format: 'json'}, query)

	return fetch(endpoint + '?' + stringify(query), {
		mode: 'cors', redirect: 'follow',
		headers: {'User-Agent': userAgent}
	})
	.then((res) => {
		if (!res.ok) {
			const err = new Error(res.statusText)
			err.statusCode = res.status
			throw err
		}
		return res.json()
	})
}

module.exports = request
