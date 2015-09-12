'use strict';

var React = require('react-native');

var InitialLoadingOverlay = require('./Initial-Loading-Overlay');
var PlatesDashBoard = require('./plate-screen/Plates-Dashboard');
var PlatesFooter = require('./plate-screen/Plates-Footer');
var MapDashBoard = require('./Map-Dashboard');
var NavigationBar = require('react-native-navbar');
var firebase_api = require('../utils/firebase-api');
var helpers = require('../utils/helpers');
var FBSDKLogin = require('react-native-fbsdklogin');
var Login = require('./Login');
var Colors = require('../../globalVariables');
var SettingsDashboard = require('./Settings-Dashboard');
var { Icon, } = require('react-native-icons');

var {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
} = React;

var {
  FBSDKLoginManager,
} = FBSDKLogin;

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'Finding your location...',
      watchID: null,
      currPlateIndex: -1,
      plates: [],
      goSettings: false,
      categoryFilter: [],
      filterActivated: false
    };

    if(props.initialPosition) {
      this.state.status = 'Finding nearby restaurants...';

      var {latitude, longitude} = props.initialPosition.coords;
      
      this.buildPlatesArray({latitude, longitude}, 15);
      this._getAddress(latitude, longitude);
    }
  }

  buildPlatesArray(userLocation,radius) {

    this.setState({
      status: 'Fetching yummy dishes...'
    });

    firebase_api.getNearbyRestaurants(userLocation, radius, (restaurantId, locationTuple, dist) => {

      firebase_api.getPlatesByRestaurantId(restaurantId)
      .then((plates) => {
        if(!plates.length) {
          throw new Error(`no plates for ${restaurantId}`);
        }

        return plates;
      })
      .then((plates) => {
        return [plates, firebase_api.getRestaurantById(restaurantId)];
      })
      .spread((plates, restaurantInfo) => {
        var restaurant = helpers.formatIdString(restaurantId);
        var location = {
          lat: locationTuple[0],
          lng: locationTuple[1]
        };

        var morePlates = plates.reduce((plates, plate) => {
          var imageKeys = [];
          var prop = '';

          if( !plate['images-lo'] || !plate['images'] ) {
            return plates;
          }

          if( plate['images-lo'] ) {
            imageKeys = Object.keys(plate['images-lo']);
            prop = 'images-lo';
          } else {
            imageKeys = Object.keys(plate['images']);
            prop = 'images';
          }

          var numOfImgs = imageKeys.length;
          var randomImageIndex = Math.floor(Math.random() * numOfImgs);
          var randomImageKey = imageKeys[randomImageIndex];
          var img_url = plate[prop][randomImageKey];

          var name = helpers.formatIdString(plate.key);
          var category = helpers.formatCategory(restaurantInfo.categories);
          var priceFactor = !restaurantInfo.price ? '$' : restaurantInfo.price;

          var platesObj = {
            name,
            category,
            restaurant,
            location,
            img_url,
            priceFactor
          };

          firebase_api.getUserByImageId(randomImageKey)
          .then(function(user) {
            platesObj.user = user;
          })
          .catch(function(err) {
            // console.warn(err);
          });

          plates.push(platesObj);

          return plates;
        }, []);

        if(!morePlates.length) {
          return;
        }

        var shuffleIndexIncrement = 2;
        var currPlateIndex = this.state.currPlateIndex;

        // initally, shuffle entire array of images
        // otherwise, start shuffling 2 indexes up from current plate index
        if( currPlateIndex === -1 ) {
          shuffleIndexIncrement = 1;
          currPlateIndex = 0;
        }

        this.setState({
          currPlateIndex,
          plates: helpers.shuffle(this.state.plates.concat(morePlates),this.state.currPlateIndex+shuffleIndexIncrement)
        });
      })
      .catch((err) => {
        // console.warn(err);
      });
    });
  }

  _getAddress(lat, lng) {
    fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        searchAddress: responseData.results[0].formatted_address.slice(0, 30) + '...'
      });
    });
  }

  componentWillReceiveProps(newProps) {
    if(this.props.initialPosition || !newProps.initialPosition) {
      return;
    }

    this.setState({
      status: 'Finding nearby restaurants...'
    });

    var {latitude, longitude} = newProps.initialPosition.coords;
    
    this.buildPlatesArray({latitude, longitude}, 15);
    this._getAddress(latitude, longitude);
  }

  handleSelection(image) {
    this.props.navigator.push({
      component: MapDashBoard,
      props: {
        image,
        userPosition: this.props.lastPosition
      },
      navigationBar: (
        <NavigationBar
          title="Directions" />
      )
    });
  }

  handleRejection(imageIndex) {
    this.setState({
      currPlateIndex: imageIndex
    });
  }

  _onPressLogOut() {
   FBSDKLoginManager.logOut();
   this.props.route.props.responseToken();
   this.props.navigator.popToTop();
  }

  doneButtonSettingsPressed() {
    this.props.navigator.pop();
    this.setState({filterActivated: !!this.state.categoryFilter.length});
    var filteredPlates = helpers.getFilteredPlates(this.state.plates, this.state.categoryFilter);
    this.setState({filteredPlates: filteredPlates});
  }

  handleSettingsConfig(categoryFilter) {
    console.log('handleSettingsConfig category', categoryFilter);
    this.setState({categoryFilter: categoryFilter});
  }

  componentWillMount() {
  }

  _onPressSettings() {
    this.setState({filterActivated: false});
    this.props.navigator.push({
      component: SettingsDashboard,
      props: {
        handleSettingsConfig: this.handleSettingsConfig.bind(this),
      },
      navigationBar: (
        <NavigationBar
          title="Discover Settings"
          onNext={this.doneButtonSettingsPressed.bind(this)}
          nextTitle="Done"/>
      )
    });
    this.setState({goSettings: true});
  }

  render() {
    if (this.state.plates.length <= 0) {
      return (
        <InitialLoadingOverlay
          isVisible={this.state.goSettings ? false : !this.state.plates.length}
          status={this.state.status} />
      );
    } else {
      return (
        <View style={styles.container}>
          <PlatesDashBoard
            plates={this.state.filterActivated ? this.state.filteredPlates : this.state.plates}
            lastPosition={this.props.lastPosition}
            currPlateIndex={this.state.currPlateIndex}
            onSelection={this.handleSelection.bind(this)}
            onRejection={this.handleRejection.bind(this)} />
          <PlatesFooter address={this.state.searchAddress} onPressSettings={this._onPressSettings.bind(this)}/>
        </View>
      );
    }
  }
}

let styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  }
});

module.exports = Main;
