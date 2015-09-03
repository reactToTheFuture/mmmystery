var React = require('react-native');
var Directions = require('./Directions.io.js');

var mapbox_api = require('../utils/mapbox-api');

var RouteLoadingOverlay = require('./Route-Loading-Overlay');
var RouteConfirmationOverlay = require('./Route-Confirmation-Overlay');
var ArrivalOverlay = require('./Arrival-Overlay');
var Main = require('./Main');
var Map = require('./Map.io.js');

var {
  View,
  StyleSheet
} = React;

let styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  }
});

class MapDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepsDirections: [],
      stepProgress: 0,
      isLoading: true,
      isConfirmed: false,
      hasArrived: false,
      hasLeft: false
    };
  }

  componentDidMount() {
    var userCoords = this.props.userPosition.coords;

    var userPosition = {
      lat: userCoords.latitude,
      lng: userCoords.longitude
    };

    this.getAsyncDirections(userPosition, this.props.image.location)
    .then((response) => {
      this.setState({stepsDirections: response});
      this.handleDirectionsLoaded();
    })
    .catch((err) => { console.log('Something went wrong: ' + err); });
  }

  async getAsyncDirections(origin, destination) {
    var stepsToFollow = [];
    var responseDirections = await (mapbox_api.getDirections(origin, destination)
      .then((data) => {
        data.routes[0].steps.map((step) => {
          stepsToFollow.push(step.maneuver.instruction);
        });
        return stepsToFollow;
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
      <View
        style={styles.container}>
        <Directions
          stepsDirections={this.state.stepsDirections}
          stepProgress={this.state.stepProgress}
          onStepIncrement={this.handleStepIncrement.bind(this)}
          onArrived={this.handleArrived.bind(this)} />
        <Map 
          style={styles.map}
          userPosition={this.props.userPosition} />
        <RouteConfirmationOverlay
          isVisible={!this.state.isLoading && !this.state.isConfirmed}
          onConfirmation={this.handleRouteConfirmation.bind(this)} />
        <RouteLoadingOverlay
          isVisible={this.state.isLoading} />
        <ArrivalOverlay
          imageInfo={this.props.image}
          isVisible={!this.state.hasLeft && this.state.hasArrived} 
          onConfirmation={this.handleArrivalConfirmation.bind(this)} />
      </View>
    );
  }
}

module.exports = MapDashBoard;