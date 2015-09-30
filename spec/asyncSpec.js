
describe('dummy', () => {
  function promise(delay = 0) {
    return new Promise(resolve => setTimeout(() => resolve('done'), delay));
  }

  it('works with async', async () => {
    expect(await promise()).toBe('done');
  });

  it('allows increasing the timeout', async () => {
    expect(await promise(2000)).toBe('done');
  }, 10000);
});

var origin = {
      lat: 34.0193111,
      lng: -118.494299
    };
var destiny = {
      lat: 34.0183573,
      lng: -118.4869185
    };

describe('Map Section', () => {
  var mapbox_api = require('../app/utils/mapbox-api');
  async function getAsyncDirections (origin, destiny) {
    console.log('inside wait expect');
    var stepsToFollow = [];
    var responseDirections = await (mapbox_api.getDirections(origin, destiny)
      .then((data) => {
        data.routes[0].steps.map((step) => {
          stepsToFollow.push(step.maneuver.instruction);
        });
        return stepsToFollow;
      }));
    return responseDirections;
  }
  it('verifies number of steps between two specific points', async () => {
    expect(await getAsyncDirections(origin, destiny)).toBe(true);
  });
});


