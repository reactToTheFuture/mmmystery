import React from 'react-native';
import DeviceInfo from 'react-native-device-info';

import globals from '../../../globalVariables';

var Mailer = require('NativeModules').RNMail;

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

class Contact extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: 'Need some help?',
      bodyText: 'Rain or shine, early breakfast or last cocktail. We\'re here for you and just a tap away.',
    };
  }
  onPressSendEmail() {
    let getSystemVersion = 'OS: ' + DeviceInfo.getSystemVersion();
    let getModel = 'Device: ' + DeviceInfo.getSystemName();
    let getSystemName = 'Sent from my ' +  DeviceInfo.getModel();

    Mailer.mail({
      subject: 'Support Request - iOS',
      recipients: ['contact@mmmystery.com'],
      body: 'What\'s up Mmmystery team?  I wanna report the following: \n\n\n' + getSystemVersion + '\n' + getModel + '\n\n\n' + getSystemName,
      attachment: {
        path: '',  // The absolute path of the file from which to read data.
        type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf
        name: '',   // Optional: Custom filename for attachment
      }
    }, (error, event) => {
        if(error) {
          AlertIOS.alert('Error', 'Could not send mail. Please send a mail to support@example.com');
        }
    });
  }

  onPressCall() {
    var url = 'tel:1-408-555-5555';
    LinkingIOS.canOpenURL(url, (supported) => {
    if (!supported) {
      console.warn('Can\'t handle url: ' + url);
      return;
    }
    LinkingIOS.openURL(url);
    });
  }

  render() {
    return (
      <View  style={styles.container}>
        <Image/>
        <Text style={styles.baseText}>
          <Text style={styles.title}>
            {this.state.title + '\n'}
          </Text>
          <Text style={styles.bodyText}>
            {this.state.bodyText + '\n\n'}
          </Text>
        </Text>
        <TouchableOpacity onPress={this.onPressSendEmail.bind(this)} style={styles.buttomItemEmail}>
          <View style={styles.email}>
            <Text style={styles.text1}>Send us an email</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressCall.bind(this)} style={styles.buttomItemCall}>
          <View style={styles.phone}>
            <Text style={styles.text2}>Give us a call</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Contact;

// Adjustments depending on the device
import Dimensions from 'Dimensions';
var window = Dimensions.get('window');
var widthRatio = window.width/375,
    heightRatio = window.height/667;
//-----

var styles = StyleSheet.create({
  bodyText: {
    fontSize: 19 * widthRatio,
  },
  title: {
    textDecorationStyle: 'solid',
    textDecorationColor: 'yellow',
    textAlign: 'center',
    fontSize: 33 * widthRatio,
    fontFamily: globals.fontTextSemibold,
  },
  baseText: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 150 * heightRatio,
    marginBottom: 40 * heightRatio,
    marginHorizontal: 10,
    fontFamily: globals.fontTextRegular,
  },
  buttomItemEmail: {
    width: 340 * widthRatio,
    height: 58 * heightRatio,
    marginTop: 20 * heightRatio,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFBF00',
    borderRadius: 4,
  },
  buttomItemCall: {
    borderWidth: 1,
    width: 340 * widthRatio,
    height: 58 * heightRatio,
    marginTop: 20 * heightRatio,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(253,253,253)',
    justifyContent: 'flex-end',
    marginBottom: 50 * heightRatio,
  },
  phone: {
    flex: 33,
    justifyContent: 'center',
  },
  email: {
    flex: 33,
    justifyContent: 'center',
  },
  text1: {
    fontSize: 18 * widthRatio,
    color: 'white',
    fontFamily: globals.fontTextSemibold,
  },
  text2: {
    fontSize: 18 * widthRatio,
    fontFamily: globals.fontTextSemibold,
  },
});

