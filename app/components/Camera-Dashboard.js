var React = require('react-native');
var NavigationBar = require('react-native-navbar');

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
        <View>
          <Text style={styles.headline}>Upload a photo of your meal!</Text>
          <Text style={styles.subheadline}>Share your eats to make others hungry!</Text>
        </View>

        <Image style={styles.img} source={this.state.img} />

        <Text style={styles.tip}>{this.state.tip}</Text>

        <View style={styles.btnContainer}>
          <TouchableHighlight
            style={styles.mainBtn}
            onPress={this.goToCameraLiveScreen.bind(this)}
            underlayColor='#fdc969'>
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
            <Text style={styles.secondaryBtn}>Chose from my camera roll</Text>
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
    paddingRight: 50,
    paddingLeft: 50,
    backgroundColor: '#FFFFFF',
  },
  innerBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    marginBottom: 10,
    fontSize: 36,
    textAlign: 'center',
    fontFamily: 'SanFranciscoDisplay-Regular',
    color: globals.darkText,
  },
  subheadline: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'SanFranciscoDisplay-Light',
    color: globals.mediumText,
  },
  cameraIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  tip: {
    color: globals.mediumText,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'SanFranciscoText-Regular',
  },
  btnContainer: {
    paddingBottom: 50,
  },
  mainBtn: {
    width: 300,
    marginBottom: 25,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 5,
    backgroundColor: globals.primaryDeep,
  },
  btnText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: 'SanFranciscoText-Regular',
  },
  secondaryBtn: {
    width: 300,
    fontSize: 20,
    textAlign: 'center',
    color: globals.primaryDeep,
    fontFamily: 'SanFranciscoText-Regular',
  }
});

module.exports = CameraDashboard;