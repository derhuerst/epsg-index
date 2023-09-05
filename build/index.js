import Queue from 'queue'
import pick from 'lodash.pick'
import {join as pathJoin} from 'node:path'
import {writeFile} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {request as req} from './request.js'

const getNrOfPages = async () => {
	const data = await req({q: ''})
	return Math.ceil(data.number_result / data.results.length)
}

const fetchAll = (nrOfPages) => {
	return new Promise((yay, nay) => {
		const queue = new Queue({concurrency: 2, autostart: true})
		let results = []

		const fetch = (i) => {
			const job = async () => {
				const data = await req({
					q: '',
					// page=0 fails with 422 for some reason 🙄
					page: i === 0 ? undefined : i,
				})
				results = [
					...results,
					...data.results,
				]
			}

			job.title = i + ''
			return job
		}

		queue.addEventListener('error', (ev) => {
			const {error: err} = ev.detail
			queue.stop()
			nay(err)
		}, {once: true})
		queue.addEventListener('end', (ev) => {
			const {error: err} = ev.detail
			if (!err) yay(results)
		}, {once: true})
		queue.addEventListener('success', (ev) => {
			const {job} = ev.detail
			console.log(job.title + '/' + nrOfPages)
		})

		for (let i = 0; i <= nrOfPages; i++) {
			queue.push(fetch(i))
		}
	})
}

const parseResult = (res) => {
	return Object.assign(pick(res, [
		'code', 'kind', 'name'
	]), {
		wkt: res.wkt || null,
		proj4: res.proj4 || null,
		bbox: res.bbox || null,
		unit: res.unit || null,
		area: res.area || null,
		accuracy: res.accuracy !== 'unknown' ? (res.accuracy || null) : null
	})
}

const dir = fileURLToPath(new URL('../s', import.meta.url).href)

const storeIndividuals = (index) => {
	return new Promise((yay, nay) => {
		const queue = new Queue({concurrency: 8, autostart: true})

		const store = (result) => {
			const job = (cb) => {
				const dest = pathJoin(dir, result.code + '.json')
				writeFile(dest, JSON.stringify(result), cb)
			}

			job.title = result.code
			return job
		}

		queue.addEventListener('error', (ev) => {
			const {err} = ev.detail
			queue.stop()
			nay(err)
		}, {once: true})
		queue.addEventListener('end', (ev) => {
			const {err} = ev.detail
			if (!err) yay()
		}, {once: true})

		for (let result of index) {
			queue.push(store(result))
		}
	})
}

const storeAll = (index) => {
	return new Promise((yay, nay) => {
		const all = index.reduce((all, result) => {
			all[result.code] = result
			return all
		}, {})

		const dest = pathJoin(dir, '..', 'all.json')
		writeFile(dest, JSON.stringify(all), (err) => {
			if (err) nay(err)
			else yay()
		})
	})
}

{
	const nrOfPages = await getNrOfPages()

	const results = await fetchAll(nrOfPages)
	const index = results.map(parseResult)

	await Promise.all([
		storeAll(index),
		storeIndividuals(index)
	])
}
