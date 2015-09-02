var React = require('react-native');
var PlatesDashBoard = require('./Plates-Dashboard');
var MapDashBoard = require('./Map-Dashboard');
var firebase_api = require('../utils/firebase');
var helpers = require('../utils/helpers');

var {
  View,
  StyleSheet
} = React;

let styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  }
});

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      watchID: null,
      currPlateIndex: -1,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      plates: []
    };
  }

  buildPlatesArray(userLocation,radius) {
    firebase_api.getNearbyRestaurants(userLocation, radius, (restaurantId, locationTuple, dist) => {
      firebase_api.getPlatesByRestaurantId(restaurantId)
      .then((plates) => {
        if( !plates.length ) {
          return;
        }

        var foodLocation = {
          lat: locationTuple[0],
          lng: locationTuple[1]
        };

        var morePlates = plates.map((plate) => {
          var firebaseKeys = Object.keys(plate.images);
          var numOfImgs = firebaseKeys.length;
          var randomI = Math.floor(Math.random() * numOfImgs);
          var randomKey = firebaseKeys[randomI];
          var img_url = plate.images[randomKey];

          return {
            name: plate.key,
            location: foodLocation,
            img_url
          };
        });

        this.setState({
          plates: helpers.shuffle(this.state.plates.concat(morePlates),this.state.currPlateIndex+1),
          currPlateIndex: this.state.currPlateIndex === -1 ? 0 : this.state.currPlateIndex
        });
      });
    });
  }

  handleSelection(image) {
    this.props.navigator.push({
      title: 'Map DashBoard',
      component: MapDashBoard,
      passProps: {
        image,
        userPosition: this.state.lastPosition
      }
    });
  }

  handleRejection(imageIndex) {
    this.setState({
      currPlateIndex: imageIndex
    });
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => {
        this.setState({initialPosition, lastPosition: initialPosition});
        var {latitude, longitude} = initialPosition.coords;

        this.buildPlatesArray({latitude, longitude}, 60);
      },
      (error) => console.warn(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.state.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({lastPosition});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.state.watchID);
  }

  render() {
    return (
      <PlatesDashBoard
        plates={this.state.plates}
        currPlateIndex={this.state.currPlateIndex}
        onSelection={this.handleSelection.bind(this)}
        onRejection={this.handleRejection.bind(this)}
      />
    );
  }
}

module.exports = Main;
