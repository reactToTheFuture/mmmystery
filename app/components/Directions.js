import React from 'react-native';

import Dimensions from 'Dimensions';
var window = Dimensions.get('window');

import globals from '../../globalVariables';

let {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

class Directions extends React.Component{
  render () {
    return (
      <View style={styles.directions}>
      {this.props.stepIndex >= 0 && 
        <Text style={styles.direction}>{this.props.stepDirections[this.props.stepIndex]}</Text>
      }
      </View>
    );
  };
}

var width = window.width * 0.85;

let styles = StyleSheet.create({
  directions: {
    width,
    position: 'absolute',
    top: 10,
    left: window.width/2,
    transform: [{translateX: -width/2}],
    padding: 10,
    backgroundColor: globals.primaryDark,
  },
  direction: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'SanFranciscoText-Semibold',
  }
});

module.exports = Directions;