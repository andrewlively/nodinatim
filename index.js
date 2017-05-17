'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require('http');
var https = require('https');
var qs = require('querystring');
var url = require('url');

var search = function search(url, params) {
  return function (resolve, reject) {
    var options = {
      hostname: url.hostname,
      port: url.port ? url.port : url.protocol === `https:` ? 443 : 80,
      path: `/search?${qs.stringify(params)}`
    };

    var responseHandler = function responseHandler(response) {
      var body = '';

      response.on('data', function (d) {
        body += d;
      });

      response.on('end', function () {
        if (response.statusCode !== 200) {
          return reject(`Failed to geocode`);
        }

        var results = JSON.parse(body);

        if (!results.length) {
          return reject('Failed to geocode - No locations found');
        }

        resolve({
          latitude: parseFloat(results[0].lat),
          longitude: parseFloat(results[0].lon)
        });
      });
    };

    var agent = url.protocol === 'https:' ? https : http;

    agent.get(options, responseHandler);
  };
};

function checkViewbox(viewbox) {
  if (!viewbox || !Object.keys(viewbox).length || isNaN(viewbox.left) || isNaN(viewbox.top) || isNaN(viewbox.right) || isNaN(viewbox.bottom)) {
    return ``;
  }

  return `${viewbox.left},${viewbox.top}.${viewbox.right},${viewbox.bottom}`;
}

module.exports = function () {
  function Nodinatim(base) {
    _classCallCheck(this, Nodinatim);

    this.url = url.parse(base || 'https://nominatim.openstreetmap.org');
  }

  _createClass(Nodinatim, [{
    key: 'geocode',
    value: function geocode() {
      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var params = {
        format: `json`,
        limit: 1
      };

      if (typeof query === `string`) {
        params.q = query;
      } else {
        params.street = query.street || ``;
        params.city = query.city || ``;
        params.county = query.county || ``;
        params.state = query.state || ``;
        params.postalcode = query.postalcode || ``;
        params.bounded = query.bounded ? 1 : 0;
      }

      var viewbox = checkViewbox(query.viewbox);

      if (viewbox) {
        params.viewbox = viewbox;
      }

      if (Array.isArray(query.excludePlaces) && query.excludePlaces.length) {
        params.exclude_places_ids = query.excludePlaces.join(`,`);
      }

      return new Promise(search(this.url, params));
    }
  }]);

  return Nodinatim;
}();
