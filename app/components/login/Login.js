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

var { Icon } = require('react-native-icons');

import globals from '../../../globalVariables';

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
          customPrev={<NavigationPrev handleSideMenu={this.handleSideMenu.bind(this)} iconName={'navicon'} size={37} color={globals.primaryLight}/>}
          title="Mystery Meal"
          titleColor={globals.darkText}
          customNext={<NavigationNext handler={this.onCameraBtnPress.bind(this, this.props.navigator, this.props.route)} iconName={'ios-camera-outline'} size={37} color={globals.lightText} />}
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
          source={require('image!food-bg')}
          style={styles.loginImage}>
          <View style={styles.textContainer}>
            <Text style={[styles.text, styles.headline]}>Mmmystery</Text>
            <Text style={[styles.text, styles.subHeadline]}>
              A fun way of discovering new restaurants and your next favorite meal!
            </Text>
          </View>
          <View style={styles.loginContainer}>
            <TouchableHighlight
              underlayColor={globals.primaryDark}
              style={styles.loginButton}
              onPress={this.onLoginBtnPress.bind(this)}>
              <View style={styles.innerBtn}>
                <Icon
                  name='ion|social-facebook-outline'
                  size={30}
                  color='#ffffff'
                  style={styles.icon}
                />
                <Text style={[styles.text]}>Sign in with
                  <Text style={styles.emphasis}> Facebook</Text>
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='#FFBF00'
              onPress={this.onTourStart.bind(this)}>
              <Text style={[styles.text]}>Take a Tour</Text>
            </TouchableHighlight>
          </View>
        </Image>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headline: {
    marginBottom: 50,
    fontFamily: 'SanFranciscoDisplay-Semibold',
    fontSize: 40,
  },
  subHeadline: {
    textAlign: 'center',
    fontFamily: 'SanFranciscoDisplay-Regular',
    fontSize: 25,
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  innerBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  loginButton: {
    width: 295,
    height: 67,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderRadius: 30,
    borderColor: '#fee7b3',
    borderWidth: 3,
  },
  text: {
    fontFamily: 'SanFranciscoDisplay-Regular',
    color: '#ffffff',
    fontSize: 20,
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
