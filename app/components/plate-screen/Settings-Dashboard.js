import Slider from 'react-native-slider';
import React from 'react-native';
import { createSettingsFilter, resetFilter } from '../../utils/filters';

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

// = [$, $$, $$$];
var dollarImages = [['http://www.cedarpostnj.com/icon-dollar.png', false],
                ['http://www.cedarpostnj.com/icon-dollar.png', false],
                ['http://www.cedarpostnj.com/icon-dollar.png', false]];

var setsOfSelected= [false,false,false,false,false,false,false,false,false];

var foodImages= ['http://www.thetimes.co.uk/tto/multimedia/archive/00378/70911634__378645c.jpg',
                'http://www.ndtv.com/cooks/images/pizza-junk-food-600.jpg',
                'http://static2.businessinsider.com/image/51f03f966bb3f73c7700000b/19-fast-food-hacks-that-will-change-the-way-you-order.jpg',
                'http://blog.nepaladvisor.com/wp-content/uploads/2013/10/Thamel-Food.jpg',
                'http://isthiswhatyouarelookingfor.com/wp-content/uploads/2015/05/food-spoilt.jpg',
                'http://images.medicinenet.com/images/slideshow/digestive_disease_myths_s2_spicy_foods_stress.jpg',
                'http://npic.orst.edu/images/foodsafebnr.jpg',
                'http://media.independent.com/img/photos/2008/03/05/garden04.jpg',
                'https://media.licdn.com/mpr/mpr/p/1/005/098/14b/3100678.jpg'];

  // Category names
var imagesName= [['American', 'newamerican', 'tradamerican', 'hotdogs', 'hotdog', 'burgers'],
                  ['Mexican & Latin', 'mexican', 'tex-mex', 'latin'],
                  ['Delis & Sandwiches', 'delis', 'sandwiches'],
                  ['Breakfast', 'Brunch & Bakeries', 'breakfast_brunch', 'bakeries', 'cafes'],
                  ['Italian & Pizza', 'italian', 'pizza'],
                  ['Asian', 'japanese', 'sushi', 'asianfusion', 'thai', 'ramen', 'vietnamese', 'indpak', 'chinese', 'korean'],
                  ['Seafood or Raw', 'seafood', 'raw_food'],
                  ['Healthy','salad','juicebars','vegan','gluten_free'],
                  ['Other']];

class SettingsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dollarImages,
      setsOfNinePics: foodImages,
      setsOfNineNames: imagesName,
      selected: false,
      minimumValue: 0,
      maximumValue: 10,
      selected: false,
      value: null,
      radius: null,
    };
  }

  resetSettings() {
    this.setState({value: 5,});
    dollarImages = resetFilter(dollarImages, true);
    setsOfSelected =  resetFilter(setsOfSelected, false);
  }

  onPressImage(i){
    console.log('press Image');
    this.setState({selected: !this.state.selected});
    setsOfSelected[i] = !setsOfSelected[i];
    var filterCategories = createSettingsFilter(setsOfSelected, this.state.setsOfNineNames)
    this.props.route.props.handleSettingsConfig('categories', filterCategories);
  }

  pictureSelected(i) {
    return setsOfSelected[i];
  }

  onSlidingComplete() {
    console.log('slide Image');
    this.props.route.props.handleSettingsConfig('keepRadius', this.state.value);
  }

  dollarOnPress(i) {

    this.setState({selected: !this.state.selected});

    // Unselect same button
    if (dollarImages[i][1]) {
      dollarImages[i][1] = !dollarImages[i][1];
      this.props.route.props.handleSettingsConfig('dollar', dollarImages.map((image)=>{return image[1];},[]));
      return;
    };

    var counter=0;
    dollarImages.map((image) => {image[1] ? null : counter++;});

    // first time
    if (counter===3) {
      dollarImages[i][1] = !dollarImages[i][1];
      this.props.route.props.handleSettingsConfig('dollar', dollarImages.map((image)=>{return image[1];},[]));
      return;
    };

    // second time, different button
    if (counter===2) {
        dollarImages[i][1] = !dollarImages[i][1];
        this.props.route.props.handleSettingsConfig('dollar', dollarImages.map((image)=>{return image[1];},[]));
        return;
    };

    if (counter===1) {
        dollarImages[i][1] = !dollarImages[i][1];
        this.props.route.props.handleSettingsConfig('dollar', dollarImages.map((image)=>{return image[1];},[]));
        return;
    };
  }

  componentWillMount() {
    this.setState({value: Math.round(this.props.route.props.radiusDefault)});
    if (this.props.route.props.resetSettings) {
      this.resetSettings();
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    // already started building the plates array

  }

  render() {
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
        <View style={styles.containerSlider}>
          <Text>{this.state.value} Miles</Text>
          <Slider
            trackStyle={sliderStyle.track}
            thumbStyle={sliderStyle.thumb}
            value={this.state.value}
            minimumValue={this.state.minimumValue}
            maximumValue={this.state.maximumValue}
            onSlidingComplete={this.onSlidingComplete.bind(this)}
            onValueChange={(value) => {this.setState({value: Math.round(value)});}} />
        </View>
        <View style={styles.priceContainer}>
          {this.state.dollarImages.map((image, i) => {
            return (
              <TouchableHighlight
                key={i}
                onPress={this.dollarOnPress.bind(this, i)}
                style={dollarImages[i][1] ? styles.pressDollarSelected : styles.pressDollar}>
                <Image
                  style={styles.imageDollar}
                  source={{uri: image[0]}}/>
              </TouchableHighlight>
            );
          })}
        </View>
      </View>
    );
  }
}

export default SettingsDashboard;

var styles = StyleSheet.create({
  pressDollar: {
    width: 70,
    height: 50,
    marginHorizontal: 10,
  },
  pressDollarSelected: {
    width: 70,
    height: 50,
    marginHorizontal: 10,
    borderWidth: 2.5,
    borderColor: 'green'
  },
  imageDollar: {
    flex: 1,
    backgroundColor: '#FFCE00'
  },
  priceContainer: {
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  containerSlider: {
    paddingBottom: 30,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    marginHorizontal: 100,
    alignItems: 'stretch',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
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
    borderWidth: 4,
    borderColor: 'blue'
  },
  moreSettings: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

var sliderStyle = StyleSheet.create({
  track: {
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
  }
});
