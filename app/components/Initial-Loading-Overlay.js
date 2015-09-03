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
    flexDirection: 'column',
    justifyContent: 'center',
    width: window.width,
    height: window.height,
    backgroundColor: '#ffffff',
  }
});

class initialLoadingOverlay extends React.Component {
  render() {
    return (
      <Overlay
        isVisible={this.props.isVisible} >
        <View style={styles.loadingOverlay}>
          <Text>{this.props.status}</Text>
        </View>
      </Overlay>
    );
  }
}

module.exports = initialLoadingOverlay;