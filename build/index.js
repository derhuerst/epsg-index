'use strict'

const createQueue = require('queue')
const pick = require('lodash.pick')
const path = require('path')
const fs = require('fs')

const req = require('./request')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const getNrOfPages = () => {
	return req({q: ''})
	.then(data => Math.ceil(data.number_result / data.results.length))
}

const fetchAll = (nrOfPages) => {
	return new Promise((yay, nay) => {
		const queue = createQueue({concurrency: 8, autostart: true})
		let results = []

		const fetch = (i) => {
			const job = (cb) => {
				req({q: '', page: i})
				.then((data) => {
					results = results.concat(data.results)
					cb()
				})
				.catch(cb)
			}

			job.title = i + ''
			return job
		}

		queue.once('error', (err) => {
			queue.stop()
			nay(err)
		})
		queue.once('end', (err) => {
			if (!err) yay(results)
		})
		queue.on('success', (_, job) => {
			console.error(job.title + '/' + nrOfPages)
		})

		for (let i = 0; i <= nrOfPages; i++) {
		// for (let i = 0; i <= 10; i++) { // todo
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

const dir = path.join(__dirname, '..', 's')

const storeIndividuals = (index) => {
	return new Promise((yay, nay) => {
		const queue = createQueue({concurrency: 8, autostart: true})

		const store = (result) => {
			const job = (cb) => {
				const dest = path.join(dir, result.code + '.json')
				fs.writeFile(dest, JSON.stringify(result), cb)
			}

			job.title = result.code
			return job
		}

		queue.once('error', (err) => {
			queue.stop()
			nay(err)
		})
		queue.once('end', (err) => {
			if (!err) yay()
		})

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

		const dest = path.join(dir, '..', 'all.json')
		fs.writeFile(dest, JSON.stringify(all), (err) => {
			if (err) nay(err)
			else yay()
		})
	})
}

getNrOfPages()
.then(fetchAll)
.then((results) => {
	const index = results.map(parseResult)
	return Promise.all([
		storeAll(index),
		storeIndividuals(index)
	])
})
.catch(console.error)
