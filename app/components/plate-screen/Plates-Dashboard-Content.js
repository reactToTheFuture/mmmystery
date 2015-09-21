import React from 'react-native';
import Dimensions from 'Dimensions';
import globals from '../../../globalVariables';
import PlatesPriceFactor from './Plates-Price-Factor';
import PlatesUser from './Plates-User';

import { milesToMins } from '../../utils/helpers';

var window = Dimensions.get('window');

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
        <View style={styles.footerTop}>
          <View style={styles.minutesAway}>
            <Image
              style={styles.iconWalker}
              source={require('image!icon-directions-walker')}
            />
            <Text style={styles.introTime}>Just
              <Text style={styles.minutes}> {milesToMins(this.props.plate.distance)} minutes </Text> away
            </Text>
          </View>
          <Text style={[styles.plate, plateStyling]}>{this.props.plate ? this.props.plate.name : null} </Text>
        </View>
        <View style={styles.border}></View>
        <View style={styles.footerBottom}>
          { this.props.plate.user && <PlatesUser user={this.props.plate.user} /> }
          <PlatesPriceFactor priceFactor={this.props.priceFactor} />
        </View>
      </View>
    );
  }
}

export default PlatesDashboardContent;

switch(window.height) {
    case 480: // iPhone 4s
        introTimeFontSize = 18;
        sizeCardHeight = 360;
        break;
    default:
      introTimeFontSize =null;
        break;
}

let styles = StyleSheet.create({
  imageFooter: {
    flex: 4,
    marginHorizontal: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  footerTop: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  minutesAway: {
    flex: 0,
    flexDirection: 'row'
  },
  iconWalker: {
    height: 18,
    width: 10,
    flex: 0,
    marginRight: 5
  },
  footerBottom: {
    flex: 1,
    width: window.width - 60,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  border: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: '#DEE5F5',
  },
  plate: {
    marginBottom: 5,
  },
  plateName: {
    fontSize: 28 * window.height/667,
    lineHeight: 32,
    fontFamily: globals.fontDisplayRegular,
    color: globals.darkText
  },
  plateNameLarge: {
    fontSize: 32 * window.height/667,
    lineHeight: 35,
    marginTop: 5,
    marginBottom: 7,
    fontFamily: globals.fontDisplayLight,
    color: globals.darkText
  },
  plateNameSmall: {
    fontSize: 20,
    lineHeight: 25,
    marginBottom: 5,
    fontFamily: globals.fontDisplayLight,
    color: globals.darkText
  },
  introTime: {
    fontSize: introTimeFontSize || 16 * window.height/667,
    marginBottom: 4,
    fontFamily: globals.fontTextRegular,
    color: globals.mediumText,
    // alignSelf: 'flex-end'
  },
  minutes: {
    color: '#FEBB27',
    fontWeight: 'bold'
  },
});
