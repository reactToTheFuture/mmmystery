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
var foodImages = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GyMU3emKj7Z96dsKQ2DjXdxg2tsltSKcz_A3mfmLemxg-b2YMg',
              'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT3Nvl35dfCUrUB3F8wUR1Rd6cYA9EkFoF_Hrez12gAlErab6M-xw',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GyMU3emKj7Z96dsKQ2DjXdxg2tsltSKcz_A3mfmLemxg-b2YMg',
              'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT3Nvl35dfCUrUB3F8wUR1Rd6cYA9EkFoF_Hrez12gAlErab6M-xw',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GyMU3emKj7Z96dsKQ2DjXdxg2tsltSKcz_A3mfmLemxg-b2YMg',
              'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT3Nvl35dfCUrUB3F8wUR1Rd6cYA9EkFoF_Hrez12gAlErab6M-xw',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GyMU3emKj7Z96dsKQ2DjXdxg2tsltSKcz_A3mfmLemxg-b2YMg',
              'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT3Nvl35dfCUrUB3F8wUR1Rd6cYA9EkFoF_Hrez12gAlErab6M-xw',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GyMU3emKj7Z96dsKQ2DjXdxg2tsltSKcz_A3mfmLemxg-b2YMg',
              'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT3Nvl35dfCUrUB3F8wUR1Rd6cYA9EkFoF_Hrez12gAlErab6M-xw',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GyMU3emKj7Z96dsKQ2DjXdxg2tsltSKcz_A3mfmLemxg-b2YMg',
              'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT3Nvl35dfCUrUB3F8wUR1Rd6cYA9EkFoF_Hrez12gAlErab6M-xw',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GyMU3emKj7Z96dsKQ2DjXdxg2tsltSKcz_A3mfmLemxg-b2YMg',
              'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT3Nvl35dfCUrUB3F8wUR1Rd6cYA9EkFoF_Hrez12gAlErab6M-xw',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GyMU3emKj7Z96dsKQ2DjXdxg2tsltSKcz_A3mfmLemxg-b2YMg',
              'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT3Nvl35dfCUrUB3F8wUR1Rd6cYA9EkFoF_Hrez12gAlErab6M-xw',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GyMU3emKj7Z96dsKQ2DjXdxg2tsltSKcz_A3mfmLemxg-b2YMg',
              'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT3Nvl35dfCUrUB3F8wUR1Rd6cYA9EkFoF_Hrez12gAlErab6M-xw'];
var imagesName = ['Mexican', 'Americano', 'Thai', 'Indian','Fish', 'Italian', 'Sushi', 'Pizza', 'Hotpot', 'Mexican', 'Americano', 'Thai', 'Indian','Fish', 'Italian', 'Sushi', 'Pizza', 'Hotpot'];

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
    return (
      <View style={styles.container}>
        <Text> Is there anything
          <Text>you'd especially like today?</Text>
        </Text>
        <Swiper style={styles.wrapper}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          showsButtons={false}>
            { this.state.setsOfNinePics.map((oneSetOfNineGrid, setNumber) => {
              return (
                <View style={styles.imageGrid}>
                   { oneSetOfNineGrid.map((image, imageN) => {
                    return (
                      <TouchableHighlight
                        underlayColor={'transparent'}
                        style={styles.button}
                        onPress={this.selectImage.bind(this, setNumber, imageN)}>
                        <Image
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
    backgroundColor: 'yellow',
  },
  wrapper: {
    backgroundColor: 'black',
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