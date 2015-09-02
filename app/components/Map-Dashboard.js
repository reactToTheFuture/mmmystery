var React = require('react-native');
var Directions = require('./Directions.io.js');
var Map = require('./Map.io.js');
var Dimensions = require('Dimensions');
var window = Dimensions.get('window');

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
  },
  isLoading: {
    backgroundColor: 'orange'
  }
});

class MapDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  onDirectionsLoaded() {
    this.setState({
      isLoading: false
    });
  }

  render() {
    return (
      <View style={[styles.container, this.state.isLoading && styles.isLoading]}>
        <Directions
          image={this.props.image}
          userPosition={this.props.userPosition}
          onDirectionsLoaded={this.onDirectionsLoaded.bind(this)}
        />
        <View style={styles.map}>
          <Map 
            userPosition={this.props.userPosition}
          />
        </View>
      </View>
    );
  }
}

module.exports = MapDashBoard;