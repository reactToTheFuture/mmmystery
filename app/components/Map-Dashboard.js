var React = require('react-native');
var Directions = require('./Directions.io.js');
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
      isLoading: true,
      isConfirmed: false,
      hasArrived: false,
      hasLeft: false
    };
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
          imageInfo={this.props.image}
          userPosition={this.props.userPosition}
          onDirectionsLoaded={this.handleDirectionsLoaded.bind(this)} 
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