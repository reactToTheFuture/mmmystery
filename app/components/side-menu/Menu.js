import FBSDKLogin from 'react-native-fbsdklogin';
import React from 'react-native';
import Walkthrough from '../login/Walkthrough';
const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

let {
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Text,
} = React;

let {
  FBSDKLoginManager,
} = FBSDKLogin;


const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'white',
    padding: 20,
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

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadySignIn: false,
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

  render() {
    return (
      <View style={styles.menu}>
        <Text onPress={this.closeSideMenu.bind(this)}>X</Text>
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
      </View>
    );
  }
}

module.exports = Menu;
