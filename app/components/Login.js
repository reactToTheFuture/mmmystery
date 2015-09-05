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
  View,
  TouchableHighlight,
  Text
} = React;

// var {
//   FBSDKLoginButton,
// } = FBSDKLogin;

var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKLoginManager,
} = FBSDKLogin;


var {
  FBSDKAccessToken,
  FBSDKGraphRequest
} = FBSDKCore;

var fetchProfileRequest = new FBSDKGraphRequest((error, result) => {
  if (error) {
    alert('Error making request.');
  } else {
    console.log('fetchProfileRequest');
    console.log(result);
  }
}, '/me');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
    };
  }

  getAccesToken() {

  }

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

  _onPressButton(){
    // FBSDKLoginManager.setLoginBehavior(GlobalStore.getItem('behavior', 'native'));
    FBSDKLoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends'], (error, result) => {
      if (error) {
        alert('Error logging in.');
      } else {
        if (result.isCanceled) {
          alert('Login cancelled.');
        } else {
          console.log(result);
          console.log('Inside componentDidMount');
          FBSDKAccessToken.getCurrentAccessToken((token) => {
            if (token) {
              console.log('tokenFBSDK', token);
              this.setState(token);
              console.log(this.state.token);
            } else {
              // console.log(this.state.token);
              console.log('No token founded');
            }
          });
          fetchProfileRequest.start();
        }
      }
    });
  };

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

  // render() {
  //   return (
  //     <View style={styles.loginContainer}>
  //       <FBSDKLoginButton
  //         style={styles.loginButton}
  //         onLoginFinished={(error, result) => {
  //           if (error) {
  //             AlertIOS.alert(
  //               'Error Logging In'
  //               [
  //                 {text: 'OK', onPress: () => console.log('OK Pressed')}
  //               ]
  //             );
  //             return;
  //           }
  //           if (result.isCanceled) {
  //             AlertIOS.alert(
  //               'Login Canceled'
  //               [
  //                 {text: 'OK', onPress: () => console.log('OK Pressed')}
  //               ]
  //             );
  //             return;
  //           }
  //           console.log('Here inside login');
  //           console.log('result', result);
  //           this.getAccesToken();
  //           this.switchToMain.call(this);
  //         }}
  //         onLogoutFinished={() => alert('Logged out.')}
  //         readPermissions={[]}
  //         publishPermissions={['publish_actions']}/>
  //     </View>
  //   );
  // }

  render() {
    return (
      <TouchableHighlight
      style={styles.loginButton}
      onPress={this._onPressButton}>
       <Text>Proper Touch Handling</Text>
      </TouchableHighlight>
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
