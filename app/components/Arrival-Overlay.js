var React = require('react-native');
var Dimensions = require('Dimensions');
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
      </Modal>
    );
  }
}

let styles = StyleSheet.create({
  arrivalOverlay: {
    flex: 1,
    justifyContent: 'center',
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

module.exports = ArrivalOverlay;