import Slider from 'react-native-slider';
import React from 'react-native';

import Dimensions from 'Dimensions';

import { createSettingsFilter, resetFilter } from '../../utils/filters';
import { getDollarImages, getSetsOfSelected, gatCategoryNames, getFoodImages, getSubTitles, } from '../../utils/filters-data';

var window = Dimensions.get('window');

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
                <View>
                  <View style={[styles.iconContainer, this.pictureSelected(i) && styles.iconContainerSelected]}>
                    <Image
                    key={i}
                    style={styles.image}
                    source={image}/>
                  </View>
                  <Text style={[styles.subTitles, this.pictureSelected(i) && styles.subTitlesSelected]}>{subTitles[i]}</Text>
                </View>
              </TouchableHighlight>
            );
          })}
        </View>
        <View style={styles.bottomSettings}>
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
      </View>
    );
  }
}

export default SettingsDashboard;

var categoryWidth = (window.width * 0.65)/3;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  categoriesContainer: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  categoryButton: {
    width: categoryWidth,
    height: categoryWidth + 20,
    marginBottom: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: categoryWidth,
    height: categoryWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF6FF',
    borderRadius: categoryWidth/2,
  },
  iconContainerSelected: {
    backgroundColor: '#FDEDBF',
  },
  subTitles: {
    paddingTop: 8,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'SanFranciscoText-Semibold',
    backgroundColor: 'transparent',
  },
  subTitlesSelected: {
    color: '#FCAE2B',
  },
  textSet: {
    fontSize: 15,
  },
  textBold: {
    fontWeight: 'bold',
  },
  image: {
    width: categoryWidth/2,
    height: categoryWidth/2,
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
  bottomSettings: {
    flex: 1,
    justifyContent: 'flex-end'
  }
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
