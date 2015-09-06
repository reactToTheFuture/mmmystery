import React from 'react-native';
var Dimensions = require('Dimensions');
var window = Dimensions.get('window');
var Overlay = require('react-native-overlay');

var {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} = React;

class AddMealOverlay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      meal: ''
    };
  }

  handleTextInput(text) {
    this.setState({
      meal: text
    });
  }

  handleMealAdd() {
    this.props.onAddMeal(this.state.meal);
    this.props.onOverlayClose();
  }

  render() {
    return (
      <Overlay
        isVisible={this.props.isVisible}>
        <View style={styles.addMealOverlay}>
          <TextInput
            style={styles.textInput}
            onChangeText={this.handleTextInput.bind(this)}
            placeholder="What did you have?"
            placeholderTextColor="grey"
            value={this.state.meal}
          />
          <TouchableHighlight
            onPress={this.handleMealAdd.bind(this)}
            style={styles.addBtn}>
            <Text>ADD IT!</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.props.onOverlayClose}
            style={styles.cancelBtn}>
            <Text>CANCEL</Text>
          </TouchableHighlight>
        </View>
      </Overlay>
    );
  }
}

let styles = StyleSheet.create({
  addMealOverlay: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: window.width,
    height: window.height,
    backgroundColor: '#ffffff',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
  addBtn: {
  },
  cancelBtn: {
  }
});

module.exports = AddMealOverlay;