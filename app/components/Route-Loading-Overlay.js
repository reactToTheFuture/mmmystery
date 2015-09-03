var React = require('react-native');
var Dimensions = require('Dimensions');
var window = Dimensions.get('window');
var Overlay = require('react-native-overlay');

var {
  View,
  Text,
  StyleSheet
} = React;

let styles = StyleSheet.create({
  loadingOverlay: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'orange',
    justifyContent: 'center'
  }
});

class RouteLoadingOverlay extends React.Component {
  render() {
    return (
      <Overlay
        isVisible={this.props.isVisible}
      >
        <View style={styles.loadingOverlay}>
          <Text>one moment while we get your route</Text>
        </View>
      </Overlay>
    );
  }
}

module.exports = RouteLoadingOverlay;