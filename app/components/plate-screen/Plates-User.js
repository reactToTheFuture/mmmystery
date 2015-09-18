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
        <Text style={styles.name}>mmm'd by {this.props.user.first_name}</Text>
      </View>
    );
  }
}

export default PlatesUser;

var avatarWidth = 32;

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  picture: {
    width: avatarWidth,
    height: avatarWidth,
    backgroundColor: Colors.yellowWhite,
    borderRadius: avatarWidth/2,
    marginRight: 5,
  },
  name: {
    fontFamily: 'SanFranciscoText-Regular',
    color: Colors.lightText,
    fontSize: 16
  },
});
