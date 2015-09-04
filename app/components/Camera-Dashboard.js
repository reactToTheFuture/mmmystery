var React = require('react-native');
var NavigationBar = require('react-native-navbar');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  NavigatorIOS,
} = React;

var CameraRollView = require('./Camera-Roll');

class CameraDashboard extends React.Component {
  goToCameraRollScreen() {
    this.props.navigator.push({
      title: 'Camera Roll',
      component: CameraRollView,
      navigationBar: (
        <NavigationBar
          title="Camera Roll" />
      )
    });
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.headline}>Now take an image</Text>
        <Text style={styles.subheadline}>blah blah blah</Text>

        <TouchableHighlight onPress={this.goToCameraRollScreen.bind(this)}>
            <Text style={styles.buttonText}>Camera Roll</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headline: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#444444',
    marginBottom: 5,
  },
  subheadline: {
    fontSize: 24,
    color: '#444444',
    marginBottom: 25,
  },
  button: {
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#444444',
  }
});

module.exports = CameraDashboard;