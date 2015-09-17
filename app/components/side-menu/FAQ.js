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

class FAQ extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      question1: 'Why don\'t you show the location?',
      answer1: 'We don\'t reveal this information because we want your decision on what and where to eat to be based solely off the food you see. A true mystery if you ask us!',
      question2: 'What if I go off track from the route?',
      answer2: 'We\'ll recalculate the steps needed to make sure you arrive at the correct location.',
      question3:'What if I want to invite someone?',
      answer3: 'We\'re working on allowing people to share their chosen meal and the route to get there. For now, you\'ll just need to wait until you arrive and then send out invites!',
    };
  }

  componentWillReceiveProps(newProps) {
  }

  render() {
    return (
      <View style={styles.container}>
         <Text style={styles.baseText}>
          <Text style={styles.question}>
            {this.state.question1 + '\n\n'}
          </Text>
          <Text numberOfLines={4} style={styles.answer}>
            {this.state.answer1 + '\n\n'}
          </Text>
          <Text style={styles.question}>
            {this.state.question1 + '\n\n'}
          </Text>
          <Text numberOfLines={2} style={styles.answer}>
            {this.state.answer1 + '\n\n'}
          </Text>
          <Text style={styles.question}>
            {this.state.question1 + '\n\n'}
          </Text>
          <Text numberOfLines={4} style={styles.answer}>
            {this.state.answer1+ '\n\n'}
          </Text>
        </Text>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  baseText: {
    fontFamily: 'SanFranciscoText-Regular',
  },
  question: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  container: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 25,
    marginHorizontal: 25,
  },
  answer: {
    fontSize: 17,
  },
});

export default FAQ;
