import React from 'react-native';

import { Icon } from 'react-native-icons';
import Dimensions from 'Dimensions';
import globals from '../../../globalVariables';

var {
  View,
  Text,
  Modal,
  TextInput,
  ActivityIndicatorIOS,
  TouchableHighlight,
  StyleSheet
} = React;

var window = Dimensions.get('window');

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
          <Text style={[styles.centerText, styles.status]}>{this.props.status}</Text>
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
            <Text style={[styles.centerText, styles.button]}>Add Meal and Upload Image!</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'#ffffff'}
            onPress={this.props.onOverlayClose}>
            <Text style={[styles.centerText, styles.button]}>Cancel</Text>
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

export default AddMealOverlay;

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
    paddingRight: 10,
    paddingBottom: 15,
    paddingLeft: 10,
    borderColor: globals.lightText,
    fontFamily: globals.fontTextRegular,
    borderWidth: 1,
  },
  centerText: {
    textAlign: 'center',
  },
  status: {
    marginBottom: 25,
    fontSize: 18,
    fontFamily: globals.fontTextSemibold,
    color: globals.darkText,
  },
  button: {
    marginBottom: 20,
    fontSize: 20,
    fontFamily: globals.fontTextSemibold,
    color: globals.primaryDark,
  },
  loadingIcon: {
    position: 'absolute',
    top: 100,
    left: (window.width/2 - 18),
    backgroundColor: "transparent",
  },
});
