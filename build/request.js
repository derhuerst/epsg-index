import {stringify} from 'qs'
import pRetry from 'p-retry'
const {AbortError: AbortRetryingError} = pRetry

const endpoint = 'https://epsg.io/'
const userAgent = 'https://github.com/derhuerst/epsg-index'

const _request = async (query) => {
	query = Object.assign({format: 'json'}, query)

	const res = await fetch(endpoint + '?' + stringify(query), {
		mode: 'cors', redirect: 'follow',
		headers: {
			'User-Agent': userAgent,
			'Accept': 'application/json',
		},
	})
	if (!res.ok) {
		const err = res.status === 422
			? new Error(res.statusText)
			: new AbortRetryingError(res.statusText)
		err.query = query
		err.statusCode = res.status
		throw err
	}

	const body = await res.json()
	return body
}

const request = async (...args) => {
	return await pRetry(() => _request(...args), {
		retries: 2,
		minTimeout: 3000, // 3s
		factor: 3,
	})
}

export {
	request,
}
