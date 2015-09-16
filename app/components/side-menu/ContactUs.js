import React from 'react-native';
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
    console.log(Mailer);
    Mailer.mail({
      subject: 'Support Request - iOS',
      recipients: ['contact@mmmystery.com'],
      body: 'What\'s up Mmmystery team?  I wanna report the following: ',
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
    console.log('onPress Call');
    var url = 'tel:1-408-555-5555';
    LinkingIOS.canOpenURL(url, (supported) => {
    if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        LinkingIOS.openURL(url);
      }
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
            <Text style={styles.text}>Send us an email</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressCall.bind(this)} style={styles.buttomItemCall}>
          <View style={styles.phone}>
            <Text style={styles.text}>Give us a call</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  bodyText: {
    fontSize: 22,
  },
  title: {
    textDecorationStyle: 'solid',
    textDecorationColor: 'yellow',
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold',
  },
  baseText: {
    fontFamily: 'Cochin',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 150,
  },
  buttomItemEmail: {
    width: 285,
    height: 65,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFBF00',
  },
  buttomItemCall: {
    borderWidth: 1,
    width: 285,
    height: 65,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(253,253,253)',
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  phone: {
    flex: 33,
    justifyContent: 'center',
  },
  email: {
    flex: 33,
    justifyContent: 'center',
  },
  text: {
    fontSize: 19,
  },
});

export default Contact;
