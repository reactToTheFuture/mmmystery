import React from 'react-native';
import NavigationBar from 'react-native-navbar';
import { Icon } from 'react-native-icons';
import Dimensions from 'Dimensions';

import CameraRollView from './Camera-Roll';
import CameraLiveView from './Camera-Live';

import globals from '../../../globalVariables';

var window = Dimensions.get('window');

var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  NavigatorIOS,
} = React;

class CameraDashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tip: null
    };
  }

  getRestaurant() {
    // sent from Map-Dashboard after arrival at a restaurant
    var props = this.props.route.props;

    if( !props || !props.restaurant ) {
      return null;
    }

    return props.restaurant;
  }

  goToCameraRollScreen() {
    var restaurant = this.getRestaurant();

    this.props.navigator.push({
      title: 'Camera Roll',
      component: CameraRollView,
      props: {
        restaurant
      },
      navigationBar: (
        <NavigationBar
          title="Camera Roll" />
      )
    });
  }

  goToCameraLiveScreen() {
    var restaurant = this.getRestaurant();

    this.props.navigator.push({
      title: 'Picture Time',
      props: {
        restaurant
      },
      component:  CameraLiveView,
    })
  }

  render () {
    return (
      <View style={styles.container}>
            <Image
              style={styles.topImage}
              source={require('image!icon-camera-dashboard')}
            />
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>Take a photo when your meal arrives</Text>
            <Text style={[styles.headline, styles.subHeadline]}>Sharing your meal helps make other's decision choosing a Mmmystery easy!</Text>
          </View>


          <View style={styles.btnContainer}>
            <TouchableHighlight
              style={styles.mainBtn}
              onPress={this.goToCameraLiveScreen.bind(this)}
              underlayColor={globals.primaryLight}>
              <View style={styles.innerBtn}>
                <Icon
                  name='ion|ios-camera-outline'
                  size={30 * window.width/375}
                  color='#ffffff'
                  style={styles.icon}
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

export default CameraDashboard;
// Adjustments
var widthRatio = window.width/375,
    heightRatio = window.height/667;
var borderRadiusImgCenter;
var fontSizeBtnText;
switch(window.height) {
    case 480: // iPhone 4s
        borderRadiusImgCenter  = 65;
        break;
    case 568: // iPhone 5 and 5s
        borderRadiusImgCenter  = 65;
        break;
    case 667: // iPhone 6
        borderRadiusImgCenter  = 75;
        break;
    case 736: // iPhone 6s
        borderRadiusImgCenter  = 80;
        fontSizeBtnText = 20;
        break;
    default:
        fontSizeBtnText = null;
        break;
}
//-----

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20 * heightRatio,
    backgroundColor: '#ffffff',
  },
  innerBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontSize: 25 * widthRatio,
    textAlign: 'center',
    fontFamily: globals.fontDisplayLight,
    color: globals.darkText,
    marginBottom: 10 * heightRatio,
    paddingHorizontal: 10 * widthRatio,
  },
  subHeadline: {
    fontSize: 18 * widthRatio,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: globals.fontTextRegular,
    color: globals.mediumText,
    paddingLeft: 25  * widthRatio,
    paddingRight: 25  * widthRatio,
  },
  headlineContainer: {
    flex: 1,
    paddingTop: 30 * widthRatio,
    justifyContent: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  img: {
    alignSelf: 'center',
    marginBottom: 15,
    width: 150 * widthRatio,
    height: 150 * widthRatio,
    borderRadius: borderRadiusImgCenter,
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30 * widthRatio,
  },
  mainBtn: {
    width: 345 * widthRatio,
    height: 63 * heightRatio,
    marginBottom: 20,
    paddingVertical: 17 * heightRatio,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: globals.primary,
  },
  btnText: {
    fontSize: fontSizeBtnText  || 20 * widthRatio,
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: globals.fontTextSemibold,
  },
  secondaryBtn: {
    width: window.width - 30,
    fontSize: 18 * widthRatio,
    textAlign: 'center',
    color: globals.primaryDark,
    fontFamily: globals.fontTextRegular,
  },
  topImage: {
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    height: 149 * heightRatio,
    width: 259 * widthRatio,
    flex: 1,
  },
});
