var React = require('react-native');
var PlatesDashBoard = require('./Plates-Dashboard');
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
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      plates: []
    };
  }

  buildPlatesArray(locationObj,radius) {
    firebase_api.getNearbyRestaurants(locationObj, radius, (restaurantId, locationTuple, dist) => {
      firebase_api.getPlatesByRestaurantId(restaurantId)
      .then((plates) => {
        if( !plates.length ) {
          return;
        }

        var morePlates = plates.map((plate) => {
          var numOfImgs = plate.images.length;
          var randomI = Math.floor(Math.random() * numOfImgs);
          var img_url = plate.images[randomI];

          return {
            name: plate.key,
            location: locationObj,
            img_url
          };
        });

        this.setState({
          plates: helpers.shuffle(this.state.plates.concat(morePlates))
        });
      });
    });
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => {
        this.setState({initialPosition});
        var {latitude, longitude} = initialPosition.coords;

        this.buildPlatesArray({latitude, longitude}, 6);
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
      />
    );
  }
}

module.exports = Main;
