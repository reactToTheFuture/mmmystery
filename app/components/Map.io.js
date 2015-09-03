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
  }
});

var Map = React.createClass({
  mixins: [MapboxGLMap.Mixin],
  getInitialState: function() {
    var userCoords = this.props.userPosition.coords;
    var lat = userCoords.latitude;
    var lng = userCoords.longitude;
    return {
      meters: [],
      loaded: false,
      userPosition: {
        latitude: lat,
        longitude: lng,
      },
      annotations: [{
         latitude: lat,
         longitude: lng,
         title: 'MakerSquare',
         subtitle: '',
         annotationImage: {
           url: 'http://img1.wikia.nocookie.net/__cb20130425161142/scribblenauts/images/a/a4/Hamburger.png',
           height: 25,
           width: 25
         },
         id: 'MKS'
       }],
      zoom: 15,
    };
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
          centerCoordinate={this.state.userPosition}
          zoomLevel={this.state.zoom} />
      </View>
    );
  },
});

module.exports = Map;

