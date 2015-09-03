'use strict';

var React = require('react-native');
var Main = require('./app/components/Main');
var CameraDashboard = require('./app/components/Camera-Dashboard');

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

  onRightButtonPress() {
    this.refs.nav.push({
      title: 'Camera',
      component: CameraDashboard,
      passProps: { navigator: this.refs.nav },
    })
  }

  render() {
    return (
      <NavigatorIOS
        ref="nav"
        style={styles.container}
        initialRoute={{
          title: 'Mystery Meal',
          component: Main,
          rightButtonTitle: 'camera',
          onRightButtonPress: this.onRightButtonPress.bind(this),
        }}
      />
    );
  }
}

AppRegistry.registerComponent('MysteryMeal', () => MysteryMeal);
