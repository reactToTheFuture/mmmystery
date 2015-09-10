var React = require('react-native');
var Colors = require('../../../globalVariables');


var {
  View,
  Text,
  StyleSheet
} = React;


class PlatesUser extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.picture}></View>
        <Text style={styles.name}>{this.props.user.name}</Text>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    marginTop: 5,
  },
  picture: {
    width:25,
    height: 25,
    backgroundColor: Colors.yellowWhite,
    borderRadius: 25/2,
    marginRight: 5,
  },
  name: {
    fontFamily: 'SanFranciscoText-Regular',
    color: Colors.lightText,
    fontSize: 15
  },
})

module.exports = PlatesUser;






