var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Image,
  PixelRatio,
  NativeModules,
  CameraRoll,
} = React;
var Camera = require('react-native-camera');
var Button = require('./Button');
var CameraLiveButton = require('./Button-Camera');

var deviceScreen = require('Dimensions').get('window');
var fullWidth = deviceScreen.width;
var fullHeight = deviceScreen.height;

class CameraLive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: Camera.constants.Type.back,
      // stage is either
        // 'capture' for when taking an image
        // 'preview' once a picture is taken
      stage: 'capture'
    };
  }

  render() {
    var main;
    if (this.state.stage === 'capture') {
      main = <Camera
        ref="cam"
        aspect="fill"
        style={styles.camera}
        type={this.state.cameraType}/>
    } else if (this.state.stage === 'preview') {
      var uri = this.state.image.type === 'file' ? this.state.image.uri : this.state.image.uri;
      //console.log('this is the preview', this.state.image);
      main = <Image
        ref="preview"
        style={styles.camera}
        source={{
          isStatic: true,
          uri: uri
        }}
      />
    }

    return (
      <View style={styles.container}>
        <View style={styles.cameraTop}>
          {this.state.stage === 'capture' ? <Button text="Cancel" testingStyles={styles.cameraTopCancel} onPress={this.previousScreen.bind(this)}/> : undefined }
          {this.state.stage === 'capture' ? <Button testingStyles={styles.cameraTopFlip} text="Flip Camera" onPress={this.switchCamera.bind(this)}/> : undefined}
        </View>
        {main}
        <View style={styles.cameraBottom}>
          {this.state.stage === 'capture' ?
            <View style={styles.cameraBottomCaptureContainer}>
              <CameraLiveButton testingStyles={styles.cameraBottomCapture} onPress={this.takePicture.bind(this)} />
            </View> :
            <View style={styles.cameraBottomPreviewContainer}>
              <Button testingStyles={styles.cameraBottomReset} text="Retake" onPress={this.setStage.bind(this, 'capture')} />
              <Button testingStyles={styles.cameraBottomUsePhoto} text="Use Photo" onPress={this.usePhoto.bind(this, 'capture')} />
            </View>
          }
        </View>
      </View>
    );
  }

  usePhoto() {
    NativeModules.ReadImageData.readImage(this.state.image.uri, (image) => {
      base64 = image;
      console.log(base64);
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
        stage: 'preview',
        image: {
          uri: data,
          type: 'file'
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
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  camera: {
    flex: 5,
    width: fullWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cameraTop: {
    backgroundColor: '#25272a',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    width: fullWidth
  },
  cameraTopCancel: {
    marginLeft: 25
  },
  cameraTopFlip: {
    marginRight: 25
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
    backgroundColor: '#25272a',
    flex: 2,
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

module.exports = CameraLive;