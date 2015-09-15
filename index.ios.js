'use strict';

import React from 'react-native';
import NavigatorBar from 'react-native-navbar';
import Login from './app/components/login/Login';

let {
  AppRegistry,
  StyleSheet,
  AlertIOS,
  Navigator,
  Text,
  View,
  Image
} = React;

class MysteryMeal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      initialPosition: null,
      lastPosition: null,
      user: null
    };
  }

  renderScene(route, navigator) {
    let Component = route.component;
    let navBar = route.navigationBar;

    if (navBar) {
      navBar = React.addons.cloneWithProps(navBar, {
        navigator, route
      });
    }

    return (
      <View style={styles.app}>
        {navBar}
        <Component user={this.state.user} navigator={navigator} route={route} initialPosition={this.state.initialPosition} lastPosition={this.state.lastPosition} />
      </View>
    );
  }

  getUserLocation(count) {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => {
        this.setState({initialPosition});
      },
      (error) => {
        count = !count ? 1 : (count + 1);
        var txt = count <= 3 ? 'We are having trouble finding your location.' : 'We can\'t locate you.\nEnsure your location service is enabled.';
        AlertIOS.alert(
          'Yikes',
          txt,
          [
            {text: 'Try Again', onPress: this.getUserLocation.bind(this, count)}
          ]
        )
        console.warn(error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.state.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({lastPosition});
    });
  }

  handleLogin(user) {
    this.setState({
      user
    });
  }

  componentDidMount() {
    this.getUserLocation();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.state.watchID);
  }

  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        initialRoute={{
          component: Login,
          props: {
            onLogin: this.handleLogin.bind(this)
          }
        }}
      />
    );
  }
}

var styles = StyleSheet.create({
  app: {
    flex: 1,
    position: 'relative',
  }
});

AppRegistry.registerComponent('MysteryMeal', () => MysteryMeal);
