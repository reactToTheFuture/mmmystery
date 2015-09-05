var Rebase = require('re-base');
var GeoFire = require('geofire');
var Q = require('q');

var ENDPOINT_URI = require('./config').firebase.ENDPOINT_URI;
var base = Rebase.createClass(ENDPOINT_URI);
var restaurantsRef = new Firebase(ENDPOINT_URI + '/restaurants');
var geoFireRef = new Firebase(ENDPOINT_URI + '/geofire');
var geoFire = new GeoFire(geoFireRef);

var firebase_api = {
  getReBase() {
    return base;
  },
  getAllRestaurants() {
    var deferred = Q.defer();

    base.fetch('restaurants', {
      context: this,
      asArray: true,
      then(data) {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  },
  getAllPlates() {
    var deferred = Q.defer();

    base.fetch('plates', {
      context: this,
      asArray: true,
      then(data) {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  },
  addRestaurant(restaurant) {
    var {id, categories, location, phone, name, url} = restaurant;

    base.post(`restaurants/${id}`, {
      data: {categories, location, phone, name, url},
      then() {
        console.log('added');
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
  getNearbyRestaurants(loc,radius,cb) {
    var geoQuery = geoFire.query({
      center: [loc.latitude, loc.longitude],
      radius: radius
    });

    // cb gets key, location and distance as params
    geoQuery.on("key_entered", cb);
  },
  updateGeoFireLocations() {
    restaurantsRef.on('child_added', (childSnapshot, prevChildKey) => {
      var restaurantId = childSnapshot.key();
      var location = childSnapshot.child('location').child('coordinate').val();
      var lat = location.latitude;
      var lng = location.longitude;

      geoFire.set(restaurantId, [lat, lng]).then(function() {
        console.log("Provided key has been added to GeoFire");
      }, function(error) {
        console.log("Error: " + error);
      });

    }); 
  }
};
 
module.exports = firebase_api;