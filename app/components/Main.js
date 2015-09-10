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
      searchLatLng: null,
      goSettings: false,
      categoryFilter: [],
    };

    if(props.initialPosition) {
      this.state.status = 'Finding nearby restaurants...';
      var {latitude, longitude} = props.initialPosition.coords;
      this.buildPlatesArray({latitude, longitude}, 60);
    }
  }

  buildPlatesArray(userLocation,radius) {
    firebase_api.getNearbyRestaurants(userLocation, radius, (restaurantId, locationTuple, dist) => {

      this.setState({
        status: 'Fetching yummy dishes...'
      });

      firebase_api.getPlatesByRestaurantId(restaurantId)
      .then((plates) => {

        if( !plates.length ) {
          return;
        }

        var location = {
          lat: locationTuple[0],
          lng: locationTuple[1]
        };

        var restaurant = helpers.formatIdString(restaurantId);

        var morePlates = plates.map((plate) => {
          var firebaseKeys;

          if( plate['images-lo'] ) {
            firebaseKeys = Object.keys(plate['images-lo']);
          } else {
            firebaseKeys = Object.keys(plate['images']);
          }

          var numOfImgs = firebaseKeys.length;
          var randomI = Math.floor(Math.random() * numOfImgs);
          var randomKey = firebaseKeys[randomI];
          var img_url = plate.images[randomKey];
          var name = helpers.formatIdString(plate.key);

          return {
            name,
            restaurant,
            location,
            img_url
          };
        });

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
      });
    });
  }

  _getAddress(lat, lng) {
    fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`)
      .then((response) => response.json())
      .then((responseData) => {
        this.state.searchAddress = responseData.results[0].formatted_address.slice(0, 30) + '...';
      })
      .done();
  }

  componentWillReceiveProps(newProps) {
    if( !this.props.initialPosition && newProps.initialPosition ) {
      this.setState({
        status: 'Finding nearby restaurants...'
      });
      var {latitude, longitude} = newProps.initialPosition.coords;
      // do the magic here....
      this.setState({
        searchLatLng: {latitude, longitude}
      })
      this._getAddress(latitude, longitude);
      this.buildPlatesArray({latitude, longitude}, 60);
    }
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
    console.log('Done pressed');
    console.log('categoryFilter to apply', this.state.categoryFilter);
    // Applu category filter after Done is pressed.
  }

  handleSettingsConfig(categoryFilter) {
    console.log('handleSettingsConfig category', categoryFilter);
    this.setState({categoryFilter: categoryFilter});
  }

  _onPressSettings() {
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
      )
    } else {
      return (
        <View style={styles.container}>
          <PlatesDashBoard

            plates={this.state.plates}
            lastPosition={this.props.lastPosition}
            currPlateIndex={this.state.currPlateIndex}
            onSelection={this.handleSelection.bind(this)}
            onRejection={this.handleRejection.bind(this)} />
          <PlatesFooter address={this.state.searchAddress} />
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
