import React from 'react-native';
import { Icon } from 'react-native-icons';

import globals from '../../../globalVariables';
import Button from './Button';
import Dimensions from 'Dimensions';

var {
  Image,
  Modal,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = React;

var ImageEditingManager = NativeModules.ImageEditingManager;
var RCTScrollViewConsts = NativeModules.UIManager.RCTScrollView.Constants;
var ImageStoreManager = NativeModules.ImageStoreManager;

var deviceScreen = Dimensions.get('window');
var fullWidth = deviceScreen.width;
var fullHeight = deviceScreen.height;

var PAGE_SIZE = 20;

type ImageOffset = {
  x: number;
  y: number;
};

type ImageSize = {
  width: number;
  height: number;
};

type TransformData = {
  offset: ImageOffset;
  size: ImageSize;
}

class CameraCrop extends React.Component {
  _isMounted: boolean;
  _transformData: TransformData;

  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      measuredSize: {
        width: fullWidth,
        height: fullWidth + 55,
      },
      croppedImageURI: null,
      cropError: null,
      isCropped: null,
      imageFlow: 'Retake',
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    var error = null;
    if (this.state.cropError) {
      error = (
        <Text>{this.state.cropError.message}</Text>
      );
    }
    return (
      <Modal
        visible={this.props.isVisible}
        style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.cameraTop}>
            <View style={styles.cameraTopIcon}>
              <TouchableOpacity
                  underlayColor='transparent'
                  onPress={this.props.onOverlayClose}
                  style={styles.cameraTopCancel}>
                  <View>
                    <Icon
                      name='ion|ios-close-empty'
                      size={40}
                      color={globals.darkBackgroundText}
                      style={styles.cameraCancelIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.cameraTopText}>Crop</Text>
              <View style={styles.cameraTopIcon} />
          </View>
          <ImageCropper
            image={this.props.image}
            size={this.state.measuredSize}
            style={[styles.imageCropper, this.state.measuredSize]}
            onTransformDataChange={(data) => this._transformData = data}
          />
          <View style={styles.cropBottom}>
            <View style={styles.cropBottomHelp}>
              <View style={styles.helpContainer}>
                <Icon
                  name='ion|ios-crop'
                  size={20}
                  color='#949597'
                  style={styles.touchIcon}
                />
                <Text style={{color: '#949597'}}>Drag and zoom to crop</Text>
              </View>
            </View>
            <View style={styles.cropBottomButtons}>
              <Button testingStyles={styles.buttonReset} textStyle={styles.resetText} text={this.props.imageFrom === 'Camera-Roll' ? 'Camera Roll' : 'Retake' } onPress={this._reset.bind(this)} />
              <Button testingStyles={styles.buttonUsePhoto} textStyle={styles.usePhotoText} text="Use Photo" onPress={this._crop.bind(this)} />
            </View>
          </View>
          {error}
        </View>
      </Modal>
    );
  }

  _crop() {
    ImageEditingManager.cropImage(
      this.props.image.uri,
      this._transformData,
      (croppedImageURI) => {
        this.setState({croppedImageURI})
        ImageStoreManager.getBase64ForTag(croppedImageURI, (image) => {
          this.props.onPhotoAccept({image});
        },
        (base64Error) => this.setState({base64Error}))
      },
      (cropError) => this.setState({cropError})
    );
    this.state.isCropped = true;
  }

  _reset() {
    this.setState({
      croppedImageURI: null,
      cropError: null,
    });
    this.props.onOverlayClose();
  }

}

class ImageCropper extends React.Component {
  _scaledImageSize: ImageSize;
  _contentOffset: ImageOffset;

  componentWillMount() {
    // Scale an image to the minimum size that is large enough to completely
    // fill the crop box.
    var widthRatio = this.props.image.width / this.props.size.width;
    var heightRatio = this.props.image.height / this.props.size.height;
    if (widthRatio < heightRatio) {
      this._scaledImageSize = {
        width: this.props.size.width,
        height: this.props.image.height / widthRatio,
      };
    } else {
      this._scaledImageSize = {
        width: this.props.image.width / heightRatio,
        height: this.props.size.height,
      };
    }
    this._contentOffset = {
      x: (this._scaledImageSize.width - this.props.size.width) / 2,
      y: (this._scaledImageSize.height - this.props.size.height) / 2,
    };
    this._updateTransformData(
      this._contentOffset,
      this._scaledImageSize,
      this.props.size
    );
  }

  _onScroll(event) {
    this._updateTransformData(
      event.nativeEvent.contentOffset,
      event.nativeEvent.contentSize,
      event.nativeEvent.layoutMeasurement
    );
  }

  _updateTransformData(offset, scaledImageSize, croppedImageSize) {
    var offsetRatioX = offset.x / scaledImageSize.width;
    var offsetRatioY = offset.y / scaledImageSize.height;
    var sizeRatioX = croppedImageSize.width / scaledImageSize.width;
    var sizeRatioY = croppedImageSize.height / scaledImageSize.height;

    this.props.onTransformDataChange && this.props.onTransformDataChange({
      offset: {
        x: this.props.image.width * offsetRatioX,
        y: this.props.image.height * offsetRatioY,
      },
      size: {
        width: this.props.image.width * sizeRatioX,
        height: this.props.image.height * sizeRatioY,
      },
    });
  }

  render() {
    var decelerationRate =
      RCTScrollViewConsts && RCTScrollViewConsts.DecelerationRate ?
        RCTScrollViewConsts.DecelerationRate.Fast :
        0;

    return (
      <ScrollView
        alwaysBounceVertical={true}
        automaticallyAdjustContentInsets={false}
        contentOffset={this._contentOffset}
        decelerationRate={decelerationRate}
        horizontal={true}
        maximumZoomScale={3.0}
        onMomentumScrollEnd={this._onScroll.bind(this)}
        onScrollEndDrag={this._onScroll.bind(this)}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={this.props.style}
        scrollEventThrottle={16}>
        <Image source={this.props.image} style={this._scaledImageSize} />
      </ScrollView>
    );
  }

}

export default CameraCrop;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globals.cameraBackground,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: globals.cameraBackground,
  },
  imageCropper: {
    alignSelf: 'center',
    flex: 0,
    backgroundColor: globals.cameraBackground,
  },
  cameraTopCancel: {
    alignSelf: 'center',
  },
  cameraCancelIcon: {
    width: 40,
    height: 40,
  },
  touchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  cameraTop: {
    backgroundColor: globals.cameraBackground,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    //flex: 2,
    height: 70,
    paddingTop: 10,
    width: fullWidth,
  },
  cameraTopIcon: {
    flex: 1,
  },
  cameraTopText: {
    flex: 7,
    textAlign: 'center',
    fontFamily: globals.fontDisplayRegular,
    color: globals.darkBackgroundText,
    fontSize: 18,
  },
  cropButtonTouchable: {
    alignSelf: 'center',
    marginTop: 12,
  },
  cropButton: {
    padding: 12,
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  cropButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  cropBottom: {
    flex: 7,
    backgroundColor: globals.cameraBackground,
    flexDirection: 'column',
    alignItems: 'center',
    width: fullWidth,
  },
  cropBottomButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: fullWidth,
  },
  cropBottomHelp: {
    height: 40,
    flex: 0,
    backgroundColor: '#1A1C1E',
    width: fullWidth,
  },
  helpContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonUsePhoto: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonReset: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  usePhotoText: {
    fontFamily: globals.fontTextSemiBold
  },
  resetText: {
    color: '#949597',
  }

});