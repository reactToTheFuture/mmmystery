import React from 'react-native';
import Dimensions from 'Dimensions';
import FBSDKLogin from 'react-native-fbsdklogin';
import NavigationBar from 'react-native-navbar';

import Walkthrough from '../login/Walkthrough';
import Profile from '../profile/Profile';
import Contact from '../side-menu/ContactUs';
import About from '../side-menu/About';
import FAQ from '../side-menu/FAQ';

import globals from '../../../globalVariables';

const window = Dimensions.get('window');

let {
  StyleSheet,
  View,
  Modal,
  TouchableHighlight,
  Image,
  Text,
  Easing,
  Animated,
} = React;

let {
  FBSDKLoginManager,
} = FBSDKLogin;

class SideMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
      fadeAnim: new Animated.Value(0)
    };
  }


  onPressProfile() {
    this.props.navigator.push({
      title: 'Profile',
      component: Profile,
      navigationBar: (
        <NavigationBar
          title='Profile' />
      )
    });
  }


  onPressHowWorks() {
    this.props.navigator.push({
      component: Walkthrough,
      props: {
        isSignedIn: true
      }
    });
  }

  onPressAbout() {
    this.props.navigator.push({
      component: About,
      navigationBar: (
        <NavigationBar
          title='About' />
      )
    });
  }

  onPressFaq() {
    this.props.navigator.push({
      component: FAQ,
      navigationBar: (
        <NavigationBar
          title='F.A.Q.' />
      )
    });
  }

  onPressContact() {
  this.props.navigator.push({
      component: Contact,
      navigationBar: (
        <NavigationBar
          title='Support' />
      )
    });
  }

  onLogOut() {
    FBSDKLoginManager.logOut();
    this.props.onLogOut();
    this.props.navigator.popToTop();
  }

  componentWillReceiveProps(newProps) {
    if( this.state.hidden && !newProps.isVisible ) {
      return;
    }

    this.setState({
      hidden: false
    });

    var onAnimationComplete = () => {
      if(newProps.isVisible) {
        return;
      }

      this.setState({
        hidden: true
      });
    };

    var value = 0;

    if(newProps.isVisible) {
      value = 1;
    }

    Animated.timing(this.state.fadeAnim, {
      toValue: value,
      easing: Easing.linear,
      duration: 350,
     }).start(onAnimationComplete);
  }

  render() {
    if(this.state.hidden) {
      return (
        <View></View>
      );
    }

    return (
      <View style={[styles.container]}>
        <Animated.View
          style={[{opacity: this.state.fadeAnim}, styles.blur]}>
          <TouchableHighlight
            style={styles.innerBlur}
            underlayColor='transparent'
            onPress={this.props.onMenuToggle}>
            <View></View>
          </TouchableHighlight>
        </Animated.View>
        <Animated.View style={[{
            transform: [{
              translateX: this.state.fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-menuWidth, 0]
              }),
            }]}, styles.menu]}>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={{uri: this.props.user.picture.data.url}}/>
              <Text style={[styles.text, styles.name]}>{this.props.user.first_name} {this.props.user.last_name}</Text>
            </View>
            <View style={styles.links}>
              <View style={styles.mainLinks}> 
                <TouchableHighlight
                  style={styles.button}
                  underlayColor={globals.primary}
                  onPress={this.onPressProfile.bind(this)}>
                    <Text style={styles.buttonText}>Profile</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.button}
                  underlayColor={globals.primary}
                  onPress={this.onPressHowWorks.bind(this)}>
                    <Text style={styles.buttonText}>How it works</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.button}
                  underlayColor={globals.primary}
                  onPress={this.onPressAbout.bind(this)}>
                    <Text style={styles.buttonText}>About</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.button}
                  underlayColor={globals.primary}
                  onPress={this.onPressFaq.bind(this)}>
                    <Text style={styles.buttonText}>FAQ</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.button}
                  underlayColor={globals.primary}
                  onPress={this.onPressContact.bind(this)}>
                    <Text style={styles.buttonText}>Contact Us</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.logoutContainer}>
                <TouchableHighlight
                  style={styles.button}
                  underlayColor={globals.primary}
                  onPress={this.onLogOut.bind(this)}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableHighlight>
              </View>
            </View>
        </Animated.View>
      </View>
    );
  }
}

export default SideMenu;

var menuWidth = window.width * 0.70;
var avatarWidth = 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    width: window.width,
    height: window.height,
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: menuWidth,
    height: window.height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  blur: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: window.width,
    height: window.height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  innerBlur: {
    flex: 1,
  },
  avatarContainer: {
    width: menuWidth,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    backgroundColor: globals.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  // absolute positioning to ensure, 
  // a flexDirection of 'column' so text will
  // never overflow container
  avatar: {
    width: avatarWidth,
    height: avatarWidth,
    borderRadius: avatarWidth/2,
    position: 'absolute',
    top: 10,
    left: 20,
  },
  name: {
    flex: 1,
    marginLeft: avatarWidth + 5,
    fontSize: 18,
    fontFamily: 'SanFranciscoText-Regular',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'SanFranciscoText-Regular',
  },
  links: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainLinks: {
    flex: 4,
  },
  logoutContainer: {
    flex: 1,
  },
  button: {
    width: menuWidth,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
});
