import React from 'react-native';
import Dimensions from 'Dimensions';

const window = Dimensions.get('window');

import globals from '../../../globalVariables';

let {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Text,
  Easing,
  AlertIOS,
  LinkingIOS,
  Animated,
} = React;

class About extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('image!white-pattern-bg')}
          style={styles.bgImage}>
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>Mmmystery</Text>
              <Text style={styles.bodyText}>Mmmystery was created to help people choose where they'd like to eat based solely off of the food itself.</Text>
              <Text style={styles.bodyText}>We've found that there's too high of a reliance on other opinions (and reviews), the location or look of the restaurant, or whether it has what you are traditionaly used to.</Text>
              <Text style={styles.bodyText}>So, my food loving friend, we ask that when using Mmmystery, you trust your gut and discovery all the great cuisine right around you!</Text>
            </View>
          </Image>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    marginBottom: 25,
    fontFamily: 'SanFranciscoText-Semibold',
    color: globals.primary,
    textAlign: 'center',
    fontSize: 35,
  },
  textContainer: {
    paddingHorizontal: 20,
  },
  bodyText: {
    marginBottom: 10,
    fontFamily: 'SanFranciscoText-Regular',
    textAlign: 'auto',
    fontSize: 20,
  },
  bgImage: {
    flex: 1,
    width: window.width,
  },
});

export default About;
