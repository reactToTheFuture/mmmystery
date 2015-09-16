import React from 'react-native';

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

  constructor(props) {
    super(props);
    this.state = {
      titleText: 'Mmmystery',
      bodyText1: 'Mmmystery was created to help people choose where they\'d like to eat based solely off of the food itself.',
      bodyText2: 'We\'ve found that there\'s too high of a reliance on other\' opinions (and reviews), the location or look of the restaurant, or whether it has what you are traditionaly used to.',
      bodyText3: 'So, my food loving friend, we ask that when using Mmmystery, you trust your gut and discovery all the great cuisine right around you!',
    };
  }

  componentWillReceiveProps(newProps) {
  }

  render() {
    return (
      <View style={styles.container}>
        <Image/>
         <Text style={styles.baseText}>
          <Text style={styles.titleText}>
            {this.state.titleText + '\n\n'}
          </Text>
          <Text style={styles.bodyText} numberOfLines={3}>
            {this.state.bodyText1+ '\n\n'}
          </Text>
          <Text style={styles.bodyText} numberOfLines={5}>
            {this.state.bodyText2 + '\n\n'}
          </Text>
          <Text style={styles.bodyText} numberOfLines={4}>
            {this.state.bodyText3}
          </Text>
        </Text>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 25,
  },
  baseText: {
    fontFamily: 'SanFranciscoText-Regular',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'auto',
  },
  titleText: {
    textDecorationStyle: 'solid',
    textDecorationColor: 'yellow',
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 22,
  },
});

export default About;
