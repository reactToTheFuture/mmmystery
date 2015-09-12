import React from 'react-native';
import MapboxGLMap from 'react-native-mapbox-gl';
import {mapbox as mapbox_keys} from '../utils/config';
import { getRadians, metersToMiles } from '../utils/helpers';

var mapRef = 'directions';

var {
  StyleSheet,
  Text,
  View,
} = React;

var Map = React.createClass({
  mixins: [MapboxGLMap.Mixin],

  getInitialState() {
    var userCoords = this.props.userPosition.coords;
    var lat = userCoords.latitude;
    var lng = userCoords.longitude;

    return {
      meters: [],
      loaded: false,
      initialPosition: {
        latitude: lat,
        longitude: lng,
      },
      currentAnnotation: [],
      zoom: 15,
    };
  },

  getDistanceToNextAnnotation(userCoords, annotationCoords) {
    var userLat = userCoords.latitude;
    var userLng = userCoords.longitude;

    var annotationLat = annotationCoords.latitude;
    var annotationLng = annotationCoords.longitude;

    // http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371000; //meters
    var userLatRads = getRadians(userLat);
    var annotationLatRads = getRadians(annotationLat);
    var latDifference = getRadians(annotationLat - userLat);
    var lngDirrerence = getRadians(annotationLng - userLng);

    var a = Math.sin(latDifference/2) * Math.sin(latDifference/2) +
      Math.cos(userLatRads) * Math.cos(annotationLatRads) *
      Math.sin(lngDirrerence/2) * Math.sin(lngDirrerence/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    return metersToMiles(d);
  },

  onUpdateUserLocation(location) {
    var annotationCoords = this.state.currentAnnotation[0];
    var distanceToAnnotation = this.getDistanceToNextAnnotation(location, annotationCoords);

    if( distanceToAnnotation <= 0.05 ) {
      this.addNextAnnotation(this.props.stepAnnotations);
    }
  },

  addNextAnnotation(annotations) {
    var currentAnnotationIndex = this.props.stepIndex + 1;

    this.addAnnotations(mapRef, [annotations[currentAnnotationIndex]]);

    this.setState({
      currentAnnotation: [annotations[currentAnnotationIndex]]
    });

    this.props.onStepIncrement();
  },

  componentWillReceiveProps(newProps) {
    if(!this.state.currentAnnotation.length) {
      this.addNextAnnotation(newProps.stepAnnotations);
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <MapboxGLMap
          ref={mapRef}
          onUpdateUserLocation={this.onUpdateUserLocation}
          direction={0}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={true}
          accessToken={mapbox_keys.token}
          centerCoordinate={this.state.initialPosition}
          zoomLevel={this.state.zoom}
          style={styles.map}
          styleURL={'asset://styles/emerald-v7.json'} />
      </View>
    );
  },
});

var styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  container: {
    flex: 1
  }
});

module.exports = Map;

