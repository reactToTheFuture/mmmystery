'use strict';

var React = require('react-native');
var FBSDKCore = require('react-native-fbsdkcore');
var FBSDKLogin = require('react-native-fbsdklogin');

var Main = require('./Main');
var NavigationBar = require('react-native-navbar');
var CameraDashboard = require('./Camera-Dashboard');

var {
  StyleSheet,
  AlertIOS,
  View
} = React;

var {
  FBSDKLoginButton,
} = FBSDKLogin;


var {
  FBSDKAccessToken
} = FBSDKCore;

class Login extends React.Component {

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

  switchToMain() {
    this.props.navigator.push({
      component: Main,
      navigationBar: (
        <NavigationBar
          title="Mystery Meal"
          onNext={this.cameraBtnPress}
          hidePrev={true}
          nextTitle={"camera"} />
      )
    });
  }

  render() {
    return (
      <View style={styles.loginContainer}>
        <FBSDKLoginButton
          style={styles.loginButton}
          onLoginFinished={(error, result) => {
            if (error) {
              AlertIOS.alert(
                'Error Logging In'
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')}
                ]
              );
              return;
            }
            if (result.isCanceled) {
              AlertIOS.alert(
                'Login Canceled'
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')}
                ]
              );
              return;
            }
            FBSDKAccessToken.getCurrentAccessToken((token) => {
              if (token) {
                console.log(token);
              }
            });
            console.log('Here inside login');
            this.switchToMain.call(this);
          }}
          onLogoutFinished={() => alert('Logged out.')}
          readPermissions={[]}
          publishPermissions={[]}/>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  loginContainer: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    width: 200,
    height: 50,
    shadowRadius: 5,
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowOffset: {width: 0, height: 0},
  }
});

module.exports = Login;
