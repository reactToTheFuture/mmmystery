'use strict';

var React = require('react-native');
var NavigatorBar = require('react-native-navbar');
var Login = require('./app/components/Login');

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

  getUserLocation() {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => {
        this.setState({initialPosition});
      },
      (error) => {
        AlertIOS.alert(
          'Yikes',
          'We are having trouble finding your location.',
          [
            {text: 'Try Again', onPress: this.getUserLocation.bind(this)}
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
