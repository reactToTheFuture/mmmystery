import React from 'react-native';
import Dimensions from 'Dimensions';
import FBSDKLogin from 'react-native-fbsdklogin';
import NavigationBar from 'react-native-navbar';

import Walkthrough from '../login/Walkthrough';
import Profile from '../profile/Profile';
import Contact from '../side-menu/ContactUs';
import About from '../side-menu/About';
import FAQ from '../side-menu/FAQ';

const window = Dimensions.get('window');

var menuWidth = window.width * 0.70;

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
                source={{uri: this.props.user && this.props.user.picture.data.url}}/>
              <Text style={styles.name}>{this.props.user && this.props.user.first_name}</Text>
            </View>
            <TouchableHighlight
              style={styles.buttonItem}
              onPress={this.onPressProfile.bind(this)}>
                <Text style={styles.item}>Profile</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonItem}
              onPress={this.onPressHowWorks.bind(this)}>
                <Text style={styles.item}>How it works</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonItem}
              onPress={this.onPressAbout.bind(this)}>
                <Text style={styles.item}>About</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonItem}
              onPress={this.onPressFaq.bind(this)}>
                <Text style={styles.item}>FAQ</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonItem}
              onPress={this.onPressContact.bind(this)}>
                <Text style={styles.item}>Contact Us</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonItem}
              onPress={this.onLogOut.bind(this)}>
                <Text style={styles.item}>Logout</Text>
            </TouchableHighlight>
        </Animated.View>
      </View>
    );
  }
}

export default SideMenu;

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
    padding: 20,
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
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
  buttonItem: {
    flexDirection: 'row',
    flex: 1,
    width: 30,
    height: 12,
  },
});
