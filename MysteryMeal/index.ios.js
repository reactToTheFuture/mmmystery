/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var MapDisplaySection = require('./components/MapSection.io.js');

let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

let styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

class MysteryMeal extends React.Component{
  render() {
    return (
      <View style={styles.map}>
        <MapDisplaySection />
      </View>
    );
  }
}


AppRegistry.registerComponent('MysteryMeal', () => MysteryMeal);