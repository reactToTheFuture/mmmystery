var React = require('react-native');
var  {
  View,
  Text,
  TouchableHighlight
} = React;

class Button extends React.Component {
  render() {
    var text;
    if (this.props.text) {
      text =  <Text style={{color: '#444444'}}>{this.props.text}</Text>
    } else {
      text = <View></View>
    }
    return (
      <TouchableHighlight
        underlayColor='red'
        onPress={this.props.onPress}
        style={this.props.testingStyles}>
        {text}
      </TouchableHighlight>
    )
  }
}


module.exports = Button;