'use strict';

var React = require('react-native');

var InitialLoadingOverlay = require('./Initial-Loading-Overlay');
var PlatesDashBoard = require('./Plates-Dashboard');
var MapDashBoard = require('./Map-Dashboard');
var NavigationBar = require('react-native-navbar');
var firebase_api = require('../utils/firebase-api');
var helpers = require('../utils/helpers');
var FBSDKLogin = require('react-native-fbsdklogin');
var Login = require('./Login');
var {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} = React;

var {
  FBSDKLoginManager,
} = FBSDKLogin;

let styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  mainContainer: {
    flex: 0.1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  footer: {
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
});

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'Finding your location...',
      watchID: null,
      currPlateIndex: -1,
      plates: []
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

  componentWillReceiveProps(newProps) {
    if( !this.props.initialPosition && newProps.initialPosition ) {
      this.setState({
        status: 'Finding nearby restaurants...'
      });
      var {latitude, longitude} = newProps.initialPosition.coords;
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

  _onPressButton() {
   FBSDKLoginManager.logOut();
   this.props.route.props.responseToken();
   this.props.navigator.popToTop();
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <TouchableHighlight
        onPress={this._onPressButton.bind(this)}>
          <Text>LogOut test</Text>
        </TouchableHighlight>
        <InitialLoadingOverlay
          isVisible={!this.state.plates.length}
          status={this.state.status} />
        <PlatesDashBoard
          plates={this.state.plates}
          lastPosition={this.props.lastPosition}
          currPlateIndex={this.state.currPlateIndex}
          onSelection={this.handleSelection.bind(this)}
          onRejection={this.handleRejection.bind(this)} />
        <View style={styles.footer}>
          <Text>This is a footer</Text>
          <TouchableHighlight>
            <Text>Settings</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

module.exports = Main;
