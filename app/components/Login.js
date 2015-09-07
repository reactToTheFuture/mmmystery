'use strict';

var React = require('react-native');
var FBSDKCore = require('react-native-fbsdkcore');
var FBSDKLogin = require('react-native-fbsdklogin');

var Main = require('./Main');
var NavigationBar = require('react-native-navbar');
var CameraDashboard = require('./Camera-Dashboard');
var FBSDKLogin = require('react-native-fbsdklogin');

var {
  StyleSheet,
  AlertIOS,
  View,
  TouchableHighlight,
  Text
} = React;

var {
  FBSDKLoginManager,
} = FBSDKLogin;


var {
  FBSDKAccessToken,
  FBSDKGraphRequest
} = FBSDKCore;

 class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      responseToken: false,
      result: null,
      userInfo: null,
    };
  }

  async getAccesToken() {
    var responseToken = await (FBSDKAccessToken.getCurrentAccessToken((token) => {
      if (token) {
      this.setState({token});

      // GraphQL query for user information
      let fetchProfileRequest = new FBSDKGraphRequest((error, result) => {
        console.log('FBSDKGraphRequest', error, result);
        this.setState({userInfo: result});
        alert('Welcome ' + result.first_name + "!");
      }, 'me?fields=first_name,last_name,picture');
      fetchProfileRequest.start(0);

      this.switchToMain();
      } else {
        console.log('No token founded');
      }
      this.setState({responseToken: true});
    }));
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

  componentDidMount(){
    this.getAccesToken();
  }

  _onPressButton(){
    var _this = this;
    FBSDKLoginManager.setLoginBehavior('native');
    FBSDKLoginManager.setDefaultAudience('friends');
    FBSDKLoginManager.logInWithReadPermissions([], (error, result) => {
      if (error) {
        alert('Error logging in.');
      } else {
        if (result.isCanceled) {
          alert('Login cancelled.');
        } else {
          console.log(result);
          this.setState({result});
          this.getAccesToken();
        }
      }
    });
    // FBSDKLoginManager.logOut(); link with logOut screnn
  };

  switchToMain() {
    this.props.navigator.push({
      component: Main,
      props: {
        result: this.state.result,
        token: this.state.token,
        userInfo: this.state.userInfo
      },
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
    if (!this.state.responseToken){
      return (
        <Text>Loading</Text>
      );
    }
    return (
      <TouchableHighlight
      style={styles.loginButton}
      onPress={this._onPressButton.bind(this)}>
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});

module.exports = Login;