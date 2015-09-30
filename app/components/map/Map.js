import React from 'react-native';
import MapboxGLMap from 'react-native-mapbox-gl';

import { mapbox as mapbox_keys } from '../../utils/config';
import { getRadians, kilometersToMiles, milesToMins, getDegrees } from '../../utils/helpers';

import { getDistance } from '../../utils/firebase-api';

import globals from '../../../globalVariables';

import { Icon } from 'react-native-icons';

var mapRef = 'directions';

var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
} = React;

var Map = React.createClass({
  mixins: [MapboxGLMap.Mixin],

  getInitialState() {
    var userCoords = this.props.userPosition.coords;
    var userLatitude = userCoords.latitude;
    var userLongitude = userCoords.longitude;

    var restaurantCoords = this.props.restaurantLocation;
    var restaurantLatitude = restaurantCoords.lat;
    var restaurantLongitude = restaurantCoords.lng;

    return {
      initialPosition: {
        latitude: userLatitude,
        longitude: userLongitude
      },
      currentPosition: {
        latitude: userLatitude,
        longitude: userLongitude
      },
      restaurantLocation: {
        latitude: restaurantLatitude,
        longitude: restaurantLongitude
      },
      currentAnnotation: [],
      buttonDown: false,
    };
  },

  getDistanceToAnnotation(userCoords, annotationCoords) {
    // http://www.movable-type.co.uk/scripts/latlong.html
    var userLat = userCoords.latitude;
    var userLng = userCoords.longitude;

    var annotationLat = annotationCoords.latitude;
    var annotationLng = annotationCoords.longitude;

    // returns kilometers
    var d = getDistance([userLat, userLng], [annotationLat, annotationLng]);

    return kilometersToMiles(d);
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

  getDistanceToRestaurant(userLocation) {
    var restaurantCoords = this.state.restaurantLocation;
    return this.getDistanceToAnnotation(userLocation, restaurantCoords);
  },

  getDistanceToNextAnnotation(userLocation) {
    var annotationCoords = this.state.currentAnnotation[0];
    return this.getDistanceToAnnotation(userLocation, annotationCoords);
  },

  onUpdateUserLocation(userLocation) {
    var distanceToNextAnnotation = this.getDistanceToNextAnnotation(userLocation);
    var timeToAnnotation = milesToMins(distanceToNextAnnotation);

    this.setState({
      currentPosition: userLocation
    });

    this.props.onLocationChange(timeToAnnotation);

    // (in miles)
    if( distanceToNextAnnotation <= 0.025 ) {
      this.addNextAnnotation(userLocation, this.props.stepAnnotations);
    }
  },

  addNextAnnotation(userLocation, annotations) {
    var nextAnnotation;
    var nextAnnotationIndex = this.props.stepIndex + 1;

    if( nextAnnotationIndex > this.props.lastStepIndex ) {
      this.props.onArrival();
      return;
    }

    this.props.onStepIncrement(nextAnnotationIndex);

    nextAnnotation = annotations[nextAnnotationIndex];

    this.addAnnotations(mapRef, [nextAnnotation]);
    this.adjustMapPosition(userLocation, nextAnnotation);

    this.setState({
      currentAnnotation: [nextAnnotation]
    }, () => {
      var timeToAnnotation = milesToMins(this.getDistanceToNextAnnotation(userLocation));
      this.props.onAnnotationChange(timeToAnnotation);
    });
  },

  getZoomLevel(distance) {
    if (distance >= 11) return 8;
    if (distance < 11 && distance >= 5) return 9;
    if (distance < 5 && distance >= 4) return 10;
    if (distance < 4 && distance >= 2.5) return 11;
    if (distance < 2 && distance >= 1.5) return 12;
    if (distance < 1.5 && distance >= 0.6) return 13;
    if (distance < 0.6 && distance >= 0.375) return 14;
    if (distance < 0.375 && distance >= 0.1875) return 15;
    if (distance < 0.1875 && distance >= 0.09375) return 16;
    if (distance < 0.09375) return 17;
  },

  adjustMapPosition(userLocation, nextAnnotation) {
    var midpoint = this.getMidPoint(userLocation, nextAnnotation);
    var distance = this.getDistanceToAnnotation(userLocation, nextAnnotation);
    var zoomLevel = this.getZoomLevel(distance);

    this.setCenterCoordinateZoomLevelAnimated(mapRef, midpoint.latitude, midpoint.longitude, zoomLevel);
  },

  recenterUser() {
    var userLocation = this.state.currentPosition;
    var currentAnnotation = this.state.currentAnnotation[0];
    this.adjustMapPosition(userLocation, currentAnnotation);
  },

  onButtonPress() {
    this.setState({
      buttonDown: true
    });
  },

  onButtonRelease() {
    this.setState({
      buttonDown: false
    });
  },

  componentWillReceiveProps(newProps) {
    // add first annotation
    if( !this.state.currentAnnotation.length && newProps.stepAnnotations.length > 0 ) {
      this.addNextAnnotation(this.props.userPosition.coords, newProps.stepAnnotations);
    }
  },

  render() {
    return (
      <View style={styles.mapContainer}>
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
          styleURL={'asset://styles/emerald-v8.json'} />
          <TouchableHighlight
            onPress={this.recenterUser}
            underlayColor='white'
            style={styles.currentLocationButton}
            onShowUnderlay={this.onButtonPress}
            onHideUnderlay={this.onButtonRelease}>
            <Image
              style={styles.icon}
              source={require('image!icon-map-current-location')}
            />
          </TouchableHighlight>
      </View>

    );
  },
});

export default Map;

var styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 40,
    left: 15,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 3,
    shadowColor: globals.lightText,
    shadowOpacity: 0.5,
    shadowRadius: .9,
    shadowOffset: {
      height: 1.4,
      width: 0
    }
  },
  icon: {
    width: 30,
    height: 30,
  },
});
