import React from 'react-native';
import Dimensions from 'Dimensions';
import Colors from '../../../globalVariables';
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
          <Text style={styles.introTime}>Just
            <Text style={styles.minutes}> {milesToMins(this.props.plate.distance)} minutes </Text> away
          </Text>
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

let styles = StyleSheet.create({
  imageFooter: {
    flex: 3,
    marginHorizontal: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  footerTop: {
    flex: 3,
    justifyContent: 'space-around'
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
    borderBottomColor: Colors.lightText,
  },
  plate: {
    marginBottom: 5,
  },
  plateName: {
    flex: 1,
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'SanFranciscoDisplay-Regular',
    color: Colors.darkText
  },
  plateNameLarge: {
    fontSize: 32,
    lineHeight: 35,
    marginTop: 5,
    marginBottom: 7,
    fontFamily: 'SanFranciscoDisplay-Light',
    color: Colors.darkText
  },
  plateNameSmall: {
    fontSize: 20,
    lineHeight: 25,
    marginBottom: 5,
    fontFamily: 'SanFranciscoDisplay-Light',
    color: Colors.darkText
  },
  introTime: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'SanFranciscoText-Regular',
    color: Colors.mediumText,
    alignSelf: 'flex-start'
  },
  minutes: {
    color: '#FEBB27',
    fontWeight: 'bold'
  },
});
