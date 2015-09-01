'use strict';

var React = require('react-native');
var Main = require('./app/components/Main');

let {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  Text,
  View,
  Image
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

class MysteryMeal extends React.Component{
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Mystery Meal',
          component: Main
        }}
      />
    );
  }
}

AppRegistry.registerComponent('MysteryMeal', () => MysteryMeal);
