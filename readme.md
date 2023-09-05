# epsg-index

**A machine-readable index of [all EPSG coordinate systems](https://epsg.io/?q=).** Similar to [`epsg`](https://github.com/stevage/epsg) and [`node-proj4js-defs`](https://github.com/yuletide/node-proj4js-defs), but kept up to date (so far). Like [`python-epsg`](https://github.com/geo-data/python-epsg#python-epsg), but in JavaScript/JSON.

[![npm version](https://img.shields.io/npm/v/epsg-index.svg)](https://www.npmjs.com/package/epsg-index)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/epsg-index.svg)
![minimum Node.js version](https://img.shields.io/node/v/epsg-index.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


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
	code: '4326',
	kind: 'CRS-GEOGCRS',
	name: 'WGS 84',
	wkt: 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]',
	proj4: '+proj=longlat +datum=WGS84 +no_defs',
	bbox: [90, -180, -90, 180],
	unit: 'degree (supplier to define representation)',
	area: 'World.',
	accuracy: null
}
```

You can also load all coordinate systems (`5mb` of data):

```js
const all = require('epsg-index/all.json')

console.log(all['4326'])
```


## Related

- [`transform-coordinates`](https://github.com/derhuerst/transform-coordinates) – Transform coordinates from one coordinate system to another. Built on top of `epsg-index`.
- [python-epsg](https://github.com/geo-data/python-epsg) – A Python API to the EPSG Geodetic Parameter Dataset.


## Contributing

If you have a question or have difficulties using `epsg-index`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/epsg-index/issues).
