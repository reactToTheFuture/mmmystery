var Rebase = require('re-base');
var GeoFire = require('geofire');
var Q = require('q');

var ENDPOINT_URI = require('./config').firebase.ENDPOINT_URI;
var base = Rebase.createClass(ENDPOINT_URI);
var platesRef = new Firebase(ENDPOINT_URI + '/plates');
var geoFireRef = new Firebase(ENDPOINT_URI + '/geofire');
var usersRef = new Firebase(ENDPOINT_URI + '/users');

var geoFire = new GeoFire(geoFireRef);

var helpers = require('./helpers');

var firebase_api = {
  _updateImageData() {
    var feelings = ['Satisfied', 'Seconds?', 'Sleepy', 'Sick', 'Happy', 'Gimme More!', 'Energetic', 'Stuffed', 'Comforted', 'Bloated'];
    var userIds = ['10204677161988934', '427362984114044', '10100870666170545'];

    var getImgKeys = function(restaurants) {
      return restaurants.reduce((result, restaurant) => {
        for(let plate in restaurant) {
          if( !restaurant.hasOwnProperty(plate) || plate === 'key' ) {
            continue;
          }

          var images = restaurant[plate].images;
          var imagesLo = restaurant[plate]['images-lo'];

          if(!images || !imagesLo) {
            continue;
          }

          var imgKeys = imagesLo ? Object.keys(imagesLo) : Object.keys(images);
          result = result.concat(imgKeys);
        }
        return result;
      }, []);
    };

    var uploadImageData = function(imgKeys) {
      imgKeys.forEach((imgKey) => {
        var user_id = userIds[Math.floor(Math.random() * userIds.length)];
        var date = helpers.getRandomDate(new Date(2015, 7, 1), new Date()).toString();
        var feeling = feelings[Math.floor(Math.random() * feelings.length)];

        base.post(`image-data/${imgKey}`, {
          data: {user_id, date, feeling},
          then() {
            console.log('image data updated');
          }
        });
      });
    };

    base.fetch('plates', {
      context: this,
      asArray: true,
      then(restaurants) {
        uploadImageData(getImgKeys(restaurants));
      }
    });
  },
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
  addImageData(imageId, user_id) {
    var deferred = Q.defer();
    var date = new Date().toString();
    var feeling = 'meh';

    base.post(`image-data/${imageId}`, {
      data: {user_id, date, feeling},
      then() {
        deferred.resolve('image data updated');
      }
    });

    return deferred.promise;
  },
  getUserByImageId(imageId) {
    var deferred = Q.defer();

    base.fetch(`image-data/${imageId}`, {
      context: this,
      then(imageData) {
        if(!imageData) {
          return deferred.reject(new Error(`no image data for ${imageId}`));
        }
        base.fetch(`users/${imageData.user_id}`, {
          context: this,
          then(user) {
            deferred.resolve(user);
          }
        })
      }
    });

    return deferred.promise;
  },
  getRestaurantById(id) {
    var deferred = Q.defer();

    base.fetch(`restaurants/${id}`, {
      context: this,
      then(restaurant) {
        if(!restaurant) {
          return deferred.reject(new Error(`can not find restaurant ${id}`));
        }
        deferred.resolve(restaurant);
      }
    });

    return deferred.promise;
  },
  getPlatesByRestaurantId(id) {
    var deferred = Q.defer();

    base.fetch(`plates/${id}`, {
      context: this,
      asArray: true,
      then(plates) {
        if(!plates) {
          return deferred.reject(new Error(`can not find plates for ${id}`));
        }
        deferred.resolve(plates);
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
    geoQuery.on('key_entered', cb);
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
    var deferred = Q.defer();
    var ImgRef = platesRef.child(restaurantID).child(plateID).child('images-lo').push(imageURL);
    deferred.resolve(ImgRef.key());
    return deferred.promise;
  },
  updatePlate(restaurantID, plateID, key, imageURL) {
    var deferred = Q.defer();
    platesRef.child(restaurantID).child(plateID).child('images-lo').child(key).set(imageURL, () => { deferred.resolve(`updated plate ${key}`) });
    return deferred.promise;
  },
  addGeoFireLocation(restaurant) {
    var id = restaurant.id;
    var coords = restaurant.location.coordinate;
    var lat = coords.latitude;
    var lng = coords.longitude;

    geoFire.set(id, [lat, lng])
    .then(() => {
      console.log(`Added ${name} to GeoFire`);
    }, (error) => {
      console.warn("Geofire Error: " + error);
    });
  }
};

module.exports = firebase_api;