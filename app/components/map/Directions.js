import React from 'react-native';

import Dimensions from 'Dimensions';
var window = Dimensions.get('window');

import globals from '../../../globalVariables';

var directionsBoxWidth = window.width * 0.85;
var progressBarFullWidth = directionsBoxWidth - 20;

let {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

class Directions extends React.Component {

  getProgressBarWidth() {
    var percent = this.props.stepIndex / this.props.stepDirections.length;
    var width = percent * progressBarFullWidth;
    console.log(this.props.stepIndex, this.props.stepDirections.length, percent);
    return Math.max(0, width);
  }

  render () {
    return (
      <View style={styles.directions}>
        {this.props.stepIndex >= 0 && 
          <Text style={styles.direction}>{this.props.stepDirections[this.props.stepIndex]}</Text>
        }
        <View style={[{width: this.getProgressBarWidth()}, styles.progressBar]}></View>
      </View>
    );
  };
}

let styles = StyleSheet.create({
  progressBar: {
    height: 5,
    backgroundColor: '#ffffff'
  },
  directions: {
    width: directionsBoxWidth,
    position: 'absolute',
    top: 10,
    left: window.width/2,
    transform: [{translateX: -directionsBoxWidth/2}],
    padding: 10,
    backgroundColor: globals.primaryDark,
  },
  direction: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 25,
    fontFamily: 'SanFranciscoDisplay-Light',
  }
});

module.exports = Directions;