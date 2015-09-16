import React from 'react-native';
import Communications  from 'react-native-communications';

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

var url =  'mailto:lee.marreros@pucp.pe?subject=My%20Subject&body=My%20body%20text';
class Contact extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: 'Need some help?',
      bodyText: 'Rain or shine, early breakfast or last cocktail. We\'re here for you and just a tap away.',
    };
  }

  componentWillReceiveProps(newProps) {
  }

  onPressSendEmail() {
    console.log('press send e-mail');
    LinkingIOS.canOpenURL('www.fb.com', (supported) => {
      if (!supported) {
        AlertIOS.alert('Can\'t handle url: ' + url);
      } else {
        LinkingIOS.openURL('www.fb.com');
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
        <TouchableOpacity onPress={() => Communications.phonecall('4088768841', true)} style={styles.buttomItemCall}>
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
