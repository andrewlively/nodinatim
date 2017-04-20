'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Nodinatim = function () {
  function Nodinatim(base) {
    _classCallCheck(this, Nodinatim);

    this.url = _url2.default.parse(base || 'https://nominatim.openstreetmap.org');
  }

  _createClass(Nodinatim, [{
    key: 'geocode',
    value: function geocode(location, city, state, postalcode) {
      var _this = this;

      var providedObject = typeof street === 'object';
      var params = {
        street: providedObject ? location.street : location,
        city: providedObject ? location.city : city,
        state: providedObject ? location.state : state,
        postalcode: providedObject ? location.postalcode : postalcode,
        format: 'json',
        limit: 1
      };

      var search = function search(resolve, reject) {
        var query = _querystring2.default.stringify(params);

        var options = {
          host: _this.url.host,
          path: '/search?' + query
        };

        var responseHandler = function responseHandler(response) {
          var body = '';

          response.on('data', function (d) {
            body += d;
          });

          response.on('end', function () {
            if (response.statusCode !== 200) {
              return reject('Failed to geocode');
            }

            var results = JSON.parse(body);

            if (!results.length) {
              return reject('Failed to geocode - No locations found');
            }

            resolve({
              latitude: results[0].lat,
              longitude: results[0].lon
            });
          });
        };

        var agent = _this.url.protocol === 'https:' ? _https2.default : _http2.default;

        agent.get(options, responseHandler);
      };

      search.bind(this);

      return new Promise(search);
    }
  }]);

  return Nodinatim;
}();

exports.default = Nodinatim;
