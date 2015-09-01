var React = require('react-native');
var DisplayDirections = require('./DisplayDirections.io.js');
var MapDisplaySection = require('./MapSection.io.js');

var {
  View,
  StyleSheet
} = React;

let styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  }
});

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      watchID: null,
      initialPosition: 'unknown',
      lastPosition: 'unknown'
    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => this.setState({initialPosition}),
      (error) => console.warn(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.state.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({lastPosition});
    });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.state.watchID);
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <DisplayDirections />
        <View style={styles.map}>
          <MapDisplaySection />
        </View>
      </View>
    );
  }
}

module.exports = Main;
