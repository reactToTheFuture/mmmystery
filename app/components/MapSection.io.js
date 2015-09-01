var React = require('react-native');
var MapboxGLMap = require('react-native-mapbox-gl');
var mapRef = 'mapRef';
var mapbox_keys = require('../utils/config').mapbox;

var {
  StyleSheet,
  Text,
  View,
} = React;

var styles = StyleSheet.create({
  map: {
    flex: 5,
  },
  container: {
    flexDirection: 'column',
    flex: 2
  },
});

var MapDisplaySection = React.createClass({
  mixins: [MapboxGLMap.Mixin],
  getInitialState: function() {
    return {
      meters: [],
      loaded: false,
      center: { // Santa Monica
        latitude: 34.019370,
        longitude: -118.494474,
      },
      annotations: [{
         latitude: 34.019370,
         longitude: -118.494474,
         title: 'MakerSquare',
         subtitle: '',

         annotationImage: {
           url: 'https://pbs.twimg.com/profile_images/542918126111703041/wP1SX3kg_400x400.png',
           height: 25,
           width: 25
         },
         id: 'MKS'
       }],
      zoom: 15,
    };
  },

  onRegionChange(location) {
    // console.log('onRegionChange', this.state.isMoving);
  },
  onRegionWillChange(location) {
    // console.log('onRegionWillChange', location);
  },
  render () {
    return (
      <View style={styles.container}>
        <MapboxGLMap
          style={styles.map}
          direction={0}
          rotateEnabled={false}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={true}
          ref={mapRef}
          annotations={this.state.annotations}
          accessToken={mapbox_keys.token}
          styleURL={'asset://styles/mapbox-streets-v7.json'}
          centerCoordinate={this.state.center}
          userLocationVisible={true}
          zoomLevel={this.state.zoom}
          />
      </View>
    );
  },
});

module.exports = MapDisplaySection;

