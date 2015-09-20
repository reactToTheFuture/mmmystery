import React from 'react-native';
import Dimensions from 'Dimensions';

const window = Dimensions.get('window');

import globals from '../../../globalVariables';

import { getFaqs } from '../../utils/faqs';

let {
  StyleSheet,
  View,
  Modal,
  ScrollView,
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
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('image!white-pattern-bg')}
          style={styles.bgImage}>
            <ScrollView
              style={styles.listView}>
              {getFaqs().map(function(faq) {
                return (
                  <View style={styles.faq}>
                    <Text style={[styles.text, styles.question]}>
                      {faq.question}
                    </Text>
                    <Text style={[styles.text, styles.answer]}>
                      {faq.answer}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
        </Image>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontFamily: globals.fontTextRegular,
  },
  question: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 18,
  },
  listView: {
    paddingHorizontal: 20,
  },
  faq: {
    marginBottom: 15,
  },
  answer: {
    fontSize: 16,
  },
  bgImage: {
    flex: 1,
    width: window.width,
  },
});

export default FAQ;
