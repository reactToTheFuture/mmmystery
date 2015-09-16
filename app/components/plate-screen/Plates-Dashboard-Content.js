import React from 'react-native';
import Colors from '../../../globalVariables';
import PlatesPriceFactor from './Plates-Price-Factor';
import PlatesUser from './Plates-User';

import { milesToMins } from '../../utils/helpers';

var {
  StyleSheet,
  View,
  Text,
  Image,
} = React;

class PlatesDashboardContent extends React.Component {
  render() {

    let plateStyling;
    if (this.props.plate) {
      if (this.props.plate.name.length <= 18) {
        plateStyling = styles.plateNameLarge;
      } else if (this.props.plate.name.length > 42) {
        plateStyling = styles.plateNameSmall;
      } else {
        plateStyling = styles.plateName;
      }
    }

    return (
      <View style={styles.imageFooter}>
        <View style={styles.footerText}>
          <Text style={styles.introTime}>You're just
            <Text style={styles.minutes}> {milesToMins(this.props.plate.distance)} minutes </Text> away!
          </Text>
          <Text style={plateStyling}>{this.props.plate ? this.props.plate.name : null} </Text>
          { this.props.plate && this.props.plate.user &&
            <PlatesUser user={this.props.plate.user} />
          }
        </View>
        <PlatesPriceFactor priceFactor={this.props.priceFactor} />
      </View>
    );
  }
}

export default PlatesDashboardContent;

let styles = StyleSheet.create({
  imageFooter: {
    flex: 3,
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  footerText: {
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  footerDisplay: {
    flex: 1
  },
  plateName: {
    flex: 1,
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'SanFranciscoDisplay-Regular',
    color: Colors.darkText
  },
  plateNameLarge: {
    flex: 1,
    fontSize: 32,
    lineHeight: 35,
    marginTop: 5,
    marginBottom: 7,
    fontFamily: 'SanFranciscoDisplay-Light',
    color: Colors.darkText
  },
  plateNameSmall: {
    flex: 1,
    fontSize: 20,
    lineHeight: 25,
    marginBottom: 5,
    fontFamily: 'SanFranciscoDisplay-Light',
    color: Colors.darkText
  },
  introTime: {
    flex: 1,
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'SanFranciscoText-Regular',
    color: Colors.mediumText,
    alignSelf: 'flex-start'
  },
  minutes: {
    color: '#FEBB27',
    fontWeight: 'bold'
  }
});
