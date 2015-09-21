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
  StyleSheet,
  Image,
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
          <View style={styles.addMealIconContainer}>
            <Image
              style={styles.addMealIcon}
              source={require('image!icon-add-mystery')}
            />
          </View>
          <Text style={[styles.leftText, styles.inputLabel]}>{this.props.status || 'What did you have to eat?'}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={this.handleTextInput.bind(this)}
              placeholder="Ex. Grilled Turkey Breast Sandwich"
              placeholderTextColor="#7F90A6"
              value={this.state.searchText}
            />
          </View>
          <TouchableHighlight
            underlayColor={globals.primaryLight}
            onPress={this.handleMealAdd.bind(this)}
            style={styles.mainBtn}>
            <Text style={[styles.centerText, styles.btnText]}>Add my Mmmystery</Text>
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
        <View style={styles.keyboardSpace}></View>
      </Modal>
    );
  }
}

export default AddMealOverlay;

let styles = StyleSheet.create({
  addMealOverlay: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  keyboardSpace: {
    flex: 2,
    backgroundColor: 'white'
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 345 * window.width/375,
    marginBottom: 20,
  },
  textInput: {
    flex: 3,
    height: 50,
    paddingTop: 15,
    paddingRight: 10,
    paddingBottom: 15,
    paddingLeft: 10,
    borderColor: '#DEE5F5',
    fontFamily: globals.fontTextRegular,
    borderWidth: 1,
  },
  centerText: {
    textAlign: 'center',
  },
  leftText: {
    textAlign: 'left'
  },
  inputLabel: {
    marginBottom: 25,
    fontSize: 18,
    fontFamily: globals.fontTextSemibold,
    color: globals.darkText,
  },
  addMealIcon: {
    height: 111,
    width: 231,
    flex: 0,
    padding: 3,
  },
  addMealIconContainer: {
    marginBottom: 35,
  },
  button: {
    marginBottom: 20,
    fontSize: 18,
    fontFamily: globals.fontTextSemibold,
    color: globals.primaryDark,
  },
  loadingIcon: {
    position: 'absolute',
    top: (window.height/2 - 18),
    left: (window.width/2 - 18),
    backgroundColor: "transparent",
  },
  mainBtn: {
    width: 345 * window.width/375,
    height: 63 * window.height/667,
    marginBottom: 20,
    paddingTop: 17,
    paddingBottom: 17,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: globals.primary,
  },
  btnText: {
    fontSize: 20 * window.width/375,
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: globals.fontTextSemibold,
  },
});
