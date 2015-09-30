import React from 'react-native';
import Swiper from 'react-native-swiper';
import Login from './Login';
import Dimensions from 'Dimensions';
import Main from '../main/Main';

import globals from '../../../globalVariables';

var window = Dimensions.get('window');

var dishes = [{
  name: 'Italiano',
  image: require('image!GodMother'),
  location: 'Santa Monica, CA',
  date: '2d ago'
},{
  name: 'Dbl Cheese',
  image: require('image!InNOut'),
  location: 'Salt Lake City, Ut',
  date: '1w ago'
},
{
  name: 'Pad Thai',
  image: require('image!padThai'),
  location: 'New York, NY',
  date: '2w ago'
}];

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React

class Walkthrough extends React.Component {

  onMomentumScrollEnd(e, state, context) {
    // console.log(state, context.state);
  }
  onButtonPress() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View
        style={styles.container}>
          <Swiper
            loop={false}
            onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
            showsPagination={true}
            buttonWrapperStyle={styles.button}
            dot={<View style={styles.dot}></View>}
            activeDot={<View style={[styles.dot, styles.activeDot]}></View>}>
            <View style={[styles.slide]}>
              <Image
                style={styles.bg}
                source={require('image!food-bg')}>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.imageCard1}
                    source={require('image!card')}>
                  </Image>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.headline}>Taken at face value</Text>
                  <Text style={styles.paragraph}>
                    <Text style={styles.emphasis}>No stars.</Text> <Text style={styles.emphasis}>No reviews. </Text>
                    <Text>No restaurant name. Swipe right based solely off the looks of the plate to begin your adventure!</Text>
                  </Text>
                </View>
              </Image>
            </View>
            <View style={[styles.slide]}>
              <Image
                style={styles.bg}
                source={require('image!walkthrough-bg-2')}>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.imageCard2}
                    source={require('image!step-card')}>
                  </Image>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.headline}>Follow the markers</Text>
                  <Text style={styles.paragraph}>
                    To keep it a mmmystery, you'll be given walking directions
                    one step at a time right up until you arrive at your restaurant!
                  </Text>
                </View>
              </Image>
            </View>
            <View style={[styles.slide]}>
              <Image
                style={styles.bg}
                source={require('image!walkthrough-bg-3')}>
                <View style={styles.imageContainer}>
                  {dishes.map(function(dish, i) {
                    return (
                      <View style={styles.shareCard} key={i}>
                        <View style={styles.imageInner}>
                          <Image
                            style={styles.shareImage}
                            source={dish.image}>
                          </Image>
                        </View>
                        <View style={styles.middleShareText}>
                          <View style={styles.textLightContainer}>
                            <Text style={styles.textLight}>Shared by you</Text>
                          </View>
                          <View style={styles.plateNameContainer}>
                            <Text style={styles.plateName}>{dish.name}</Text>
                            <Text style={styles.text}>{dish.location}</Text>
                          </View>
                        </View>
                        <View style={styles.date}>
                          <Text style={styles.textLight}>{dish.date}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.headline}>Sharing is caring</Text>
                  <Text style={styles.paragraph}>
                    Help fellow mmmystery members start their own adventures by snapping and uploading pictures of your meals.
                  </Text>
                </View>
              </Image>
            </View>
          </Swiper>
          <Image
            style={styles.logo}
            source={require('image!logo-orange')}>
          </Image>
          <TouchableHighlight
            underlayColor={globals.primaryDark}
            style={styles.button}
            onPress={this.onButtonPress.bind(this)}>
            <Text style={styles.buttonText}>{this.props.route.props.isSignedIn ? 'Back' : 'Sign in!'}</Text>
          </TouchableHighlight>
      </View>
    );
  }
}

export default Walkthrough;
// Adjustments
var widthRatio = window.width/375,
    heightRatio = window.height/667;
var imageCard1Width =309 * widthRatio,
    imageCard1Height = 365 * heightRatio,
    shareImageWidth = 87 * widthRatio,
    shareImageHeight = 87 * widthRatio,
    imageInnerWidth = 100 * widthRatio,
    imageInnerHeight = 100 * heightRatio;
switch(window.height) {
    case 480: // iPhone 4s
        imageCard1Width = 220;
        imageCard1Height = 260;
        shareImageWidth = 60;
        shareImageHeight = 60;
        imageInnerWidth = 70;
        imageInnerHeight = 70;
        break;
    default:
        break;
}
//-----
var padding = 20;
var middleWidth = (window.width * 1/3) + 20;

var styles = StyleSheet.create({
  imageCard2: {
    width: 325 * widthRatio,
    height: 142 * heightRatio,
  },
  imageCard1: {
    width: imageCard1Width,
    height: imageCard1Height,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible'
  },
  emphasis: {
    fontWeight: 'bold',
  },
  slide: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headline: {
    marginBottom: 10,
    color: '#fff',
    fontSize: 25 * widthRatio,
    textAlign: 'center',
    fontFamily: globals.fontDisplaySemibold,
  },
  paragraph: {
    marginBottom: 20,
    color: '#fff',
    fontSize: 18 * widthRatio,
    textAlign: 'center',
    fontFamily: globals.fontTextMedium,
    paddingHorizontal: 15 * widthRatio,
  },
  dot: {
    backgroundColor: globals.primaryLight,
    width: 12 * widthRatio,
    height: 12 * heightRatio,
    borderRadius: 6,
    marginRight: 3,
    marginTop: 3,
    marginBottom: -5 -(5*heightRatio),
    marginLeft: 3,
  },
  shareCard: {
    flexDirection: 'row',
    flex: 0,
    height: 110 * heightRatio,
    marginBottom: 10 * heightRatio,
    paddingHorizontal: 5 * widthRatio,
    paddingTop: 5 * heightRatio,
    borderRadius: 3,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  activeDot: {
    backgroundColor: globals.primaryDark,
  },
  button: {
    width: 90,
    position: 'absolute',
    top: 30,
    left: padding,
    padding: 7,
    borderWidth: 1,
    borderColor: globals.primaryLight,
    borderRadius: 2
  },
  logo: {
    position: 'absolute',
    top: 30,
    right: padding,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: globals.fontDisplaySemibold,
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    marginTop: 100 * heightRatio,
    alignSelf: 'center',
  },
  imageInnerCard1: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    width: imageInnerWidth,
    height: imageInnerHeight,
    backgroundColor: 'white',
    borderRadius: 3,
    marginLeft: -20,
  },
  imageInner: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    width: imageInnerWidth,
    height: imageInnerHeight,
    backgroundColor: 'white',
    borderRadius: 3,
    marginLeft: -20,
  },
  shareImage: {
    width: shareImageWidth,
    height: shareImageHeight,
    borderRadius: 2,
  },
  text: {
    fontFamily: globals.fontTextRegular,
  },
  textLightContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    flex: 1,
  },
  textLight: {
    fontFamily: globals.fontTextRegular,
    color: globals.lightText,

    marginBottom: 5,
  },
  date: {
    width: 50,
    paddingTop: 5,
  },
  plateNameContainer: {
    flex:3,
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  plateName: {
    fontSize: 22,
    fontFamily: globals.fontTextSemibold,
    color: globals.primaryDark,
    marginBottom: 4,
  },
  middleShareText: {
    flexDirection: 'column',
    width: middleWidth,
    paddingHorizontal: 5,
    paddingTop: 5,
    justifyContent: 'center',
    flex: 1
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: padding,
  }
});
