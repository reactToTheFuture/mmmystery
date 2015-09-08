import React from 'react-native';
import Dimensions from 'Dimensions';
import Overlay from 'react-native-overlay';

var window = Dimensions.get('window');

var {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} = React;

let styles = StyleSheet.create({
  confirmationOverlay: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: window.width,
    height: window.height,
    backgroundColor: '#ffffff',
  },
  button: {
  }
});

class MealSubmittedOverlay extends React.Component {
  render() {
    return (
      <Overlay
        isVisible={this.props.isVisible}>
        <View style={styles.confirmationOverlay}>
          <Text>Your image has been successfully uploaded!</Text>
          <Text>Play again!</Text>
          <TouchableHighlight
            onPress={this.props.onConfirmation}
            style={styles.button}>
            <Text>SOUNDS GOOD</Text>
          </TouchableHighlight>
        </View>
      </Overlay>
    );
  }
}

module.exports = MealSubmittedOverlay;
