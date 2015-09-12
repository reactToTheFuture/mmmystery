import React from 'react-native';
import NavigationBar from 'react-native-navbar';

import Directions from './Directions';
import RouteOverlay from './Route-Overlay';
import ArrivalOverlay from './Arrival-Overlay';
import Map from './Map';

import mapbox_api from '../../utils/mapbox-api';

import CameraDashboard from '../Camera-Dashboard';
import Main from '../Main';

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
      isConfirmed: false,
      hasArrived: false
    };
  }

  componentWillMount() {
    var userCoords = this.props.route.props.userPosition.coords;

    var userPosition = {
      lat: userCoords.latitude,
      lng: userCoords.longitude
    };

    this.getAsyncDirections(userPosition, this.props.route.props.image.location)
    .then((res) => {
      this.setState({
        steps: res.steps,
        stepDirections: res.stepDirections,
        endStepIndex: res.stepDirections.length-1,
        stepAnnotations: res.stepAnnotations,
        isLoading: false
      })
    })
    .catch((err) => { console.log(`Problem getting directions: ${err}`); });
  }

  async getAsyncDirections(origin, destination) {
    var responseDirections = await (mapbox_api.getDirections(origin, destination)
      .then((data) => {
        var steps = data.routes[0].steps;
        var annotationImage = {
          url: 'http://img1.wikia.nocookie.net/__cb20130425161142/scribblenauts/images/a/a4/Hamburger.png',
          height: 25,
          width: 25
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

  handleStepIncrement() {
    var stepIndex = this.state.stepIndex + 1;

    if( stepIndex >= this.state.endStepIndex ) {
      this.setState({
        hasArrived: true
      });
      return;
    }

    this.setState({
      stepIndex
    });
  }

  handleArrivalConfirmation() {
    this.props.navigator.replace({
      title: 'Camera',
      component: CameraDashboard,
      navigationBar: (
        <NavigationBar
          title="Picture Time" />
      )
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Map
          userPosition={this.props.route.props.userPosition}
          stepAnnotations={this.state.stepAnnotations}
          onStepIncrement={this.handleStepIncrement.bind(this)}
          stepIndex={this.state.stepIndex}
          endStepIndex={this.state.endStepIndex} />
        <Directions
          stepDirections={this.state.stepDirections}
          stepIndex={this.state.stepIndex}
          endStepIndex={this.state.endStepIndex} />
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

let styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  }
});

module.exports = MapDashBoard;