import React from 'react-native';

var {
  View,
  Text,
  Image,
  Modal,
  TouchableHighlight,
  StyleSheet
} = React;

class MealSubmittedOverlay extends React.Component {
  render() {
    return (
      <Modal
        visible={this.props.isVisible}>
        <View style={styles.confirmationOverlay}>
          <Text>Your image has been successfully uploaded!</Text>
          <Text>Play again!</Text>
          <TouchableHighlight
            onPress={this.props.onConfirmation}
            style={styles.button}>
            <Text>SOUNDS GOOD</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

let styles = StyleSheet.create({
  confirmationOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  button: {
  }
});

module.exports = MealSubmittedOverlay;
