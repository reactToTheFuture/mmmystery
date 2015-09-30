'use strict';
import React from 'react-native';
import globals from '../../../globalVariables';
import { Icon, } from 'react-native-icons';

var {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} = React;

class PlatesFooter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.footer}>
        <Text style={styles.footerLocation}>
          <Text style={styles.footerLocationNear}>Near</Text> {this.props.address}
        </Text>
        <View>
          <TouchableOpacity onPress={this.props.onPressSettings}>
            <Icon name='ion|ios-settings' size={32} color={'#ffffff'} style={styles.categories}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default PlatesFooter;

let styles = StyleSheet.create({
  footer: {
    height: 40,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  footerLocation: {
    color: '#ffffff',
    fontFamily: globals.fontTextRegular,
    fontSize: 15
  },
  footerLocationNear: {
    fontFamily: globals.fontTextSemibold
  },
  categories: {
    width: 32,
    height: 32,
  }
});
