var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
} = React;

class Map extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>sdfsf</Text>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 2
  }
});

module.exports = Map;