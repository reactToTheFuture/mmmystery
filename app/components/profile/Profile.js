import React from 'react-native';

import Dimensions from 'Dimensions';

import globals from '../../../globalVariables';

let {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

class Profile extends React.Component {
  render () {
    return (
      <View>
        <Image
          style={styles.avatar}
          source={{uri: this.props.user && this.props.user.picture.data.url}}/>
        <Text style={styles.name}>{this.props.user && this.props.user.first_name}</Text>
      </View>
    );
  };
}

export default Profile;

let styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
});
