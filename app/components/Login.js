'use strict';

var React = require('react-native');
var FBSDKCore = require('react-native-fbsdkcore');
var FBSDKLogin = require('react-native-fbsdklogin');

var Main = require('./Main');
var NavigationBar = require('react-native-navbar');

// Custom navIcons that make use of react-native-navbar
var NavigationPrev = require('./navigation/Custom-Prev');
var NavigationNext = require('./navigation/Custom-Next');

var CameraDashboard = require('./Camera-Dashboard');
var FBSDKLogin = require('react-native-fbsdklogin');

// set of global colors to use app wide
var Colors = require('../../globalVariables');

var firebase_api = require('../utils/firebase-api');

var {
  StyleSheet,
  AlertIOS,
  View,
  TouchableHighlight,
  TouchableOpacity,
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
    let _this = this;
    var responseToken = await (FBSDKAccessToken.getCurrentAccessToken((token) => {
      let errorLogin = false;

      if(!token) {
        this.setState({responseToken: true});
        console.log('No token founded');
        return;
      }

      // GraphQL query for user information
      let fetchProfileRequest = new FBSDKGraphRequest((error, userInfo) => {
        errorLogin = !!error;

        if (error) {
          console.warn('FBSDKGraphRequest', error);
          AlertIOS.alert(
            'Error logging in. Please try again.',
            [
              {text: 'OK', onPress: () => {}},
            ]
          );
          this.setState({responseToken: true});
          return;
        }

        this.switchToMain(userInfo);
        firebase_api.addUser(userInfo);
      }, 'me?fields=first_name,last_name,picture');

      fetchProfileRequest.start(0);
    }));
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

  cameraBtnPress(navigator, route) {
    console.log('I am hit!');
    navigator.push({
      title: 'Camera',
      component: CameraDashboard,
      navigationBar: (
        <NavigationBar
          title="Picture Time" />
      )
    })
  }

  switchToMain(userInfo) {
    console.log('switchToMain userInfo', userInfo)
    this.props.navigator.push({
      component: Main,
      props: {
        userInfo: userInfo,
      },
      navigationBar: (
        <NavigationBar
          customPrev={<NavigationPrev iconName={'navicon'} size={37} color={Colors.primaryLight}/>}
          title="Mystery Meal"
          titleColor={Colors.darkText}
          customNext={<NavigationNext handler={this.cameraBtnPress.bind(this, this.props.navigator, this.props.route)} iconName={'ios-camera-outline'} size={37} color={Colors.lightText} />}
          style={styles.navigator} />
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
  },
});

module.exports = Login;
