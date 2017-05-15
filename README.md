# nodinatim - [![Codacy Badge](https://api.codacy.com/project/badge/Grade/1c4b7bd836384aa696e7f192dac6340a)](https://www.codacy.com/app/andrew-lively2/nodinatim?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=andrewlively/nodinatim&amp;utm_campaign=Badge_Grade) [![Build Status](https://travis-ci.org/andrewlively/nodinatim.svg?branch=master)](https://travis-ci.org/andrewlively/nodinatim)

Geocode locations with [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim) and [Node.js](https://nodejs.org/)

## Docs

### Initialize

```javascript
// Can include own Nominatim installation URL string in constructor; falls back to public API
const geocoder = new Nodinatim();

```

### geocode(query)

Params: 

```javascript
{
  street: String,
  city: String,
  county: String,
  state: String,
  postalcode: String || Number,
  viewbox: {
    left: Number,
    top: Number,
    right: Number,
    bottom: Number
  },
  bounded: Boolean,
  excludePlaces: [String]
}
```

Returns a Promise with Lat/Long pair like below:

```javascript
{
  latitude: Number,
  longitude: Number
}
```

## Example
```javascript
import Nodinatim from 'nodinatim';

const geocoder = new Nodinatim(); // Can include self-hosted nominatim server in instantiation. Defaults to https://nominatim.openstreetmap.org/

geocoder
  .geocode({
    street: '2600 Clifton Ave',
    city: 'Cincinnati',
    state: 'Ohio',
    postalcode: '45220'
  })
  .then(function(results) {
    console.log(results.latitude);
    console.log(results.longitude);
  })
  .catch(function() {
    // TODO: Handle error
  });

```
