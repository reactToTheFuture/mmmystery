import React from 'react-native';

var {
  View,
  Text,
  Image,
  Modal,
  TouchableHighlight,
  StyleSheet
} = React;

import globals from '../../../globalVariables';

class MealSubmittedOverlay extends React.Component {
  render() {
    return (
      <Modal
        visible={this.props.isVisible}>
        <View style={styles.confirmationOverlay}>
          <Text style={styles.headline}>Your image has been successfully uploaded!</Text>
          <TouchableHighlight
            underlayColor={'#ffffff'}
            onPress={this.props.onUploadAnother}>
            <Text style={styles.button}>Upload Another</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'#ffffff'}
            onPress={this.props.onReturnHome}>
            <Text style={styles.button}>Return Home</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

export default MealSubmittedOverlay;

let styles = StyleSheet.create({
  confirmationOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  headline: {
    marginBottom: 75,
    fontSize: 32,
    textAlign: 'center',
    fontFamily: globals.fontDisplayRegular,
    color: globals.darkText,
  },
  button: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: globals.fontTextSemibold,
    color: globals.primary,
  },
});
