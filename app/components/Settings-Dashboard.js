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
                  'https://media.licdn.com/mpr/mpr/p/1/005/098/14b/3100678.jpg'];
var imagesName = ['Burgers', 'French', 'Thai', 'Indian','Fish', 'Italian', 'Sushi', 'Pizza', 'Hotpot'];
var setsOfSelected = [false,false,false,false,false,false,false,false,false];

class SettingsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setsOfNinePics: foodImages,
      setsOfNineNames: imagesName,
      selected: false,
    };
  }

  componentWillMount() {
  }

  onPressImage(i){
    this.setState({selected: !this.state.selected});
    setsOfSelected[i] = !setsOfSelected[i];
    this.props.route.props.handleSettingsConfig(helpers.createSettingsFilter(setsOfSelected, this.state.setsOfNineNames));
  }

  pictureSelected(i) {
    return setsOfSelected[i];
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Is there anything
          <Text style={styles.textBold}> you'd especially like today?</Text>
        </Text>
        <View style={styles.imageGrid}>
           { this.state.setsOfNinePics.map((image, i) => {
            return (
              <TouchableHighlight
                key={i}
                underlayColor={'transparent'}
                style={styles.button}
                onPress={this.onPressImage.bind(this, i)}>
                <Image
                  key={i}
                  style={this.pictureSelected(i) ? styles.selectedImage : styles.image}
                  source={{ uri: image}} />
              </TouchableHighlight>
            );
          })}
        </View>
        <View>
          <TouchableHighlight
            style={styles.moreSettings}>
            <Text style={styles.textSet}> Filter by <Text style={styles.textBold}>Distance / Price / Relevance     ></Text></Text>
          </TouchableHighlight>
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
    backgroundColor: 'black',
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#FFCE00',
  },
  button: {
    width: 110,
    height: 110,
    margin: 5
  },
  text: {
    fontSize: 30,
    justifyContent: 'center',
  },
  textSet: {
    fontSize: 15,
  },
  textBold: {
    fontWeight: 'bold',
  },
  image: {
    width: 110,
    height: 110,
    borderWidth: 4,
    borderColor: '#ffffff'
  },
  selectedImage: {
    width: 110,
    height: 110,
    borderWidth: 2,
    borderColor: 'red'
  },
  moreSettings: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

module.exports = SettingsDashboard;