import React from 'react-native';
import Overlay from 'react-native-overlay';
import Dimensions from 'Dimensions';
import Colors from '../../../globalVariables';
import { Icon, } from 'react-native-icons';

var {
  width,
  height
} = Dimensions.get('window');

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
              <View style={styles.topText}>
                <Text style={[styles.text, styles.announcement]}>Okay, you're all set!</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.text}>This being a mmmystery and all, we're only going to show you one step at a time.</Text>
                <Text style={styles.text}>When you arrive at a step, click next to receive your next directions!</Text>
              </View>
              <TouchableHighlight
              onPress={this.props.onConfirmation}
              style={styles.button}>
                <Text style={styles.buttonText}>Awesome, let's go!</Text>
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
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
  },

  topText: {
    flex: 1,
    paddingTop: 100,
  },
  announcement: {
    marginBottom: 10,
    fontFamily: 'SanFranciscoDisplay-Regular',
    fontSize: 28,
    color: Colors.darkText,
    textAlign: 'center'
  },


  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
    width: width - 30,
  },
  button: {
    width: width,
    height: 60,
    flex: 0,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'SanFranciscoText-Semibold',
  },
  loadingOverlay: {
    backgroundColor: 'orange',
  },
  confirmationOverlay: {
    backgroundColor: '#ffffff',
    width: width - 30,
  }
});
