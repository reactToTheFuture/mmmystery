import React from 'react-native';

let {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

class Directions extends React.Component{
  render () {
    console.log(this.props.stepIndex);
    return (
      <View style={styles.directions}>
      {this.props.stepIndex >= 0 && 
        <Text>{this.props.stepDirections[this.props.stepIndex]}</Text>
      }
      </View>
    );
  };
}

let styles = StyleSheet.create({
  directions: {
  }
});

module.exports = Directions;