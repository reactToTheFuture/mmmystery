import Rebase from 're-base';
import GeoFire from 'geofire';
import Q from 'q';

import { firebase } from './config';

var ENDPOINT_URI = firebase.ENDPOINT_URI;

import helpers from './helpers';

var base = Rebase.createClass(ENDPOINT_URI);

var platesRef = new Firebase(`${ENDPOINT_URI}/plates`);
var geoFireRef = new Firebase(`${ENDPOINT_URI}/geofire`);
var usersRef = new Firebase(`${ENDPOINT_URI}/users`);
var imageDataRef = new Firebase(`${ENDPOINT_URI}/image-data`);

var geoFire = new GeoFire(geoFireRef);

var firebase_api = {
  getDistance(location1, location2) {
    // returns kms
    return GeoFire.distance(location1, location2);
  },
  getReBase() {
    return base;
  },
  addUser(user) {
    var {id, first_name, last_name } = user;
    var userRef = usersRef.child(id);
    var profile_image = user.picture.data.url;

    userRef.child('first_name').set(first_name);
    userRef.child('last_name').set(last_name);
    userRef.child('profile_image').set(profile_image);
  },
  addImageData(image_id, image_url, user_id, restaurant_id, plate_id) {
    var deferred = Q.defer();
    var date = new Date().toString();
    var feeling = 'meh';

    base.post(`image-data/${image_id}`, {
      data: {date, feeling, user_id, image_url, restaurant_id, plate_id},
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
    radius = helpers.milesToKilometers(radius);

    var geoQuery = geoFire.query({
      center: [loc.latitude, loc.longitude],
      radius: radius
    });

    // cb gets key, location and distance (in km) as params
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
  addLikeToImage(img_key, user_id) {
    var imageLikes = new Firebase(`${ENDPOINT_URI}/image-data/${img_key}/likes`);
    imageLikes.push(user_id);
  },
  addAdventureToUser(user_id, img_key) {
    var adventures = new Firebase(`${ENDPOINT_URI}/users/${user_id}/adventures`);
    adventures.push(img_key);
  },
  getAdventuresByUser(user_id) {
    var deferred = Q.defer();

    base.fetch(`users/${user_id}/adventures`, {
      context: this,
      asArray: true,
      then(adventures) {
        if(!adventures.length) {
          return deferred.reject(new Error(`no adventures for ${user_id}`));
        }
        deferred.resolve(adventures);
      }
    });

    return deferred.promise;
  },
  getImagesByUser(user_id, cb) {
    var deferred = Q.defer();

    imageDataRef.orderByChild('user_id').equalTo(user_id).on('value', (snapshot) => {
      deferred.resolve(snapshot.val());
    });

    return deferred.promise;
  },
  getImageById(img_id) {
    var deferred = Q.defer();

    base.fetch(`image-data/${img_id}`, {
      context: this,
      then(img) {
        if(!img) {
          return deferred.reject(new Error(`can not find image ${img_id}`));
        }
        deferred.resolve(img);
      }
    });

    return deferred.promise;
  },
  addGeoFireLocation(restaurant) {
    var id = restaurant.id;
    var name = restaurant.name;
    var coords = restaurant.location.coordinate;
    var lat = coords.latitude;
    var lng = coords.longitude;

    geoFire.set(id, [lat, lng])
    .then(() => {
      console.log(`Added ${name} to GeoFire`);
    }, (error) => {
      console.warn("Geofire Error: " + error);
    });
  },
  _resetImageData() {
    var feelings = ['Satisfied', 'Seconds?', 'Sleepy', 'Sick', 'Happy', 'Gimme More!', 'Energetic', 'Stuffed', 'Comforted', 'Bloated'];
    var userIds = ['10204677161988934', '427362984114044', '10100870666170545'];

    var getImages = function(restaurants) {
      return restaurants.reduce((result, restaurant) => {
        var restaurant_id = restaurant.key;

        for(let k in restaurant) {
          if( !restaurant.hasOwnProperty(k) || k === 'key' ) {
            continue;
          }


          var plateData;
          var plate = restaurant[k];
          var plate_id = k;
          var images = plate['images-lo'] || plate.images;

          if(!images) {
            continue;
          }

          plateData = {
            restaurant_id,
            plate_id,
            images
          };

          result.push(plateData);
        }

        return result;
      }, []);
    };

    var uploadImageData = function(plates) {
      plates.forEach((plate) => {

        var restaurant_id = plate.restaurant_id;
        var plate_id = plate.plate_id;

        for( let img_key in plate.images ) {

          var user_id = userIds[Math.floor(Math.random() * userIds.length)];
          var date = helpers.getRandomDate(new Date(2015, 7, 1), new Date()).toString();
          var feeling = feelings[Math.floor(Math.random() * feelings.length)];
          var img_url = plate.images[img_key];

          base.post(`image-data/${img_key}`, {
            data: {user_id, date, feeling, img_url, restaurant_id, plate_id},
            then() {
              console.log('image data updated');
            }
          });
        }
      });
    };

    base.fetch('plates', {
      context: this,
      asArray: true,
      then(restaurants) {
        uploadImageData(getImages(restaurants));
      }
    });
  },
  _resetGeoFireData() {
    base.fetch('restaurants', {
      context: this,
      asArray: true,
      then(restaurants) {
        restaurants = restaurants.reduce((dict, restaurant) => {
          var id = restaurant.key;
          var coords = restaurant.location.coordinate;
          var lat = coords.latitude;
          var lng = coords.longitude;

          dict[id] = [lat, lng];

          return dict;
        },{});

        geoFire.set(restaurants)
        .then(() => {
          console.log('Geofire Data Updated');
        }, (error) => {
          console.warn(`Geofire Error: ${error}`);
        });
      }
    });
  }
};

export default firebase_api;
