var React = require('react-native');
var { Icon, } = require('react-native-icons');
var Colors = require('../../../globalVariables');


var {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} = React;

class CustomNext extends React.Component {

  handlePress() {
    this.props.handler();
  }

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress.bind(this)}>
        <Icon name={'ion|' + this.props.iconName} size={this.props.size} color={this.props.color} style={styles.icon}/>
      </TouchableOpacity>
    );
  }
}

export default CustomNext;

let styles = StyleSheet.create({
  icon: {
    width: 37,
    height: 37,
    right: 10,
    top: 21
  },
});
