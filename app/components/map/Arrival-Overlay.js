import React from 'react-native';

import { Icon } from 'react-native-icons';

import Dimensions from 'Dimensions';

import globals from '../../../globalVariables';

var window = Dimensions.get('window');

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
        <View
          style={styles.container}>
          <Image
            source={require('image!celebration-bg')}
            style={styles.bg}>
            <View style={styles.topText}>
              <Text style={[styles.text, styles.announcement]}>Congrats, you've arrived at...</Text>
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
                  <Text style={styles.text}>Upload Photo</Text>
                </View>
              </TouchableHighlight>
            </View>
          </Image>
        </View>
      </Modal>
    );
  }
}

export default ArrivalOverlay;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    flex: 1,
    paddingTop: 25,
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
  bg: {
    flex: 1,
    overflow: 'visible',
  },
  text: {
    fontFamily: globals.fontTextRegular,
    color: '#ffffff',
    fontSize: 22,
    textAlign: 'center',
  },
  title: {
    fontFamily: globals.fontDisplaySemibold,
    fontSize: 30,
  },
  subtitle: {
    fontSize: 26,
  },
  arrivalImage: {
    width: window.width - 40,
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
    width: window.width - 40,
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
