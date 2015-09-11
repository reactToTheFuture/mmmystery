var Rebase = require('re-base');
var GeoFire = require('geofire');
var Q = require('q');

var ENDPOINT_URI = require('./config').firebase.ENDPOINT_URI;
var base = Rebase.createClass(ENDPOINT_URI);
var platesRef = new Firebase(ENDPOINT_URI + '/plates');
var geoFireRef = new Firebase(ENDPOINT_URI + '/geofire');
var geoFire = new GeoFire(geoFireRef);

var firebase_api = {
  getReBase() {
    return base;
  },
  addUser(user) {
    var {id, first_name, last_name } = user;
    var profile_image = user.picture.data.url;

    base.post(`users/${id}`, {
      data: {first_name, last_name, profile_image},
      then() {
        console.log(`User ${first_name} ${last_name} Updated`);
      }
    });
  },
  getRestaurantById(id) {
    var deferred = Q.defer();

    base.fetch(`restaurants/${id}`, {
      context: this,
      then(data) {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  },
  getPlatesByRestaurantId(id) {
    var deferred = Q.defer();

    base.fetch(`plates/${id}`, {
      context: this,
      asArray: true,
      then(data) {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  },
  getNearbyRestaurants(loc, radius, cb) {
    var geoQuery = geoFire.query({
      center: [loc.latitude, loc.longitude],
      radius: radius
    });

    // cb gets key, location and distance as params
    geoQuery.on("key_entered", cb);
  },
  addRestaurant(restaurant) {
    var {id, categories, location, phone, name, url} = restaurant;
    var that = this;

    base.post(`restaurants/${id}`, {
      data: {categories, location, phone, name, url},
      then() {
        that.addGeoFireLocation(restaurant);
      }
    });
  },
  addPlate(restaurantID, plateID, imageURL) {
    platesRef.child(restaurantID).child(plateID).child('images-lo').push(imageURL);
  },
  addPlatePromise(restaurantID, plateID, imageURL) {
    var deferred = Q.defer();
    var ImgRef = platesRef.child(restaurantID).child(plateID).child('images-lo').push(imageURL);
    deferred.resolve(ImgRef.key());
    return deferred.promise;
  },
  updatePlate(restaurantID, plateID, key, imageURL) {
    platesRef.child(restaurantID).child(plateID).child('images-lo').child(key).set(imageURL);
  },
  addGeoFireLocation(restaurant) {
    var id = restaurant.id;
    var coords = restaurant.location.coordinate;
    var lat = coords.latitude;
    var lng = coords.longitude;

    geoFire.set(id, [lat, lng]).then(() => {
      console.log(`Added ${name} to GeoFire`);
    }, (error) => {
      console.log("Geofire Error: " + error);
    });
  }
};

module.exports = firebase_api;