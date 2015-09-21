import React from 'react-native';
import Dimensions from 'Dimensions';

import { Icon } from 'react-native-icons';
import globals from '../../../globalVariables';

var window = Dimensions.get('window');
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
      <View style={styles.container}>
        <Text style={[styles.text, styles.direction]}>{this.props.stepDirections[this.props.stepIndex]}</Text>
        { this.props.timeToAnnotation && <View style={styles.nextStep}>
            <Image
              style={styles.icon}
              source={require('image!icon-directions-walker')}
            />
            <Text style={[styles.text, styles.timeAway]}>
              {this.formatTimeString(this.props.timeToAnnotation)} from next step...
            </Text>
          </View>
        }
        <View style={styles.progressBarContainer}></View>
        <View style={[{width: this.getProgressBarWidth()}, styles.progressBar]}></View>
      </View>
    );
  };
}

export default Directions;

let styles = StyleSheet.create({
  progressBar: {
    height: 5,
    backgroundColor: globals.primaryDark,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  progressBarContainer: {
    height: 5,
    width: window.width,
    bottom: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: '#ffe8a3',
  },
  nextStep: {
    flex: 1,
    flexDirection: 'row'
  },
  container: {
    height: 75,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  text: {
    color: globals.mediumText,
  },
  icon: {
    height: 18,
    width: 10,
    flex: 0,
    marginRight: 10
  },
  direction: {
    marginBottom: 7,
    fontSize: 22,
    fontFamily: globals.fontDisplaySemibold,
    color: globals.darkText,
    textAlign: 'center'
  },
  timeAway: {
    fontFamily: globals.fontTextRegular,
    fontSize: 16,
    flex: 1,
  }
});
