var React = require('react-native');
var  {
  Text,
  TouchableHighlight,
  StyleSheet,
} = React;

class Button extends React.Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this.props.onPress}
        style={this.props.testingStyles}>
          <Text style={[styles.text, this.props.textStyle]}>{this.props.text}</Text>
      </TouchableHighlight>
    )
  }
}

var styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'SanFranciscoText-Regular',
  }
})


module.exports = Button;