import React from 'react-native';
import Swiper from 'react-native-swiper';
import Login from './Login';
import globals from '../../../globalVariables';
import Main from '../Main';
import Dimensions from 'Dimensions';

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
        <Image
          style={styles.bg}
          source={require('image!food-bg')}>
          <Swiper
            loop={false}
            onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
            showsPagination={true}
            buttonWrapperStyle={styles.button}
            dot={<View style={styles.dot}></View>}
            activeDot={<View style={[styles.dot, styles.activeDot]}></View>}>
            <View style={[styles.slide]}>
              <Image
                style={styles.image}
                source={require('image!GodMother')}>
              </Image>
              <Text style={styles.headline}>Pick a meal</Text>
              <Text style={styles.paragraph}>
                When you see a meal that you can't resist, swipe right to begin your adventure!
                Swipe left to move on to other choices.
              </Text>
            </View>
            <View style={[styles.slide]}>
              <Image
                style={styles.image}
                source={require('image!GodMother')}>
              </Image>
              <Text style={styles.headline}>Mmmystery Walk</Text>
              <Text style={styles.paragraph}>
                You will then be given step by step walking directions to the restaurant of your selected meal.
              </Text>
              <Text style={styles.paragraph}>
                The catch? We only give you one step at a time!
                You will be given your next step each time you reach the current hamburger marker.
              </Text>
            </View>
            <View style={[styles.slide]}>
              <Image
                style={styles.image}
                source={require('image!GodMother')}>
              </Image>
              <Text style={styles.headline}>Snap a photo</Text>
              <Text style={styles.paragraph}>
                When you arrive at your destination, you can upload your own photo of the meal.
              </Text>
              <Text style={styles.paragraph}>
                Your pic may become the beginning of someone else's next adventure!
              </Text>
            </View>
          </Swiper>
          <TouchableHighlight
            underlayColor={globals.primaryDark}
            style={styles.button}
            onPress={this.onButtonPress.bind(this)}>
            <Text style={styles.buttonText}>{this.props.route.props.isSignedIn ? 'Back' : 'Sign in!'}</Text>
          </TouchableHighlight>
        </Image>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bg: {
    flex: 1,
    overflow: 'visible'
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  headline: {
    marginBottom: 25,
    color: '#fff',
    fontSize: 25,
    fontFamily: 'SanFranciscoDisplay-Semibold',
  },
  paragraph: {
    marginBottom: 20,
    color: '#fff',
    fontSize: 16,
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
  activeDot: {
    backgroundColor: globals.primaryDark,
  },
  button: {
    width: 100,
    position: 'absolute',
    top: 40,
    left: window.width/2 - 50,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 20,
    backgroundColor: globals.primaryDark,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'SanFranciscoDisplay-SemiBold',
  },
  image: {
    marginBottom: 25,
  }
});

module.exports = Walkthrough;
