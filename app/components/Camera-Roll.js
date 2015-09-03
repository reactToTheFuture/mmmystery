var React = require('react-native');

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
    this.setState({
      selected: image.uri,
    });

    NativeModules.ReadImageData.readImage(image.uri, (image) => {
      console.log('BASE64 is: ', image);
    });
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageGrid}>
          { this.state.images.map((image) => {
            return (
              <TouchableHighlight onPress={this.selectImage.bind(this, image)}>
                <Image style={styles.image} source={{ uri: image.uri}} />
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
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },
});

module.exports = CameraRollView;