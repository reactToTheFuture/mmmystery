import React from 'react-native';
import Swiper from 'react-native-swiper';
import Login from './Login';
import Dimensions from 'Dimensions';
import Main from '../main/Main';

import globals from '../../../globalVariables';

var window = Dimensions.get('window');

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
    console.log('pressed');
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
                  <View style={styles.shareCard}>
                    <Image
                      style={styles.shareImage}
                      source={require('image!InNOut')}>
                    </Image>
                    <View style={styles.middleShareText}>
                      <Text style={styles.textLight}>Shared by you</Text>
                      <Text style={styles.plateName}>The GodMother</Text>
                      <Text style={styles.text}>Santa Monica, CA</Text>
                    </View>
                    <View>
                      <Text style={styles.textLight}>1w ago</Text>
                    </View>
                  </View>
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

var styles = StyleSheet.create({
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
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'SanFranciscoDisplay-Semibold',
  },
  paragraph: {
    marginBottom: 20,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'SanFranciscoText-Medium',
  },
  dot: {
    backgroundColor: globals.primaryLight,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 3,
  },
  shareCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: 8,
    backgroundColor: '#fff',
  },
  activeDot: {
    backgroundColor: globals.primaryDark,
  },
  button: {
    width: 100,
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  logo: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'SanFranciscoDisplay-SemiBold',
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    marginVertical: 40,
  },
  shareImage: {
    width: 100,
    height: 100,
    marginLeft: -25,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  text: {
    fontFamily: 'SanFranciscoText-Regular',
  },
  textLight: {
    fontFamily: 'SanFranciscoText-Regular',
    color: globals.lightText,
  },
  plateName: {
    marginVertical: 10,
    fontSize: 22,
    fontFamily: 'SanFranciscoText-SemiBold',
    color: globals.primaryDark,
  },
  middleShareText: {
    height: 100,
    marginHorizontal: 20,
    justifyContent: 'center'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  } 
});
