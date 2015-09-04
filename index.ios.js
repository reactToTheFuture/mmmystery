'use strict';

var React = require('react-native');
var Main = require('./app/components/Main');
var CameraDashboard = require('./app/components/Camera-Dashboard');
var NavigationBar = require('react-native-navbar');

let {
  AppRegistry,
  StyleSheet,
  Navigator,
  Text,
  View,
  Image
} = React;

var styles = StyleSheet.create({
  app: {
    flex: 1
  }
});

class MysteryMeal extends React.Component{
  cameraBtnPress(navigator, route) {
    navigator.push({
      title: 'Camera',
      component: CameraDashboard,
      navigationBar: (
        <NavigationBar
          title="Picture Time" />
      )
    })
  }

  renderScene(route, navigator) {
    const Component = route.component;
    let navBar = route.navigationBar;

    if (navBar) {
      navBar = React.addons.cloneWithProps(navBar, {
        navigator, route
      });
    }

    return (
      <View style={styles.app}>
        {navBar}
        <Component navigator={navigator} route={route} />
      </View>
    );
  }

  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        initialRoute={{
          component: Main,
          navigationBar: (
            <NavigationBar
              title="Mystery Meal"
              onNext={this.cameraBtnPress.bind(this)}
              hidePrev={true}
              nextTitle={"camera"} />
          )
        }}
      />
    );
  }
}

AppRegistry.registerComponent('MysteryMeal', () => MysteryMeal);
