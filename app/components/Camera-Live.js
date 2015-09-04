var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Image,
  PixelRatio,
} = React;
var Camera = require('react-native-camera');
var Button = require('./Button');

var deviceScreen = require('Dimensions').get('window');
var fullWidth = deviceScreen.width;
var fullHeight = deviceScreen.height;

class CameraLive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: Camera.constants.Type.back,
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
        onBarCodeRead={this._onBarCodeRead}
        type={this.state.cameraType}
      ><Text style={styles.welcome}>
          Time to take a picture!
        </Text></Camera>
    } else if (this.state.stage === 'preview') {
      var uri = this.state.image.type === 'file' ? this.state.image.uri : this.state.image.uri;
      console.log('preview', uri);
      main = <Image
        ref="preview"
        style={{
          width: fullWidth,
          height: fullHeight
        }}
        source={{
          isStatic: true,
          uri: uri
        }}
      />
    }

    return (
      <View style={styles.container}>
        <View style={styles.cameraTop}>
          {this.state.stage === 'capture' ? <Button text="Switch camera view" onPress={this.switchCamera.bind(this)} /> : undefined }
        </View>
        {main}
        <View style={styles.cameraBottom}>
          {this.state.stage === 'capture' ? <Button testingStyles={{width: 75, height: 75, borderRadius: 75 / PixelRatio.get(), backgroundColor: "white"}} onPress={this.takePicture.bind(this)} /> : undefined }
          {this.state.stage === 'preview' ? <Button testingStyles={{backgroundColor: "black"}} text="Reset" onPress={this.setStage.bind(this, 'capture')} /> : undefined }
        </View>
      </View>
    );
  }

  switchCamera() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  }

  takePicture() {
    this.refs.cam.capture((err, data) => {
      console.log(err, data);
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
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  camera: {
    height: 400,
    width: fullWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cameraTop: {
    backgroundColor: 'black',
    flex: 1,
    width: fullWidth,
  },
  cameraBottom: {
    backgroundColor: 'black',
    flex: 1,
    width: fullWidth,
    justifyContent: 'center',
    alignItems: 'center',
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