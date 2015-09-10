var React = require('react-native');
var Directions = require('./Directions.io.js');

var mapbox_api = require('../utils/mapbox-api');

var RouteOverlay = require('./Route-Overlay');
var ArrivalOverlay = require('./Arrival-Overlay');
var Main = require('./Main');
var Map = require('./Map.io.js');

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
      stepProgress: 0,
      isLoading: true,
      isConfirmed: false,
      hasArrived: false,
      hasLeft: false
    };
  }

  componentDidMount() {
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
        stepAnnotations: res.stepAnnotations
      })
      this.handleDirectionsLoaded();
    })
    .catch((err) => { console.log('Something went wrong: ' + err); });
  }

  async getAsyncDirections(origin, destination) {
    var responseDirections = await (mapbox_api.getDirections(origin, destination)
      .then((data) => {
        var steps = data.routes[0].steps;
        console.log('data', data);
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

  handleDirectionsLoaded() {
    this.setState({
      isLoading: false
    });
  }

  handleRouteConfirmation() {
    this.setState({
      isConfirmed: true
    });
  }

  handleStepIncrement() {
    this.setState({
      stepProgress: this.state.stepProgress + 1
    });
  }

  handleArrived() {
    this.setState({
      hasArrived: true
    });
  }

  handleArrivalConfirmation() {
    this.setState({
      hasLeft: true
    });
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <Directions
            stepDirections={this.state.stepDirections}
            stepProgress={this.state.stepProgress}
            onStepIncrement={this.handleStepIncrement.bind(this)}
            onArrived={this.handleArrived.bind(this)} />
          <Map
            stepAnnotations={this.state.stepAnnotations}
            userPosition={this.props.route.props.userPosition} />
        </View>
        <RouteOverlay
          isLoading={this.state.isLoading}
          isVisible={this.state.isLoading || !this.state.isConfirmed}
          onConfirmation={this.handleRouteConfirmation.bind(this)} />
        <ArrivalOverlay
          imageInfo={this.props.route.props.image}
          isVisible={!this.state.hasLeft && this.state.hasArrived}
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