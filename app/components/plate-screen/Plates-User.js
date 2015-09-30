import React from 'react-native';
import globals from '../../../globalVariables';

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
        <Text style={styles.name}>Mmm'd by {this.props.user.first_name}</Text>
      </View>
    );
  }
}

export default PlatesUser;

var avatarWidth = 25;

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  picture: {
    width: avatarWidth,
    height: avatarWidth,
    backgroundColor: globals.yellowWhite,
    borderRadius: avatarWidth/2,
    marginRight: 5,
  },
  name: {
    fontFamily: globals.fontTextRegular,
    color: globals.lightText,
    fontSize: 16
  },
});
