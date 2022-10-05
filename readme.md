# epsg-index

**A machine-readable index of [all EPSG coordinate systems](https://epsg.io/?q=).** Similar to [`epsg`](https://github.com/stevage/epsg) and [`node-proj4js-defs`](https://github.com/yuletide/node-proj4js-defs), but kept up to date. Like [`python-epsg`](https://github.com/geo-data/python-epsg#python-epsg), but in JavaScript/JSON.

[![npm version](https://img.shields.io/npm/v/epsg-index.svg)](https://www.npmjs.com/package/epsg-index)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/epsg-index.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)

*Note:* The data is licensed according to [EPSG's apparently proprietary license](license.data.md).


## Installing

```shell
npm install epsg-index
```


## Usage

```js
const epsg4326 = require('epsg-index/s/4326.json')

console.log(epsg4326)
```

```js
{
	'@id': 'https://apps.epsg.org/api/v1/GeodeticCoordRefSystem/4326',
	code: '4326',
	name: 'WGS 84',
	kind: 'geographic 2D',
	remark: null,
	dataSource: 'EPSG',
	informationSource: null,
	revisionDate: '2020-03-14T00:00:00',
	datum: {
		'@id': 'https://apps.epsg.org/api/v1/Datum/6326',
		code: '6326',
		name: 'World Geodetic System 1984 ensemble',
	},
	baseCoordRefSystem: {
		'@id': 'https://apps.epsg.org/api/v1/GeodeticCoordRefSystem/4979',
		code: '4979',
		name: 'WGS 84',
	},
	conversion: {
		'@id': 'https://apps.epsg.org/api/v1/Conversion/15593',
		code: '15593',
		name: 'geographic3D to geographic2D',
	},
}
```

You can also load all coordinate systems (`5mb` of data):

```js
const all = require('epsg-index/all.json')

console.log(all['4326'])
```


## Related

- [`transform-coordinates`](https://github.com/derhuerst/transform-coordinates) – Transform coordinates from one coordinate system to another. Built on top of `epsg-index`.


## Contributing

If you have a question or have difficulties using `epsg-index`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/epsg-index/issues).
