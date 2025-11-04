import { stringify } from 'qs'
import pRetry from 'p-retry'
const { AbortError: AbortRetryingError } = pRetry

// https://docs.maptiler.com/cloud/api/coordinates/
const endpoint = 'https://api.maptiler.com/coordinates/search/*.json'
const userAgent = 'https://github.com/derhuerst/epsg-index'
const defaultItemsCount = 50

const _request = async (query) => {
	query = {
		exports: 'true',
		limit: defaultItemsCount,
		offset: query.page * defaultItemsCount,
		key: process.env.API_KEY
	}

	const res = await fetch(endpoint + '?' + stringify(query), {
		mode: 'cors', redirect: 'follow',
		headers: {
			'User-Agent': userAgent,
			'Accept': 'application/json',
		},
	})
	if (!res.ok) {
		const err = (res.status === 403)
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
