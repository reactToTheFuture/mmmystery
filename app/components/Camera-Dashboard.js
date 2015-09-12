var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Dimensions = require('Dimensions');
var window = Dimensions.get('window');

var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  NavigatorIOS,
} = React;

var { Icon } = require('react-native-icons');

var CameraRollView = require('./Camera-Roll');
var CameraLiveView = require('./Camera-Live');

var tips_api = require('../utils/tips.js');
var img_api = require('../utils/img.js');

var globals = require('../../globalVariables');

class CameraDashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tip: null
    };
  }

  goToCameraRollScreen() {
    this.props.navigator.push({
      title: 'Camera Roll',
      component: CameraRollView,
      navigationBar: (
        <NavigationBar
          title="Camera Roll" />
      )
    });
  }

  goToCameraLiveScreen() {
    this.props.navigator.push({
      title: 'Picture Time',
      component:  CameraLiveView,
    })
  }

  componentWillMount() {
    this.setState({
      tip: tips_api.getRandomTip(),
      img: img_api.getRandomImg()
    });
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.headlineContainer}>
          <Text style={styles.headline}>Upload a photo of your meal!</Text>
        </View>

        <View style={styles.imageTipContainer}>
          <Image style={styles.img} source={this.state.img} />
          <Text style={styles.tip}>{this.state.tip}</Text>
        </View>

        <View style={styles.btnContainer}>
          <TouchableHighlight
            style={styles.mainBtn}
            onPress={this.goToCameraLiveScreen.bind(this)}
            underlayColor={globals.primaryLight}>
            <View style={styles.innerBtn}>
              <Icon
                name='ion|ios-camera-outline'
                size={30}
                color='#ffffff'
                style={styles.cameraIcon}
              />
              <Text style={styles.btnText}>Let's take a photo</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.goToCameraRollScreen.bind(this)}
            underlayColor='#ffffff'>
            <Text style={styles.secondaryBtn}>Choose from my camera roll</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  imageTipContainer: {
    flex: 5,
    justifyContent: 'center',
    paddingLeft: 50,
    paddingRight: 50,
  },
  innerBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontSize: 36,
    textAlign: 'center',
    fontFamily: 'SanFranciscoDisplay-Light',
    color: globals.darkText,
  },
  headlineContainer: {
    flex: 2,
    paddingTop: 15,
    paddingLeft: 50,
    paddingRight: 50,
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  img: {
    alignSelf: 'center',
    marginBottom: 15,
    width: 150,
    height: 150,
    borderRadius: 150/2,
  },
  tip: {
    color: globals.mediumText,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'SanFranciscoText-Regular',
  },
  btnContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainBtn: {
    width: window.width - 30,
    marginBottom: 20,
    paddingTop: 17,
    paddingBottom: 17,
    borderRadius: 5,
    backgroundColor: globals.primaryDark,
  },
  btnText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: 'SanFranciscoText-Semibold',
  },
  secondaryBtn: {
    width: window.width - 30,
    fontSize: 18,
    textAlign: 'center',
    color: globals.primaryDark,
    fontFamily: 'SanFranciscoText-Regular',
  }
});

module.exports = CameraDashboard;