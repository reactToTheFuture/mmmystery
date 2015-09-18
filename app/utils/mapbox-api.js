var mapbox_keys = require('./config').mapbox;

var mapbox_api = {
  getDirections(origin,dest) {
    var url = `https://api.mapbox.com/v4/directions/mapbox.driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}.json?access_token=${mapbox_keys.token}`;
    return fetch(url).then((res) => res.json());
  }
};

export default mapbox_api;
