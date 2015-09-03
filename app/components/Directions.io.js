var React = require('react-native');

let {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

var colors = {
  clouds: '#ecf0f1'
};

let styles = StyleSheet.create({
  directions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
  },
});

class Directions extends React.Component{

  _onPressButton() {
    if( this.props.stepProgress+1 === this.props.stepDirections.length-1 ) {
      this.props.onArrived();
      return;
    }

    this.props.onStepIncrement();
  }

  render () {
    return (
      <View style={styles.directions}>
        <Text> {this.props.stepDirections[this.props.stepProgress]} </Text>
        <TouchableHighlight
          onPress={this._onPressButton.bind(this)}
          style={styles.button}>
          <Text>NEXT STEP</Text>
        </TouchableHighlight>
      </View>
    );
  };
}

module.exports = Directions;