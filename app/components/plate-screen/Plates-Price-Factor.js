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
      <Text style={styles.dollarSign}><Text style={styles.dollarSignBold}>{dollarSignsBold}</Text>{dollarSigns}</Text>
    );
  }
}

export default PlatesPriceFactor;

let styles = StyleSheet.create({
  dollarSignBold: {
    color: Colors.primaryDark,
    fontFamily: 'SanFranciscoDisplay-Semibold'
  },
  dollarSign: {
    fontSize: 20,
    color: Colors.yellowWhite,
    fontFamily: 'SanFranciscoDisplay-Regular'
  }
});
