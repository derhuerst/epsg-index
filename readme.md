# epsg-index

**A machine-readable index of [all EPSG coordinate systems](https://epsg.io/?q=).** Similar to [`epsg`](https://github.com/stevage/epsg) and [`node-proj4js-defs`](https://github.com/yuletide/node-proj4js-defs), but kept up to date. Like [`python-epsg`](https://github.com/geo-data/python-epsg#python-epsg), but in JavaScript/JSON.

[![npm version](https://img.shields.io/npm/v/epsg-index.svg)](https://www.npmjs.com/package/epsg-index)
[![build status](https://img.shields.io/travis/derhuerst/epsg-index.svg)](https://travis-ci.org/derhuerst/epsg-index)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/epsg-index.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


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


## Contributing

If you have a question or have difficulties using `epsg-index`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/epsg-index/issues).
