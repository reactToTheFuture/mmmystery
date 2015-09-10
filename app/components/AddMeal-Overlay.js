import React from 'react-native';

var {
  View,
  Text,
  Modal,
  TextInput,
  ActivityIndicatorIOS,
  TouchableHighlight,
  StyleSheet
} = React;

var { Icon } = require('react-native-icons');

var Dimensions = require('Dimensions');
var window = Dimensions.get('window');
var globals = require('../../globalVariables');

class AddMealOverlay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      meal: '',
      isLoading: false
    };
  }

  handleTextInput(text) {
    this.setState({
      meal: text
    });
  }

  handleMealAdd() {
    this.setState({
      isLoading: true
    });

    this.props.onAddMeal(this.state.meal);
  }

  render() {
    return (
      <Modal
        visible={this.props.isVisible}>
        <View style={styles.addMealOverlay}>
          <View style={styles.inputContainer}>
            <Icon
              name='ion|fork'
              size={30}
              color={globals.lightText}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.textInput}
              onChangeText={this.handleTextInput.bind(this)}
              placeholder="What did you have?"
              placeholderTextColor="grey"
              value={this.state.searchText}
            />
          </View>
          <TouchableHighlight
            underlayColor={'#ffffff'}
            onPress={this.handleMealAdd.bind(this)}>
            <Text style={[styles.centerText, styles.button]}>ADD IT!</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'#ffffff'}
            onPress={this.props.onOverlayClose}>
            <Text style={[styles.centerText, styles.button]}>CANCEL</Text>
          </TouchableHighlight>
          <ActivityIndicatorIOS
            animating={this.state.isLoading}
            style={styles.loadingIcon}
            size="large"
          />
        </View>
      </Modal>
    );
  }
}

let styles = StyleSheet.create({
  searchIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  addMealOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: window.width,
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 50,
  },
  textInput: {
    flex: 3,
    height: 50,
    paddingTop: 15,
    paddingRight: 5,
    paddingBottom: 15,
    paddingLeft: 5,
    borderColor: globals.lightText,
    fontFamily: 'SanFranciscoText-Regular',
    borderWidth: 1,
  },
  centerText: {
    textAlign: 'center',
  },
  button: {
    marginBottom: 20,
    fontSize: 20,
    fontFamily: 'SanFranciscoText-Semibold',
    color: globals.primary,
  },
  loadingIcon: {
    position: 'absolute',
    top: 100,
    left: (window.width/2 - 18),
    backgroundColor: "transparent",
  },
});

module.exports = AddMealOverlay;