import Slider from 'react-native-slider';
import React from 'react-native';
import { createSettingsFilter, resetFilter } from '../../utils/filters';
import { getDollarImages, getSetsOfSelected, gatCategoryNames, getFoodImages, getSubTitles, } from '../../utils/filters-data';

let {
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
let dollarImages = getDollarImages();
let setsOfSelected= getSetsOfSelected();
  // Category names
let subTitles = getSubTitles();

class SettingsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dollarImages,
      setsOfNinePics: getFoodImages(),
      setsOfNineNames: gatCategoryNames(),
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
        <View style={styles.categoriesContainer}>
           { this.state.setsOfNinePics.map((image, i) => {
            return (
              <TouchableHighlight
                key={i}
                underlayColor={'transparent'}
                style={styles.categoryButton}
                onPress={this.onPressImage.bind(this, i)}>
                <View style={this.pictureSelected(i) ? styles.iconContainerSelected : styles.iconContainer}>
                  <Image
                  key={i}
                  style={styles.image}
                  source={image}/>
                  <Text style={this.pictureSelected(i) ? styles.subTitlesSelected : styles.subTitles}>{subTitles[i]}</Text>
                </View>
              </TouchableHighlight>
            );
          })}
        </View>
        <View style={styles.containerSlider}>
          <View style={styles.distanceInfo}><Text style={styles.distanceText}>Distance</Text><Text style={styles.distanceValue}>{this.state.value} Miles</Text></View>
          <Slider
            minimumTrackTintColor='#FCAE2B'
            trackStyle={sliderStyle.track}
            thumbStyle={sliderStyle.thumb}
            value={this.state.value}
            minimumValue={this.state.minimumValue}
            maximumValue={this.state.maximumValue}
            onSlidingComplete={this.onSlidingComplete.bind(this)}
            onValueChange={(value) => {this.setState({value: Math.round(value)});}} />
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Price</Text>
          {this.state.dollarImages.map((image, i) => {
            return (
              <TouchableHighlight
                key={i}
                onPress={this.dollarOnPress.bind(this, i)}
                style={dollarImages[i][1] ? styles.pressDollarSelected : styles.pressDollar}>
                  <Text style={styles.dollarSign}>{i === 0 ? <Text>$</Text> : i === 1 ? <Text>$$</Text> : <Text>$$$</Text>}</Text>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  categoriesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 15,
  },
  categoryButton: {
    width: 95,
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 38
  },
  iconContainer: {
    flex: 1,
    width: 100,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF6FF',
    borderRadius:50,
  },
  iconContainerSelected: {
    flex: 1,
    width: 100,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDEDBF',
    borderRadius:50,
  },
  subTitles: {
    paddingTop: 8,
    fontSize: 17,
    justifyContent: 'center',
    fontFamily: 'SanFranciscoText-Semibold',
    backgroundColor: 'transparent',
  },
  subTitlesSelected: {
    paddingTop: 8,
    fontSize: 17,
    justifyContent: 'center',
    fontFamily: 'SanFranciscoText-Semibold',
    color: '#FCAE2B',
    backgroundColor: 'transparent',
  },
  textSet: {
    fontSize: 15,
  },
  textBold: {
    fontWeight: 'bold',
  },
  image: {
    width: 58,
    height: 58,
    backgroundColor: 'transparent',
  },
  distanceValue: {
    fontFamily: 'SanFranciscoText-Regular',
    fontSize: 17,
  },
  distanceText: {
    fontWeight: 'bold',
    fontFamily: 'SanFranciscoText-Semibold',
    fontSize: 17
  },
  distanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  containerSlider: {
    paddingBottom: 62,
    height: 40,
    marginHorizontal: 30,
    justifyContent: 'center',
  },
  dollarSign: {
    color: '#5B6674',
    fontFamily: 'SanFranciscoText-Semibold',
    fontSize: 20,
  },
  priceText: {
    fontFamily: 'SanFranciscoText-Semibold',
    fontWeight: 'bold',
    fontSize: 17,
  },
  priceContainer: {
    paddingBottom: 30,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  pressDollar: {
    justifyContent: 'center',
    width: 80,
    height: 45,
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#EDF2FE',
  },
  pressDollarSelected: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 45,
    marginHorizontal: 10,
    backgroundColor: '#FCAE2B',
  },
});

var sliderStyle = StyleSheet.create({
  track: {
    height: 2,
    borderRadius: 1,
    backgroundColor: '#AEBCCD',
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#EDF2FE',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
  }
});
