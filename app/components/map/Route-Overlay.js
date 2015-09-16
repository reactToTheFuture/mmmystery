import React from 'react-native';
import Overlay from 'react-native-overlay';

import Dimensions from 'Dimensions';

var window = Dimensions.get('window');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;

class RouteOverlay extends React.Component {
  render() {
    return (
      <View style={this.props.isVisible && styles.overlayContainer}>
        {this.props.isLoading ?
          <Overlay
            isVisible={this.props.isVisible}>
            <View style={[styles.overlay, styles.loadingOverlay]}>
              <Text>one moment while we get your route</Text>
            </View>
          </Overlay>
        :
          <Overlay
            isVisible={this.props.isVisible}>
            <View style={[styles.overlay, styles.confirmationOverlay]}>
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
        }
      </View>
    );
  }
}

export default RouteOverlay;

let styles = StyleSheet.create({
  overlayContainer: {
    position: 'relative',
    height: window.height,
  },
  button: {
  },
  overlay: {
    flex: 1,
    justifyContent: 'center'
  },
  loadingOverlay: {
    backgroundColor: 'orange',
  },
  confirmationOverlay: {
    backgroundColor: '#ffffff',
  }
});
