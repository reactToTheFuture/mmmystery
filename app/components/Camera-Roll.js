var React = require('react-native');
var RestaurantSelection = require('./Restaurant-Selection');
var NavigationBar = require('react-native-navbar');

var {
  StyleSheet,
  View,
  ScrollView,
  Image,
  CameraRoll,
  TouchableHighlight,
  NativeModules,
} = React;

class CameraRollView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      selected: ''
    };
  }

  componentDidMount() {
    var fetchParams = {
      first: 25,
    };
    CameraRoll.getPhotos(fetchParams, this.storeImages.bind(this), this.logImageError);
  }

  storeImages (data) {
    var assets = data.edges;
    var images = assets.map((asset) => asset.node.image);
    this.setState({
      images: images
    });
  }

  logImageError (error) {
    console.log(error);
  }

  selectImage (image) {

    var base64;

    this.setState({
      selected: image.uri,
    });

    NativeModules.ReadImageData.readImage(image.uri, (image) => {
      base64 = image;
    });

    this.props.navigator.push({
      component: RestaurantSelection,
      props: {
        base64
      },
      navigationBar: (
        <NavigationBar
          title="What Restaurant?" />
      )
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
                onPress={this.selectImage.bind(this, image)}>
                <Image
                  style={[styles.image, this.state.selected === image.uri && styles.selectedImage]}
                  source={{ uri: image.uri}} />
              </TouchableHighlight>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
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

module.exports = CameraRollView;