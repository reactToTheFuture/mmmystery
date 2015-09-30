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
      isCroppingPhoto: false,
      imageFrom: 'Camera-Roll',
    };
  }

  componentDidMount() {
    var fetchParams = {
      first: 25
    };

    CameraRoll.getPhotos(fetchParams, this.storeImages.bind(this), this.logError);
  }

  storeImages (data) {
    var assets = data.edges;
    var images = assets.map((asset) => asset.node.image);
    this.setState({
      images: images
    });
  }

  logError (error) {
    console.warn(error);
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

  handleOverlayOpen(image) {
    this.setState({
      isCroppingPhoto: true,
      image: {
        uri: image.uri,
        type: 'file',
        width: image.width,
        height: image.height
      }
    });
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageGrid}>
          {this.state.images.map((image, i) => {
            return (
              <TouchableHighlight
                key={i}
                underlayColor={globals.primary}
                style={styles.button}
                onPress={this.handleOverlayOpen.bind(this, image)}>
                <Image
                  style={styles.image}
                  source={{uri: image.uri}} />
              </TouchableHighlight>
            );
          })}
        </View>
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
  }
});
