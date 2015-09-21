import React from 'react-native';
import NavigationBar from 'react-native-navbar';
import Camera from 'react-native-camera';
import { Icon } from 'react-native-icons';
import Dimensions from 'Dimensions';

import Button from './Button';
import CameraLiveButton from './Button-Camera';
import CameraCrop from './Camera-Crop';
import RestaurantSelection from '../image-uploads/Restaurant-Selection';
import MealSelection from '../image-uploads/Meal-Selection';

import globals from '../../../globalVariables';

var {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  ActivityIndicatorIOS,
  PixelRatio,
  NativeModules,
  Modal
} = React;

var deviceScreen = Dimensions.get('window');
var fullWidth = deviceScreen.width;
var fullHeight = deviceScreen.height;

class CameraLive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: Camera.constants.Type.back,
      measuredSize: {
        width: fullWidth,
        height: fullHeight,
      },
      isCroppingPhoto: false,
      imageFrom: 'Camera',
      image: null,
    };
  }

  goToNextSelection(props) {
    var restaurant = this.props.route.props.restaurant;

    if(restaurant) {
      props.restaurant = restaurant;
      this.goToMealSelection(props);
    } else {
      this.goToRestaurantSelection(props);
    }

    this.handleOverlayClose();
  }

  goToMealSelection(props) {
    this.props.navigator.push({
      component: MealSelection,
      props,
      navigationBar: (
        <NavigationBar
          title="Find your meal" />
      )
    });
  }

  goToRestaurantSelection(props) {
    this.props.navigator.push({
      component: RestaurantSelection,
      props,
      navigationBar: (
        <NavigationBar
          title="Where are you?" />
      )
    });
  }

  handleOverlayClose() {
    this.setState({
      isCroppingPhoto: false
    });
  }

  switchCamera() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  }

  takePicture() {
    this.refs.cam.capture((err, data) => {
      this.setState({
        isCroppingPhoto: true,
        image: {
          uri: data,
          type: 'file',
          width: fullWidth,
          height: fullWidth + 55,
        }
      })
    });
  }

  setStage(stage){
    this.setState({
      stage: stage
    })
  }

  previousScreen() {
    this.props.navigator.pop()
  }

  render() {
    return (
      <View style={styles.container}>
        <CameraCrop
          isVisible={this.state.isCroppingPhoto}
          image={this.state.image}
          imageFrom={this.state.imageFrom}
          //measuredSize={this.state.measuredSize}
          onPhotoAccept={this.goToNextSelection.bind(this)}
          onOverlayClose={this.handleOverlayClose.bind(this)} />


        <View style={{flex: 1}}>
          <View style={styles.cameraTop}>
            <View stlye={styles.cameraLeftIconContainer}>
              <TouchableOpacity
                  underlayColor='transparent'
                  onPress={this.previousScreen.bind(this)}
                  style={styles.cameraTopCancel}>
                  <View>
                    <Icon
                      name='ion|ios-close-empty'
                      size={40}
                      color={globals.darkBackgroundText}
                      style={styles.cameraReverseIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.cameraTopText}>Camera</Text>
              <View style={styles.cameraRightIconContainer}>
                <TouchableOpacity
                  underlayColor='transparent'
                  onPress={this.switchCamera.bind(this)}
                  style={styles.cameraTopFlip}>
                  <View>
                    <Icon
                      name='ion|ios-reverse-camera-outline'
                      size={40}
                      color={globals.darkBackgroundText}
                      style={styles.cameraReverseIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>
          </View>
          <Camera
            ref="cam"
            aspect="fill"
            style={[styles.camera, this.state.measuredSize]}
            type={this.state.cameraType}>
          </Camera>
          <View style={styles.cameraBottom}>
              <View style={styles.cameraBottomCaptureContainer}>
                <CameraLiveButton testingStyles={styles.cameraBottomCapture} onPress={this.takePicture.bind(this)} />
              </View>
          </View>
        </View>
      </View>

    );
  }
}

export default CameraLive;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  camera: {
    flex: 0,
    backgroundColor: 'transparent',
  },


  cameraTopCancel: {
    alignSelf: 'center',
  },
  cameraTopFlip: {
    alignSelf: 'center',
  },
  cameraReverseIcon: {
    width: 40,
    height: 40,
  },
  cameraTop: {
    backgroundColor: globals.cameraBackground,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
    height: 70,
    width: fullWidth
  },
  cameraLeftIconContainer: {
    flex: 1,
  },
  cameraRightIconContainer: {
    flex: 1,
  },
  cameraTopText: {
    flex: 7,
    textAlign: 'center',
    fontFamily: globals.fontDisplayRegular,
    color: globals.darkBackgroundText,
    fontSize: 18,
  },


  cameraBottomCaptureContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  cameraBottomCapture: {
    width: 90,
    height: 90,
    borderRadius: 90 / PixelRatio.get(),
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraBottomReset: {
    flex: 1
  },
  cameraBottomUsePhoto: {
    flex: 1
  },
  cameraBottomPreviewContainer: {
    flex: 1,
    flexDirection: 'row',
    width: fullWidth
  },
  cameraBottom: {
    backgroundColor: globals.cameraBackground,
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: fullWidth,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333'
  }
});
