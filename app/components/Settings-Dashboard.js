var React = require('react-native');
var Swiper = require('react-native-swiper');
var helpers = require('../utils/helpers');

var {
  StyleSheet,
  View,
  Text,
  ActivityIndicatorIOS,
  ScrollView,
  Image,
  CameraRoll,
  TouchableHighlight,
  NativeModules
} = React;

// Dummy data. Insert pics and categories here.
var foodImages = ['http://www.thetimes.co.uk/tto/multimedia/archive/00378/70911634__378645c.jpg',
                  'http://www.ndtv.com/cooks/images/pizza-junk-food-600.jpg',
                  'http://static2.businessinsider.com/image/51f03f966bb3f73c7700000b/19-fast-food-hacks-that-will-change-the-way-you-order.jpg',
                  'http://blog.nepaladvisor.com/wp-content/uploads/2013/10/Thamel-Food.jpg',
                  'http://isthiswhatyouarelookingfor.com/wp-content/uploads/2015/05/food-spoilt.jpg',
                  'http://images.medicinenet.com/images/slideshow/digestive_disease_myths_s2_spicy_foods_stress.jpg',
                  'http://npic.orst.edu/images/foodsafebnr.jpg',
                  'http://media.independent.com/img/photos/2008/03/05/garden04.jpg',
                  'https://media.licdn.com/mpr/mpr/p/1/005/098/14b/3100678.jpg',
                  'http://www.foodnavigator-usa.com/var/plain_site/storage/images/publications/food-beverage-nutrition/foodnavigator-usa.com/markets/us-organic-food-market-to-grow-14-from-2013-18/8668340-1-eng-GB/US-organic-food-market-to-grow-14-from-2013-18.jpg',
                  'http://www.tacobell.com/static_files/TacoBell/StaticAssets/images/food/foodtypes/slider_tacos_2_2013.png',
                  'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ4ja4coVxpDVk1LJ-NGxIq5hc_P5UqZT43k-0cviGYsDshM8Bt',
                  'http://f.fastcompany.net/multisite_files/fastcompany/imagecache/inline-large/inline/2013/04/3008346-inline-inline-2-deep-inside-doritos-loco-taco.jpg',
                  'http://images.agoramedia.com/everydayhealth/gcms/photogallery_high_cholesterol_foods_09_full.jpg',
                  'http://usercontent1.hubimg.com/3068274_f520.jpg',
                  'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTepPk88fxoesYQlPqjuYmcj-DDXQ7o1bj4FX6LUWsUxoLZLElj',
                  'https://blogs.uoregon.edu/aheverly/files/2015/05/food-as-art-1lbtadl.jpg',
                  'http://www.nutgroveshoppingcentre.ie/_fileUpload/Image/food-art-pictures-design.jpg'];
var imagesName = ['Burgers', 'French', 'Thai', 'Indian','Fish', 'Italian', 'Sushi', 'Pizza', 'Hotpot', 'Mexican', 'Americano', 'Thai', 'Indian','Fish', 'Italian', 'Sushi', 'Pizza', 'Hotpot'];


class SettingsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setsOfNinePics: helpers.makeArrayOfNineArray(foodImages),
      setsOfNineNames: helpers.makeArrayOfNineArray(imagesName),
      setsOfSelected: helpers.makeArrayOfNineArray(foodImages, true),
      selected: false,
    };
  }

  componentWillMount() {
  }

  selectImage(setNumber, imageN){
    this.setState({selected: !this.state.selected});
    this.state.setsOfSelected[setNumber][imageN] = !this.state.setsOfSelected[setNumber][imageN];
    var category = this.state.setsOfNineNames[setNumber][imageN];
    this.props.route.props.handleSettingsConfig(helpers.createSettingsFilter(this.state.setsOfSelected, this.state.setsOfNineNames));
  }

  pictureSelected(setNumber, imageN) {
    return this.state.setsOfSelected[setNumber][imageN];
  }

  render () {
    console.log('OK?');
    return (
      <View style={styles.container}>
        <Text> Is there anything
          <Text>you'd especially like today?</Text>
        </Text>
        <Swiper key={'swiper'} style={styles.wrapper}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          showsButtons={false}>
            { this.state.setsOfNinePics.map((oneSetOfNineGrid, setNumber) => {
              return (
                <View key={setNumber} style={styles.imageGrid}>
                   { oneSetOfNineGrid.map((image, imageN) => {
                    return (
                      <TouchableHighlight
                        key={!!setNumber ? imageN + 9 :  imageN}
                        underlayColor={'transparent'}
                        style={styles.button}
                        onPress={this.selectImage.bind(this, setNumber, imageN)}>
                        <Image
                          key={!!setNumber ? imageN + 18 :  imageN}
                          style={this.pictureSelected(setNumber, imageN) ? styles.selectedImage : styles.image}
                          source={{ uri: image}} />
                      </TouchableHighlight>
                    );
                  })}
                </View>
              );
            })}
        </Swiper>
        <View style={styles.moreSettings}>
          <Text>More settings here</Text>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {
    backgroundColor: 'white',
  },
  imageGrid: {
    flex: 0.8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: 110,
    height: 110,
    margin: 5
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width: 110,
    height: 110,
    borderWidth: 5,
    borderColor: '#ffffff'
  },
  selectedImage: {
    width: 110,
    height: 110,
    borderWidth: 5,
    borderColor: 'blue'
  },
  moreSettings: {
    flex: 0.2,
    backgroundColor: 'blue',
  },
});

module.exports = SettingsDashboard;