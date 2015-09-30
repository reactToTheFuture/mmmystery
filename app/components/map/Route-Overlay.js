import React from 'react-native';
import Overlay from 'react-native-overlay';
import Dimensions from 'Dimensions';
import globals from '../../../globalVariables';
import { Icon, } from 'react-native-icons';

import InitialLoadingOverlay from '../initial-loading/Initial-Loading-Overlay';

var window = Dimensions.get('window');

var {
  Image,
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;

class RouteOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 4,
    }
  }
  render() {
    return (
      <View style={this.props.isVisible && styles.overlayContainer}>
        {this.props.isLoading ?
          <InitialLoadingOverlay
            isVisible={true}
            status={this.state.status} />
        :
          <Overlay
            isVisible={this.props.isVisible}>
            <View style={[styles.overlay, styles.confirmationOverlay]}>
              <View style={styles.topText}>
                <Text style={[styles.text, styles.announcement]}>Okay, you're all set!</Text>
              </View>
              <View style={styles.content}>
                <View style={styles.reminderHeader}>
                  <Text style={styles.reminderHeaderText}>Before going on your merry way:</Text>
                </View>
                <View style={styles.reminderContent}>
                  <View style={styles.reminder}>
                    <Image
                      style={styles.reminderImage}
                      source={require('image!icon-route-step')}
                    />
                    <Text style={[styles.text, styles.reminderText]}>As this is a Mmmystery, you'll be given only one step at a time</Text>
                  </View>
                  <View style={styles.reminder}>
                    <Image
                      style={styles.reminderImage}
                      source={require('image!icon-route-progress')}
                    />
                    <Text style={[styles.text, styles.reminderText]}>We'll provide indicators to show your progress along the way</Text>
                  </View>
                  <View style={styles.reminder}>
                    <Image
                      style={styles.reminderImage}
                      source={require('image!icon-route-arrival')}
                    />
                    <Text style={[styles.text, styles.reminderText]}>You'll be notified when you have officially arrived</Text>
                  </View>
                </View>
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
    height: window.height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  topText: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  announcement: {
    marginBottom: 10,
    fontFamily: globals.fontDisplayRegular,
    fontSize: 28,
    color: globals.darkText,
  },
  content: {
    flex: 4,
    width: window.width - 40,
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20
  },
  reminderContent: {

  },
  button: {
    width: window.width,
    height: 60,
    flex: 0,
    backgroundColor: globals.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: globals.fontTextSemibold,
  },
  loadingOverlay: {
    backgroundColor: 'orange',
  },
  confirmationOverlay: {
    backgroundColor: '#ffffff',
  },
  reminder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  reminderText: {
    flex: 1,
    textAlign: 'left',
    fontFamily: globals.fontDisplayRegular,
    color: globals.mediumText,
    fontSize: 17,
    lineHeight: 25
  },
  reminderImage: {
    height: 42,
    width: 42,
    marginRight: 15
  },
  reminderHeaderText: {
    textAlign: 'center',
    fontFamily: globals.fontDisplaySemibold,
    color: globals.primaryDark,
    fontSize: 18,
    marginBottom: 15
  }

});
