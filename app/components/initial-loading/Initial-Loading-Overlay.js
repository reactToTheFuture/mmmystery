var React = require('react-native');
var Overlay = require('react-native-overlay');

var Dimensions = require('Dimensions');
var window = Dimensions.get('window');
var LoadingComponent = require('./Loading-Component');

var {
  View,
  Modal,
  Text,
  StyleSheet
} = React;

class initialLoadingOverlay extends React.Component {
  render() {
    return (
      <View style={this.props.isVisible && styles.overlayContainer}>
        <Overlay
          isVisible={this.props.isVisible}>
          <LoadingComponent />
        </Overlay>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  overlayContainer: {
    position: 'relative',
    height: window.height,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    width: window.width,
    textAlign: 'center'
  }
});

module.exports = initialLoadingOverlay;