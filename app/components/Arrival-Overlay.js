import React from 'react-native';

import { Icon } from 'react-native-icons';

import Dimensions from 'Dimensions';
var window = Dimensions.get('window');

import globals from '../../globalVariables';

var {
  View,
  Text,
  Modal,
  Image,
  TouchableHighlight,
  StyleSheet
} = React;

class ArrivalOverlay extends React.Component {
  render() {
    return (
      <Modal
        visible={this.props.isVisible}>
        <View style={styles.arrivalOverlay}>
          <View style={styles.topText}>
            <Text style={[styles.text, styles.announcement]}>Congrats, you've arrrived at...</Text>
            <Text style={[styles.text, styles.title]}>{this.props.imageInfo.restaurant}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.arrivalImage}
              source={{uri: this.props.imageInfo.img_url}}
            />
            <Text style={[styles.text, styles.title, styles.subtitle]}>{this.props.imageInfo.name}</Text>
          </View>
          <View style={styles.bottomText}>
            <Text style={[styles.text, styles.reminder]}>Take a pic when your meal arrives!</Text>
            <TouchableHighlight
              underlayColor={globals.primaryLight}
              onPress={this.props.onConfirmation}
              style={styles.button}>
              <View style={styles.innerBtn}>
                <Icon
                  name='ion|ios-camera-outline'
                  size={30}
                  color='#ffffff'
                  style={styles.icon}
                />
                <Text style={styles.text}>Let's take a photo</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }
}

let styles = StyleSheet.create({
  topText: {
    flex: 1,
    paddingTop: 100,
  },
  imageContainer: {
    flex: 2,
  },
  bottomText: {
    flex: 1,
    alignItems: 'center',
  },
  announcement: {
    marginBottom: 10,
  },
  reminder: {
    marginBottom: 20,
  },
  arrivalOverlay: {
    flex: 1,
    backgroundColor: globals.primaryDark,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'SanFranciscoText-Regular',
    color: '#ffffff',
    fontSize: 22,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'SanFranciscoDisplay-SemiBold',
    fontSize: 30,
  },
  subtitle: {
    fontSize: 26,
  },
  arrivalImage: {
    width: window.width - 30,
    height: window.height/4,
    borderRadius: 5,
    borderColor: '#ffffff',
    borderWidth: 6,
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  button: {
    width: window.width - 30,
    padding: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 10,
  },
  innerBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = ArrivalOverlay;