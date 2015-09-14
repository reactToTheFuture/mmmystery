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
    return Math.max(0, width);
  }

  formatTimeString(time) {
    var duration = time === '<1' || time === 1 ? 'min' : 'mins';
    return `${time} ${duration} away`;
  }

  render () {
    if(this.props.stepIndex < 0) {
      return (<View></View>);
    }

    return (
      <View style={styles.directions}>
        <Text style={[styles.text, styles.direction]}>{this.props.stepDirections[this.props.stepIndex]}</Text>
        <Text style={[styles.text, styles.timeAway]}>{this.formatTimeString(this.props.timeToAnnotation)} from next step...</Text>
        <Text style={[styles.text, styles.timeAway]}>{this.formatTimeString(this.props.timeToDestination)} from your meal!</Text>
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
  text: {
    color: '#ffffff',
    textAlign: 'center',
  },
  direction: {
    marginBottom: 5,
    fontSize: 22,
    fontFamily: 'SanFranciscoDisplay-Light',
  },
  timeAway: {
    marginBottom: 5,
    fontFamily: 'SanFranciscoText-Regular',
    fontSize: 16,
  }
});

module.exports = Directions;