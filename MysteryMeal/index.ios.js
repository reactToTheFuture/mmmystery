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
  Image
} = React;

let styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  container: {
    paddingTop: 30,
    flex: 1,
    textAlign: 'center',
    flexDirection: 'column',
  },
  directions: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center'
  }
});

class MysteryMeal extends React.Component{
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.directions}>
            <Image
            style={{width: 25, height: 25}}
            source={{uri: 'http://etc.usf.edu/clipart/68200/68205/68205_487_w1-1_s_sm.gif'}}/>
            <Text> Turn right at Arizona 6th. </Text>
          </View>
          <View style={styles.map}>
            <MapDisplaySection />
          </View>
        </View>
    );
  }
}


AppRegistry.registerComponent('MysteryMeal', () => MysteryMeal);