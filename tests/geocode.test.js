const Nodinatim = require('../Nodinatim.js');

const UNIVERSITY_OF_CINCINNATI_QUERY = {
  street: `2600 Clifton Ave`,
  city: `Cincinnati`,
  state: `Ohio`,
  postalcode: 45220
};

describe(`geocode`, function() {
  it(`should geocode address`, async function() {
    const nodinatim = new Nodinatim();

    const results = await nodinatim.geocode(UNIVERSITY_OF_CINCINNATI_QUERY);

    expect(results).toBeDefined();
    expect(results.latitude).toBeDefined();
    expect(results.longitude).toBeDefined();
  });
});
