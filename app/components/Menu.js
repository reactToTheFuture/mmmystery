import React from 'react-native';
import Dimensions from 'Dimensions';
import FBSDKLogin from 'react-native-fbsdklogin';

import Walkthrough from './login/Walkthrough';

const window = Dimensions.get('window');

let {
  StyleSheet,
  View,
  Modal,
  TouchableHighlight,
  Image,
  Text,
  Animated,
} = React;

let {
  FBSDKLoginManager,
} = FBSDKLogin;

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadySignIn: false,
      hidden: true,
      fadeAnim: new Animated.Value(0)
    };
  }
  closeSideMenu() {
    this.props.menuActions.toggle();
  }

  componentWillMount() {
    this.setState({alreadySignIn: true});
  }

  onPressLogOut() {
   // this.props.route.props.responseToken();
   console.log('OnpresLogOuot');
   FBSDKLoginManager.logOut();
   this.props.logoutHandler(true);
   this.props.navigator.popToTop();
  }

  onPressProfile() {

  }
  onPressShare() {

  }

  onPressHowWorks() {
     this.props.navigator.push({
      component: Walkthrough,
      props: {
        alreadySignIn: this.state.alreadySignIn
      }
    });
  }

  componentWillReceiveProps(newProps) {
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

    Animated.timing(
     this.state.fadeAnim,
     {toValue: value},
    ).start(onAnimationComplete); 
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
                outputRange: [-window.width, 0]
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
              onPress={this.onPressShare.bind(this)}>
                <Text style={styles.item}>Share</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonItem}
              onPress={this.onPressHowWorks.bind(this)}>
                <Text style={styles.item}>How it works</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonItem}
              onPress={this.onPressLogOut.bind(this)}>
                <Text style={styles.item}>Logout</Text>
            </TouchableHighlight>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: -64,
    left: 0,
    backgroundColor: 'transparent',
    width: window.width,
    height: window.height + 64,
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(155,35,255,1)',
    width: window.width * 0.75,
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

module.exports = Menu;
