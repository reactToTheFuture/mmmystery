var React = require('react-native');
var Directions = require('./Directions.io.js');
var RouteLoadingOverlay = require('./Route-Loading-Overlay');
var RouteConfirmationOverlay = require('./Route-Confirmation-Overlay');
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
      isConfirmed: false
    };
  }

  handleDirectionsLoaded() {
    this.setState({
      isLoading: false
    });
  }

  handleConfirmation() {
    this.setState({
      isConfirmed: true
    });
  }

  render() {
    return (
      <View
        style={styles.container}>
        <Directions
          image={this.props.image}
          userPosition={this.props.userPosition}
          onDirectionsLoaded={this.handleDirectionsLoaded.bind(this)} />
        <Map 
          style={styles.map}
          userPosition={this.props.userPosition} />
        <RouteLoadingOverlay
          isVisible={this.state.isLoading} />
        <RouteConfirmationOverlay
          isVisible={!this.state.isLoading && !this.state.isConfirmed}
          onConfirmation={this.handleConfirmation.bind(this)} />
      </View>
    );
  }
}

module.exports = MapDashBoard;