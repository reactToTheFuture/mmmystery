/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var MapDisplaySection = require('./components/MapSection.io.js');
var DisplayDirections = require('./components/DisplayDirections.io.js');


let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} = React;

let styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  container: {
    paddingTop: 30,
    flex: 1,
    flexDirection: 'column',
  },
});

class MysteryMeal extends React.Component{
  render() {
    return (
        <View style={styles.container}>
          <DisplayDirections />
          <View style={styles.map}>
            <MapDisplaySection />
          </View>
        </View>
    );
  }
}


AppRegistry.registerComponent('MysteryMeal', () => MysteryMeal);