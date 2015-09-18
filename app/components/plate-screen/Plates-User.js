import React from 'react-native';
import Colors from '../../../globalVariables';

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

export default PlatesUser;

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  picture: {
    width:28,
    height: 28,
    backgroundColor: Colors.yellowWhite,
    borderRadius: 28/2,
    marginRight: 5,
  },
  name: {
    fontFamily: 'SanFranciscoText-Regular',
    color: Colors.lightText,
    fontSize: 16
  },
})
