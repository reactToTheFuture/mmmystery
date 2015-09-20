import React from 'react-native';
import NavigationBar from 'react-native-navbar';

import CameraDashboard from '../camera/Camera-Dashboard';
import Main from '../main/Main';

import Directions from './Directions';
import RouteOverlay from './Route-Overlay';
import ArrivalOverlay from './Arrival-Overlay';
import Map from './Map';

import mapbox_api from '../../utils/mapbox-api';
import firebase_api from '../../utils/firebase-api';
import { formatNameString } from '../../utils/helpers';

import { findIconForCategory } from '../../utils/filters-data'

var {
  View,
  StyleSheet
} = React;

class MapDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [],
      stepAnnotations: [],
      stepDirections: [],
      stepIndex: -1,
      lastStepIndex: null,
      isLoading: true,
      timetoAnnotation: null,
      isConfirmed: false,
      hasArrived: false
    };
  }

  // [] gets an array of categories for the chosen plate
  componentWillMount() {
    var userCoords = this.props.route.props.userPosition.coords;

    var userPosition = {
      lat: userCoords.latitude,
      lng: userCoords.longitude
    };

    var timeStart = Date.now();

    this.getAsyncDirections(userPosition, this.props.route.props.image.location, this.props.route.props.image.category)
    .then((res) => {
      var wait = 0;
      var timeEnd = Date.now();
      var timeElapsed = timeEnd - timeStart;

      // we get route so fast, make sure we wait at least 1 sec
      if( timeElapsed < 3000 ) {
        wait = 4000 - timeElapsed;
      }

      setTimeout(() => {
        this.setState({
          steps: res.steps,
          stepDirections: res.stepDirections,
          lastStepIndex: res.stepDirections.length-1,
          stepAnnotations: res.stepAnnotations,
          isLoading: false
        });
      }, wait);

    })
    .catch((err) => { console.log(`Problem getting directions: ${err}`); });
  }

  async getAsyncDirections(origin, destination, category) {
    var responseDirections = await (mapbox_api.getDirections(origin, destination)
      .then((data) => {
        var steps = data.routes[0].steps;
        var url = findIconForCategory(category);
        var annotationImage = {
              url: url,
              height: 50,
              width: 50,
            };

        var stepAnnotations = steps.map((step) => {
          var coords = step.maneuver.location.coordinates;
          var latitude = coords[1];
          var longitude = coords[0];
          var title = '';

          if(step.way_name) {
            title = step.way_name.replace(/\s/g, '-');
          } else {
            title = 'arrival';
          }

          return {
            latitude,
            longitude,
            annotationImage,
            title,
            id: title
          }
        });

        var stepDirections = steps.map((step) => {
          if( step.maneuver.instruction === 'You have arrived at your destination' ) {
            return "You're almost there...";
          }

          return step.maneuver.instruction;
        });

        return {
          steps,
          stepAnnotations,
          stepDirections
        };

      }));
    return responseDirections;
  }

  handleRouteConfirmation() {
    this.setState({
      isConfirmed: true
    });
  }

  handleStepIncrement(stepIndex) {
    this.setState({
      stepIndex
    });
  }

  handleLocationChange(timeToAnnotation) {
    this.setState({
      timeToAnnotation
    });
  }

  handleAnnotationChange(timeToAnnotation) {
    this.setState({
      timeToAnnotation
    });
  }

  handleArrival() {
    if(this.state.hasArrived) {
      return;
    }

    this.setState({
      hasArrived: true
    });

    firebase_api.addAdventureToUser(this.props.user.id, this.props.route.props.image.img_key);
  }

  handleArrivalConfirmation() {
    var restaurantName = this.props.route.props.image.restaurant;

    this.props.navigator.replace({
      title: 'Camera',
      component: CameraDashboard,
      props: {
        restaurant: {
          name: restaurantName,
          id: formatNameString(restaurantName)
        }
      },
      navigationBar: (
        <NavigationBar
          title="Picture Time" />
      )
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Directions
          stepDirections={this.state.stepDirections}
          stepIndex={this.state.stepIndex}
          timeToAnnotation={this.state.timeToAnnotation} />
        <Map
          userPosition={this.props.route.props.userPosition}
          restaurantLocation={this.props.route.props.image.location}
          stepAnnotations={this.state.stepAnnotations}
          onStepIncrement={this.handleStepIncrement.bind(this)}
          onArrival={this.handleArrival.bind(this)}
          onLocationChange={this.handleLocationChange.bind(this)}
          onAnnotationChange={this.handleAnnotationChange.bind(this)}
          stepIndex={this.state.stepIndex}
          lastStepIndex={this.state.lastStepIndex} />
        <RouteOverlay
          isLoading={this.state.isLoading}
          isVisible={this.state.isLoading || !this.state.isConfirmed}
          onConfirmation={this.handleRouteConfirmation.bind(this)} />
        <ArrivalOverlay
          imageInfo={this.props.route.props.image}
          isVisible={this.state.hasArrived}
          onConfirmation={this.handleArrivalConfirmation.bind(this)} />
      </View>
    );
  }
}

export default MapDashBoard;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  }
});
