import http from 'http';
import https from 'https';
import qs from 'querystring';
import url from 'url';

class Nodinatim {
  constructor(base) {
    this.url = url.parse(base || 'https://nominatim.openstreetmap.org');
  }

  geocode(street, city, state, postalcode) {
    const search = (resolve, reject) => {
      const query = qs.stringify({
        street,
        city,
        state,
        postalcode,
        format: `json`,
        limit: 1
      });

      const options = {
        host: this.url.host,
        path: `/search?${ query }`
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
            latitude: results[0].lat,
            longitude: results[0].lon
          });
        });
      };

      const agent = this.url.protocol === 'https:' ? https : http;

      agent.get(options, responseHandler);
    }

    search.bind(this);

    return new Promise(search);
  }
}

export default Nodinatim;
