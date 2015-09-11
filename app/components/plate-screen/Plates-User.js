var React = require('react-native');
var Colors = require('../../../globalVariables');


var {
  View,
  Text,
  Image,
  StyleSheet
} = React;


class PlatesUser extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.picture}
          source={{uri: this.props.user.profile_image}}/>
        <Text style={styles.name}>{this.props.user.first_name}</Text>
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
    marginHorizontal: 4,
  },
  picture: {
    width:35,
    height: 35,
    backgroundColor: Colors.yellowWhite,
    borderRadius: 25/2,
    marginRight: 5,
  },
  name: {
    fontFamily: 'SanFranciscoText-Regular',
    color: Colors.lightText,
    fontSize: 18
  },
})

module.exports = PlatesUser;






