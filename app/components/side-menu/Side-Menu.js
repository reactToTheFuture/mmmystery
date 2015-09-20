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

    var links = [{
      icon: require('image!icon-menu-profile'),
      text: 'Profile',
      onPress: this.onPressProfile.bind(this)
    }, {
      icon: require('image!icon-menu-works'),
      text: 'How it Works',
      onPress: this.onPressHowWorks.bind(this)
    }, {
      icon: require('image!icon-menu-about'),
      text: 'About',
      onPress: this.onPressAbout.bind(this)
    }, {
      icon: require('image!icon-menu-contact'),
      text: 'F.A.Q',
      onPress: this.onPressFaq.bind(this)
    }, {
      icon: require('image!icon-menu-question'),
      text: 'Contact Us',
      onPress: this.onPressContact.bind(this)
    }];

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
                {links.map(function(link, i) {
                  return (
                    <TouchableHighlight
                      key={i}
                      style={styles.button}
                      underlayColor={globals.secondary}
                      onPress={link.onPress}>
                      <View style={styles.innerButton}>
                        <Image
                          style={styles.icon}
                          source={link.icon}/>
                        <Text style={styles.buttonText}>{link.text}</Text>
                      </View>
                    </TouchableHighlight>
                  );
                })}
              </View>
              <View style={styles.logoutContainer}>
                <TouchableHighlight
                  style={styles.buttonLogout}
                  underlayColor={globals.primary}
                  onPress={this.onLogOut.bind(this)}>
                  <View style={styles.innerButton}>
                    <Image
                      style={styles.icon}
                      source={require('image!icon-menu-logout')}/>
                    <Text style={styles.buttonText}>Logout</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
        </Animated.View>
      </View>
    );
  }
}

export default SideMenu;

var widthRatio = window.width/375,
    heightRatio = window.height/667,
    marginBottomButton;
var menuWidth = window.width * 0.70;
var avatarWidth = 24;
switch(window.height) {
    case 480: // iPhone 4s
        paddingVertical=0.5;
        marginBottomButton = 0.5;
        break;
    default:
        paddingVertical=null;
        marginBottomButton = null;
        break;
}
//-----

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
    marginVertical: 25,
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
    fontFamily: globals.fontTextRegular,
  },
  buttonText: {
    fontSize: 18 * widthRatio,
    fontFamily: globals.fontTextRegular,
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
    marginBottom: 25,
  },
  button: {
    width: menuWidth,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: marginBottomButton || 10 * heightRatio,
  },
  buttonLogout: {
    width: menuWidth,
    paddingVertical: paddingVertical || 10 * heightRatio,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: marginBottomButton || 10 * heightRatio,
  },
  innerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 30 * widthRatio,
    width: 30 * widthRatio,
    marginRight: 10,
  },
});
