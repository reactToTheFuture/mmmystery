var React = require('react-native');
var Colors = require('../../../globalVariables');

var {
  View,
  Text,
  StyleSheet,
} = React;

class PlatesPriceFactor extends React.Component {
  render() {

    var dollarSigns;
    var dollarSignsBold;
    switch (this.props.priceFactor) {
      case '$':
        dollarSigns = '$$'; dollarSignsBold = '$';
        break;
      case '$$':
        dollarSigns = '$'; dollarSignsBold = '$$';
        break;
      case '$$$':
        dollarSignsBold = '$$$';
        break;
      case '$$$$':
        dollarSignsBold = '$$$';
        break;
      default:
        dollarSigns = '$$'; dollarSignsBold = '$';
    }

    return (
      <View style={styles.dollarSigns}>
        <Text style={styles.dollarSign}><Text style={styles.dollarSignBold}>{dollarSignsBold}</Text>{dollarSigns}</Text>
      </View>
    );
  }
}

export default PlatesPriceFactor;

let styles = StyleSheet.create({
  dollarSigns: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dollarSignBold: {
    color: 'white',
    fontFamily: 'SanFranciscoDisplay-Bold'
  },
  dollarSign: {
    fontSize: 25,
    color: Colors.yellowWhite,
    fontFamily: 'SanFranciscoDisplay-Regular'
  }
});
