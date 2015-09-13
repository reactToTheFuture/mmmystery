'use strict';

import React from 'react-native';
import FBSDKCore from 'react-native-fbsdkcore';
import FBSDKLogin from 'react-native-fbsdklogin';

import Main from '../Main';
import NavigationBar from 'react-native-navbar';

import NavigationPrev from '../navigation/Custom-Prev';
import NavigationNext from '../navigation/Custom-Next';

import CameraDashboard from '../Camera-Dashboard';
import Walkthrough from './Walkthrough';

import Colors from '../../../globalVariables';

import firebase_api from '../../utils/firebase-api';

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
      isOpen: false,
    };
  }

  async getAccesToken(updateUserInfo) {
    let _this = this;
    var responseToken = await (FBSDKAccessToken.getCurrentAccessToken((token) => {

      if(!token) {
        this.setState({responseToken: true});
        console.warn('No token founded');
        return;
      }

      // GraphQL query for user information
      let fetchProfileRequest = new FBSDKGraphRequest((error, userInfo) => {

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

        if(updateUserInfo) {
          firebase_api.addUser(userInfo);
        }

        this.props.route.props.onLogin(userInfo);
        this.switchToMain();

      }, 'me?fields=first_name,last_name,picture');

      fetchProfileRequest.start(0);
    }));
  }

  responseToken() {
    // prompts login process after logout
    this.setState({responseToken: true});
  }

  componentDidMount() {
    this.getAccesToken(false);
  }

  onLoginBtnPress() {
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
          this.setState({result});
          this.getAccesToken(true);
        }
      }
    });
  };

  onCameraBtnPress(navigator, route) {
    navigator.push({
      title: 'Camera',
      component: CameraDashboard,
      navigationBar: (
        <NavigationBar
          title="Picture Time" />
      )
    });
  }

  handleSideMenu(bool){
    console.log('!this.state.isOpen', bool);
    this.setState({isOpen: bool});
  }

  onTourStart() {
    this.props.navigator.push({
      component: Walkthrough,
      navigationBar: (
        <NavigationBar
          customPrev={<NavigationPrev iconName={'navicon'} size={37} color={Colors.primaryLight}/>}
          title="Mystery Meal"
          titleColor={Colors.darkText}
          customNext={<NavigationNext handler={this.onCameraBtnPress.bind(this, this.props.navigator, this.props.route)} iconName={'ios-camera-outline'} size={37} color={Colors.lightText} />}
          style={styles.navigator} />
      )
    });
  }

  switchToMain(userInfo) {
    this.props.navigator.push({
      component: Main,
      props: {
        isOpen: this.state.isOpen,
      },
      navigationBar: (
        <NavigationBar
          customPrev={<NavigationPrev handleSideMenu={this.handleSideMenu.bind(this)} iconName={'navicon'} size={37} color={Colors.primaryLight}/>}
          title="Mystery Meal"
          titleColor={Colors.darkText}
          customNext={<NavigationNext handler={this.onCameraBtnPress.bind(this, this.props.navigator, this.props.route)} iconName={'ios-camera-outline'} size={37} color={Colors.lightText} />}
          style={styles.navigator} />
      )
    });
  }

  // Logout:
  // componentWillMount() {
  //   FBSDKLoginManager.logOut();
  // }

  render() {

    // this page appears after login process and before main screen
    // will be replaced by a loading screen
    if (!this.state.responseToken) {
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
              underlayColor={Colors.primaryDark}
              style={styles.loginButton}
              onPress={this.onLoginBtnPress.bind(this)}>
              <Text style={[styles.text, styles.loginText]}>Sign in with
                <Text style={styles.emphasis}> Facebook</Text>
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor='#FFBF00'
              onPress={this.onTourStart.bind(this)}>
              <Text style={[styles.text, styles.tourButton]}>Take a Tour</Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    width: 295,
    height: 67,
    marginBottom: 30,
    borderRadius: 30,
    borderColor: '#fee7b3',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'SanFranciscoText-Regular',
    color: '#ffffff',
    fontSize: 16
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#ffffff',
    fontSize: 20,
  },
  tourButton: {
  },
  emphasis: {
    fontWeight: 'bold',
  },
  loginImage: {
    flex: 1,
    overflow: 'visible'
  },
});

module.exports = Login;
