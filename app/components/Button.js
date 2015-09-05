var React = require('react-native');
var  {
  Text,
  TouchableHighlight
} = React;

class Button extends React.Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this.props.onPress}
        style={this.props.testingStyles}>
          <Text style={{color: 'white', textAlign: 'center'}}>{this.props.text}</Text>
      </TouchableHighlight>
    )
  }
}


module.exports = Button;