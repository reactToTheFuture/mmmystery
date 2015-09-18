import React from 'react-native';
import NavigationBar from 'react-native-navbar';
import Dimensions from 'Dimensions';

import CameraCrop from './Camera-Crop';

import RestaurantSelection from '../image-uploads/Restaurant-Selection';
import MealSelection from '../image-uploads/Meal-Selection';

import globals from '../../../globalVariables';

var {
  StyleSheet,
  View,
  ActivityIndicatorIOS,
  ScrollView,
  Image,
  CameraRoll,
  TouchableHighlight,
  NativeModules,
} = React;

var deviceScreen = Dimensions.get('window');
var fullWidth = deviceScreen.width;
var fullHeight = deviceScreen.height;

class CameraRollView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      loading: false,
      selectedImage: null,
      selectedImageUri: '',
      selectedImageBase64: null,
      isCroppingPhoto: false,
      imageFrom: 'Camera-Roll',
    };
  }

  componentDidMount() {
    var fetchParams = {
      first: 25
    };

    this.setState({
      loading: true
    });

    CameraRoll.getPhotos(fetchParams, this.storeImages.bind(this), this.logError);
  }

  storeImages (data) {
    var assets = data.edges;
    var images = assets.map((asset) => asset.node.image);
    this.setState({
      loading: false,
      images: images
    });
  }

  logError (error) {
    console.log(error);
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
          title="Where are you at?" />
      )
    });
  }

  handleOverlayClose() {
    this.setState({
      isCroppingPhoto: false
    });
  }

  handleOverlayOpen(image) {
    this.setState({
      isCroppingPhoto: true,
      image: {
        uri: image.uri,
        type: 'file',
        width: fullWidth,
        height: fullWidth + 55
      }
    });
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageGrid}>
          { this.state.images.map((image, i) => {
            return (
              <TouchableHighlight
                key={i}
                underlayColor={'orange'}
                style={styles.button}
                onPress={this.handleOverlayOpen.bind(this, image)}>
                <Image
                  style={[styles.image, this.state.selected === image.uri && styles.selectedImage]}
                  source={{ uri: image.uri}} />
              </TouchableHighlight>
            );
          })}
        </View>
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={styles.loadingIcon}
          size="large"
        />
        <CameraCrop
          isVisible={this.state.isCroppingPhoto}
          image={this.state.image}
          imageFrom={this.state.imageFrom}
          onPhotoAccept={this.goToNextSelection.bind(this)}
          onOverlayClose={this.handleOverlayClose.bind(this)} />
      </ScrollView>
    );
  }
}

export default CameraRollView;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: globals.secondary,
    position: 'relative',
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  loadingIcon: {
    position: 'absolute',
    top: (deviceScreen.height/2 - 18),
    left: (deviceScreen.width/2 - 18),
    backgroundColor: "transparent",
  },
  button: {
    width: 110,
    height: 110,
    margin: 5
  },
  image: {
    width: 110,
    height: 110,
    borderWidth: 5,
    borderColor: '#ffffff'
  },
  selectedImage: {
    borderColor: 'orange'
  }
});
