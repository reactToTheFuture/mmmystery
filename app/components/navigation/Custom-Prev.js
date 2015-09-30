var React = require('react-native');
var { Icon, } = require('react-native-icons');
var Colors = require('../../../globalVariables');


var {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} = React;

class CustomPrev extends React.Component {

  handlePress() {
    this.props.handler();
  }

  render() {
    return (
      // Need to pass in a handler that actually takes you to the menu
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}>
        <Icon name={'ion|' + this.props.iconName} size={this.props.size} color={this.props.color} style={styles.icon}/>
      </TouchableOpacity>
    );
  }
}


export default CustomPrev;

let styles = StyleSheet.create({
  icon: {
    width: 35,
    height: 35,
    left: 10,
    top: 22
  },
});