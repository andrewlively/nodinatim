const http = require('http');
const https = require('https');
const qs = require('querystring');
const url = require('url');

const search = function (url, params) {
  return function (resolve, reject) {
    const options = {
      host: url.host,
      path: `/search?${ qs.stringify(params) }`
    };

    const responseHandler = function(response) {
      let body = '';

      response.on('data', function(d) {
          body += d;
      });

      response.on('end', function() {
        if (response.statusCode !== 200) {
          return reject(`Failed to geocode`);
        }

        const results = JSON.parse(body);

        if (!results.length) {
          return reject('Failed to geocode - No locations found');
        }

        resolve({
          latitude: parseFloat(results[0].lat),
          longitude: parseFloat(results[0].lon)
        });
      });
    };

    const agent = url.protocol === 'https:' ? https : http;

    agent.get(options, responseHandler);
  }
}

function checkViewbox(viewbox) {
  if (
    !viewbox ||
    !Object.keys(viewbox).length ||
    isNaN(viewbox.left) ||
    isNaN(viewbox.top) ||
    isNaN(viewbox.right) ||
    isNaN(viewbox.bottom)
  ) {
    return ``;
  }

  return `${ viewbox.left },${ viewbox.top }.${ viewbox.right },${ viewbox.bottom }`
}

module.exports = class Nodinatim {
  constructor(base) {
    this.url = url.parse(base || 'https://nominatim.openstreetmap.org');
  }

  geocode(query = {}) {
    const params = {
      street: query.street || ``,
      city: query.city || ``,
      county: query.county || ``,
      state: query.state || ``,
      postalcode: query.postalcode || ``,
      bounded: query.bounded ? 1 : 0,
      format: `json`,
      limit: 1
    };

    const viewbox = checkViewbox(query.viewbox);

    if (viewbox) {
      params.viewbox = viewbox;
    }

    if (Array.isArray(query.excludePlaces) && query.excludePlaces.length) {
      params.exclude_places_ids = query.excludePlaces.join(`,`);
    }

    return new Promise(search(this.url, params));
  }
}
