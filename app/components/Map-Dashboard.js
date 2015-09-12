import React from 'react-native';
import Directions from './Directions';

import mapbox_api from '../utils/mapbox-api';

import RouteOverlay from './Route-Overlay';
import ArrivalOverlay from './Arrival-Overlay';
import Main from './Main';
import Map from './Map';

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
          var title = 'title';

          if(step.way_name) {
            title = step.way_name.replace(/\s/g, '-');
          }

          return {
            latitude,
            longitude,
            annotationImage,
            title,
            id: title,
            subtitle: ''
          }
        });

        var stepDirections = steps.map((step) => {
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

    this.setState({
      stepIndex
    });

    if( stepIndex === this.state.stepDirections.length-1 ) {
      this.setState({
        hasArrived: true
      });
    }
  }

  handleArrivalConfirmation() {
    this.props.navigator.push({
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
        <View style={styles.mapContainer}>
          <Directions
            stepDirections={this.state.stepDirections}
            stepIndex={this.state.stepIndex} />
          <Map
            userPosition={this.props.route.props.userPosition}
            stepAnnotations={this.state.stepAnnotations}
            onStepIncrement={this.handleStepIncrement.bind(this)}
            stepIndex={this.state.stepIndex} />
        </View>
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
  },
  mapContainer: {
    flex: 1,
    marginTop: 65,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingRight: 20,
    paddingLeft: 20 
  }
});

module.exports = MapDashBoard;