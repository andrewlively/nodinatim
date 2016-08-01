# nodinatim
Geocode locations with [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim) and [Node.js](https://nodejs.org/)

## Docs

### Initialize

```javascript
// Can include own Nominatim installation URL string in constructor; falls back to public API
const geocoder = new Nodinatim();

```

### geocode(street, city, state, zip)

Params: 
 * Street - String
 * City - String
 * State - String
 * Postalcode/Zipcode - String

Returns:
  * Promise
  * Object
    * latitude
    * longitude

## Example
```javascript
import Nodinatim from 'nodinatim';

const geocoder = new Nodinatim();

geocoder
  .geocode(
    '2600 Clifton Ave',
    'Cincinnati',
    'Ohio',
    '45220'
  )
  .then(function(results) {
    console.log(results.latitude);
    console.log(results.longitude);
  })
  .catch(function() {
    // TODO: Handle error
  });

```
