import React from 'react-native';

var  {
  View,
  Text,
  TouchableHighlight,
  PixelRatio,
  StyleSheet
} = React;

class CameraLiveButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor='white'
        activeOpacity={.3}
        onPress={this.props.onPress}
        style={this.props.testingStyles}>
        <View style={styles.cameraLiveButton} />
      </TouchableHighlight>
    )
  }
}

styles = StyleSheet.create({
  cameraLiveButton: {
    width: 80,
    height: 80,
    borderRadius: 80 / PixelRatio.get(),
    borderColor: '#feaf00',
    borderWidth: 12,
    backgroundColor: "#ffbf00"
  }
});


export default CameraLiveButton;
