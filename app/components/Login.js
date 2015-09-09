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
  Text,
  Image
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
      let errorLogin = false;
      if (token) {
      this.setState({token});

      // GraphQL query for user information
      let fetchProfileRequest = new FBSDKGraphRequest((error, result) => {
        errorLogin = !!error;
        if (error){
          console.log('FBSDKGraphRequest', error);
          alert('Error in login. Please, sing ing again');
          this.setState({responseToken: true});
        } else {
          console.log('FBSDKGraphRequest', result);
          this.setState({userInfo: result});
          alert('Welcome ' + result.first_name + "!");
        }
      }, 'me?fields=first_name,last_name,picture');
      fetchProfileRequest.start(0);

      // If error when making graphQL query, login again.
      errorLogin ? null : this.switchToMain();
      } else {
        this.setState({responseToken: true});
        console.log('No token founded');
      }
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

  responseToken() {
    // prompts login process after logout
    this.setState({responseToken: true});
  }

  componentDidMount(){
    this.getAccesToken();
  }

  _onPressButton(){
    // Shows transition between login and Main screen
    this.setState({responseToken: false});
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
  };

  switchToMain() {
    this.props.navigator.push({
      component: Main,
      props: {
        result: this.state.result,
        token: this.state.token,
        userInfo: this.state.userInfo,
        responseToken: this.responseToken.bind(this)
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
    // this page appears after login process and main screen
    // will be replaced by a loading screen
    if (!this.state.responseToken){
      return (
        <Text>Loading screen after login process</Text>
      );
    }

    return (
      <View
        style={styles.container}>
        <Image
          source={require('image!gut-instinct-back')}
          style={styles.loginImage}>
          <View style={styles.loginContainer}>
            <TouchableHighlight
            style={styles.loginButton}
            onPress={this._onPressButton.bind(this)}>
              <Text style={styles.loginText}>Sign in with
                <Text style={styles.facebook}> Facebook</Text>
              </Text>
            </TouchableHighlight>
          </View>
        </Image>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  loginContainer: {
    paddingTop: 400,
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    width: 295,
    height: 67,
    borderRadius: 30,
    borderColor: '#FEE7B3',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent'
  },
  loginText: {
    color: 'white',
    fontSize: 20,
  },
  facebook: {
    fontWeight: 'bold',
  },
  loginImage: {
    flex: 1,
    alignSelf: 'auto',
  }
});

module.exports = Login;