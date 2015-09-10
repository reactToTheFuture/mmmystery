'use strict';
var React = require('react-native');
var Colors = require('../../../globalVariables');
var { Icon, } = require('react-native-icons');

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
          <TouchableOpacity onPress={() => alert('categories') }>
            <Icon name='ion|ios-settings' size={32} color={Colors.lightText} style={styles.categories}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  footer: {
    height: 40,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  footerLocation: {
    color: Colors.lightText,
    fontFamily: 'SanFranciscoText-Regular',
    fontSize: 15
  },
  footerLocationNear: {
    fontFamily: 'SanFranciscoText-Semibold'
  },
  categories: {
    width: 32,
    height: 32,
  }
});


module.exports = PlatesFooter;
