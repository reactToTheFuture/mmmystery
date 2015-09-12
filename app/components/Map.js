import React from 'react-native';
import MapboxGLMap from 'react-native-mapbox-gl';
import {mapbox as mapbox_keys} from '../utils/config';
import { getRadians, metersToMiles, getDegrees } from '../utils/helpers';

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
    var latitude = userCoords.latitude;
    var longitude = userCoords.longitude;

    return {
      initialPosition: {
        latitude,
        longitude,
      },
      currentAnnotation: [],
    };
  },

  getDistanceToAnnotation(userCoords, annotationCoords) {
    // http://www.movable-type.co.uk/scripts/latlong.html
    var userLat = userCoords.latitude;
    var userLng = userCoords.longitude;

    var annotationLat = annotationCoords.latitude;
    var annotationLng = annotationCoords.longitude;

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

  getMidPoint(userCoords, annotationCoords) {
    // http://www.movable-type.co.uk/scripts/latlong.html
    var userLat = getRadians(userCoords.latitude);
    var userLng = getRadians(userCoords.longitude);

    var annotationLat = getRadians(annotationCoords.latitude);
    var annotationLng = getRadians(annotationCoords.longitude);

    var lngDirrerence = getRadians(annotationCoords.longitude - userCoords.longitude);

    var Bx = Math.cos(annotationLat) * Math.cos(lngDirrerence);
    var By = Math.cos(annotationLat) * Math.sin(lngDirrerence);

    var lat = Math.atan2( Math.sin(userLat)+Math.sin(annotationLat),
             Math.sqrt( (Math.cos(userLat)+Bx)*(Math.cos(userLat)+Bx) + By*By) );
    var lng = userLng + Math.atan2(By, Math.cos(userLat) + Bx);
    lng = (lng+3*Math.PI) % (2*Math.PI) - Math.PI;

    return {
      latitude: getDegrees(lat),
      longitude: getDegrees(lng)
    };
  },

  onUpdateUserLocation(location) {
    var annotationCoords = this.state.currentAnnotation[0];
    var distanceToAnnotation = this.getDistanceToAnnotation(location, annotationCoords);

    if( distanceToAnnotation <= 0.05 ) {
      this.addNextAnnotation(location, this.props.stepAnnotations);
    }
  },

  addNextAnnotation(userLocation, annotations) {
    var nextAnnotationIndex = this.props.stepIndex + 1;
    var nextAnnotation = annotations[nextAnnotationIndex];

    this.addAnnotations(mapRef, [nextAnnotation]);
    this.adjustMapPosition(userLocation, nextAnnotation);

    this.setState({
      currentAnnotation: [nextAnnotation]
    });


    setInterval(() => {
      this.props.onStepIncrement();
    },500);

  },

  getZoomLevel(distance) {
    if (distance >= 11) return 9;
    if (distance < 11 && distance >= 5) return 10;
    if (distance < 5 && distance >= 4) return 11;
    if (distance < 4 && distance >= 2.5) return 12;
    if (distance < 2 && distance >= 1.5) return 13;
    if (distance < 1.5 && distance >= 1) return 14;
    if (distance < 1) return 15;
  },

  adjustMapPosition(userLocation, nextAnnotation) {
    var midpoint = this.getMidPoint(userLocation, nextAnnotation);
    var distance = this.getDistanceToAnnotation(userLocation, nextAnnotation);
    var zoomLevel = this.getZoomLevel(distance);

    this.setCenterCoordinateZoomLevelAnimated(mapRef, midpoint.latitude, midpoint.longitude, zoomLevel);
  },

  componentWillReceiveProps(newProps) {
    // add first annotation
    if(!this.state.currentAnnotation.length) {
      this.addNextAnnotation(this.props.userPosition.coords, newProps.stepAnnotations);
    }
  },

  render() {
    return (
      <MapboxGLMap
        ref={mapRef}
        onUpdateUserLocation={this.onUpdateUserLocation}
        direction={0}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        showsUserLocation={true}
        zoomLevel={15}
        accessToken={mapbox_keys.token}
        centerCoordinate={this.state.initialPosition}
        style={styles.map}
        styleURL={'asset://styles/emerald-v7.json'} />
    );
  },
});

var styles = StyleSheet.create({
  map: {
    flex: 1,
  }
});

module.exports = Map;

