var React = require('react-native');
var Dimensions = require('Dimensions');
var window = Dimensions.get('window');
var Overlay = require('react-native-overlay');

var {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} = React;

let styles = StyleSheet.create({
  arrivalOverlay: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: window.width,
    height: window.height,
    backgroundColor: '#ffffff',
  },
  button: {
  },
  arrivalImg: {
    flex: 1,
    width: window.width,
    height: window.height/4
  }
});

class ArrivalOverlay extends React.Component {
  render() {
    return (
      <Overlay
        isVisible={this.props.isVisible}>
        <View style={styles.arrivalOverlay}>
          <Text>Congrats, you've arrrived at...</Text>
          <Text>{this.props.imageInfo.restaurant}</Text>
          <Image
            style={styles.arrivalImg}
            source={{uri: this.props.imageInfo.img_url}}
          />
          <Text>{this.props.imageInfo.name}</Text>
          <Text>Take a pic when your meal arrives!</Text>
          <TouchableHighlight
          onPress={this.props.onConfirmation}
          style={styles.button}>
            <Text>SOUNDS GOOD</Text>
          </TouchableHighlight>
        </View>
      </Overlay>
    );
  }
}

module.exports = ArrivalOverlay;