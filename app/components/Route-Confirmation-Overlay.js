var React = require('react-native');
var Dimensions = require('Dimensions');
var window = Dimensions.get('window');
var Overlay = require('react-native-overlay');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;

let styles = StyleSheet.create({
  button: {
  },
  confirmationOverlay: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: window.width,
    height: window.height,
    backgroundColor: '#ffffff'
  }
});

class RouteConfirmationOverlay extends React.Component {
  render() {
    return (
      <Overlay
        isVisible={this.props.isVisible}>
        <View style={styles.confirmationOverlay}>
          <Text>Okay, we're all set!</Text>
          <Text>This being a mmmystery and all, we're only going to show you one step at a time.</Text>
          <Text>When you arrive at a step, click next to receive your next directions!</Text>
          <TouchableHighlight
          onPress={this.props.onConfirmation}
          style={styles.button}>
            <Text>OKAY</Text>
          </TouchableHighlight>
        </View>
      </Overlay>
    );
  }
}

module.exports = RouteConfirmationOverlay;