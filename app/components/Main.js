'use strict';

import React from 'react-native';
import NavigationBar from 'react-native-navbar';
import FBSDKLogin from 'react-native-fbsdklogin';
import { Icon, } from 'react-native-icons';
import SideMenu from 'react-native-side-menu';

import InitialLoadingOverlay from './Initial-Loading-Overlay';
import PlatesDashBoard from './plate-screen/Plates-Dashboard';
import PlatesFooter from './plate-screen/Plates-Footer';
import MapDashBoard from './map/Map-Dashboard';
import Login from './login/Login';
import SettingsDashboard from './Settings-Dashboard';
import Menu from './side-menu/Menu';

import firebase_api from '../utils/firebase-api';
import helpers from '../utils/helpers';
import Colors from '../../globalVariables';
import { filterByDistance, filterByCategory, filterByPrice, formatCategory } from '../utils/filters';

var platesTimer;
var allPlates = [];
var filteredPlates = [];
var noFilteredPlatesResults = false;

let {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  AlertIOS,
} = React;

let {
  FBSDKLoginManager,
} = FBSDKLogin;

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'Finding your location...',
      watchID: null,
      touchToClose: props.route.props.isOpen,
      currFilteredIndex: 0,
      currPlateIndex: 0,
      categoryFilter: [],
      plate: null,
      radius: null,
      prevRadius: null,
      dollar: null,
      filterActivated: false,
      defaultRadius: 5,
      maxRadius: 10,
      userInfo: 'not null',
      prevCategory: null,
    };
  }

  prepareToBuildPlatesArray(props) {
    this.setState({status: 'Finding nearby restaurants...'});
    var {latitude, longitude} = props.initialPosition.coords;
    this.buildPlatesArray({latitude, longitude}, this.state.maxRadius);
    this._getAddress(latitude, longitude);
  }

  buildPlatesArray(userLocation, radius) {
    var initialBuild = true;
    var shuffleStartIndex = 0;
    var firstPlatesFound = false;

    firebase_api.getNearbyRestaurants(userLocation, radius, (restaurantId, locationTuple, distance) => {

      firebase_api.getPlatesByRestaurantId(restaurantId)
      .then((plates) => {
        if(!plates.length) {
          throw new Error(`no plates for ${restaurantId}`);
        }

        // we find restaurants so fast,
        // so wait at least 1sec before displaying next status
        if(!firstPlatesFound) {
          setTimeout(() => {
            this.setState({
              status: 'Fetching yummy dishes...'
            });
          }, 1000);

          firstPlatesFound = true;
        }

        return plates;
      })
      .then((plates) => {
        return [plates, firebase_api.getRestaurantById(restaurantId)];
      })
      .spread((plates, restaurantInfo) => {
        var restaurant = helpers.formatIdString(restaurantId);
        var location = {
          lat: locationTuple[0],
          lng: locationTuple[1]
        };

        var morePlates = plates.reduce((plates, plate) => {
          var imageKeys = [];
          var prop = '';

          if( !plate['images-lo'] || !plate['images'] ) {
            return plates;
          }

          if( plate['images-lo'] ) {
            imageKeys = Object.keys(plate['images-lo']);
            prop = 'images-lo';
          } else {
            imageKeys = Object.keys(plate['images']);
            prop = 'images';
          }

          var numOfImgs = imageKeys.length;
          var randomImageIndex = Math.floor(Math.random() * numOfImgs);
          var randomImageKey = imageKeys[randomImageIndex];
          var img_url = plate[prop][randomImageKey];

          var name = helpers.formatIdString(plate.key);
          var category = formatCategory(restaurantInfo.categories);
          var priceFactor = !restaurantInfo.price ? '$' : restaurantInfo.price;

          var platesObj = {
            name,
            category,
            restaurant,
            location,
            img_url,
            priceFactor,
            distance
          };

          firebase_api.getUserByImageId(randomImageKey)
          .then(function(user) {
            platesObj.user = user;
          })
          .catch(function(err) {
            // console.warn(err);
          });

          plates.push(platesObj);

          return plates;
        }, []);

        if(!morePlates.length) {
          return;
        }

        allPlates = helpers.shuffle(allPlates.concat(morePlates), this.state.currPlateIndex + shuffleStartIndex);

        clearTimeout(platesTimer);

        // after 500ms without plates being added,
        // assign the first plate in the array as the current plate.
        // if subsequent calls are made and more plates are added,
        // start shuffling 5 indexes up from the current plate index
        if(initialBuild) {
          platesTimer = setTimeout(() => {
            this.setState({
              plate: allPlates[0],
              priceFactor: allPlates[0].priceFactor
            });

            initialBuild = false;
            shuffleStartIndex = 5;
          }, 500);
        }

      })
      .catch((err) => {
        console.warn(err);
      });
    });
  }

  _getAddress(lat, lng) {
    fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        searchAddress: responseData.results[0].formatted_address.slice(0, 30) + '...'
      });
    });
  }

  componentWillReceiveProps(newProps) {
    // already started building the plates array
    if(this.props.initialPosition || !newProps.initialPosition) {
      return;
    }

    this.prepareToBuildPlatesArray(newProps);
  }

  handleSelection() {
    this.props.navigator.push({
      component: MapDashBoard,
      props: {
        image: this.state.plate,
        userPosition: this.props.lastPosition
      },
      navigationBar: (
        <NavigationBar
          title="Directions" />
      )
    });
  }

  handleRejection() {
    var platesToUse;
    var newPlateIndex;

    if(this.state.filterActivated) {
      platesToUse = filteredPlates;
      newPlateIndex = this.state.currFilteredIndex + 1;
    } else {
      platesToUse = allPlates;
      newPlateIndex = this.state.currPlateIndex + 1;
    }

    newPlateIndex = newPlateIndex >= platesToUse.length ? 0 : newPlateIndex;

    if (this.state.filterActivated) {
      this.setState({currFilteredIndex: newPlateIndex});
    } else {
      this.setState({currPlateIndex: newPlateIndex});
    }

    this.setState({
      plate: platesToUse[newPlateIndex],
      priceFactor: platesToUse[newPlateIndex].priceFactor
    });
  }

  handleFilterChange() {
    var platesToUse;
    var index;

    if (this.state.filterActivated) {
      platesToUse = filteredPlates;
      index = this.state.currFilteredIndex;
    } else {
      platesToUse = allPlates;
      index = this.state.currPlateIndex;
    }

    this.setState({
      plate: platesToUse[index],
      priceFactor: platesToUse[index].priceFactor
    });
  }

  _onPressLogOut() {
   FBSDKLoginManager.logOut();
   this.props.route.props.responseToken();
   this.props.navigator.popToTop();
  }

  handleSettingsConfig(key, filter) {
    // Get the queries to make on radius, dollar and/or category
    // 'categories' --> ['Burger', 'French', ...]
    // 'radius'     --> 24 miles
    // 'dollar'     --> 0/1/2   0=$, 1=$$, 2=$$$
    console.log('handleSettings', key, filter);
    switch(key) {
      case 'categories':
        this.setState({categoryFilter: filter});
        break;

      case 'dollar':
        this.setState({dollar: filter});
        break;

      case 'keepRadius':
        this.setState({defaultRadius: filter});
      default:
        break;
    }
  }

  doneButtonSettingsPressed() {
    var filterActivated = false;

     // no changes at all
    if ( this.state.defaultRadius === this.state.maxRadius &&
          this.state.dollar === null &&
          this.state.categoryFilter.length === 0 && !noFilteredPlatesResults ) {

      filterActivated = false;

    // no new changes but filter has been activated
    } else if (
      this.state.defaultRadius === this.state.prevRadius &&
      this.state.dollar === this.state.prevDollar &&
      this.state.categoryFilter === this.state.prevCategory && !noFilteredPlatesResults ) {

      filterActivated = true;

    } else {

      filterActivated = true;
      var tempFilteredPlates = allPlates.slice();

      if ( this.state.defaultRadius > 0 ){
        tempFilteredPlates = filterByDistance(tempFilteredPlates, this.state.defaultRadius);
      }

      if ( this.state.dollar !== null && this.state.dollar >= 0 ) {
        tempFilteredPlates = filterByPrice(tempFilteredPlates, this.state.dollar);
      }

      if ( this.state.categoryFilter.length > 0 ) {
        tempFilteredPlates = filterByCategory(tempFilteredPlates, this.state.categoryFilter );
      }

      this.setState({currFilteredIndex: 0});

      if ( tempFilteredPlates.length === 0 ) {
        AlertIOS.alert('No plates found. Please, try different settings.');

        noFilteredPlatesResults = true;
        filterActivated = false;
      } else {
        noFilteredPlatesResults = false;
      }

      if(!noFilteredPlatesResults) {
        filteredPlates = tempFilteredPlates;
      }
    }

    !noFilteredPlatesResults && this.props.navigator.pop();

    this.setState({filterActivated}, this.handleFilterChange);
  }

  componentWillMount() {
    // don't have position yet, can't start building plates array
    if(!this.props.initialPosition) {
      return;
    }

    this.prepareToBuildPlatesArray(this.props);
  }

  _onPressSettings() {
    this.setState({
      prevRadius: this.state.defaultRadius,
      prevDollar: this.state.dollar,
      prevCategory: this.state.categoryFilter
    });

    this.props.navigator.push({
      component: SettingsDashboard,
      props: {
        handleSettingsConfig: this.handleSettingsConfig.bind(this),
        radiusDefault: this.state.defaultRadius,
      },
      navigationBar: (
        <NavigationBar
          title="Discover Settings"
          onNext={this.doneButtonSettingsPressed.bind(this)}
          nextTitle="Done"/>
      )
    });
  }

  handleChange(isOpen) {
    if (isOpen) {
      return;
    }
    this.setState({
      touchToClose: false
    });
  }

  render() {
    if (!this.state.plate) {
      return (
        <InitialLoadingOverlay
          isVisible={true}
          status={this.state.status} />
      );
    }

    return (
      <View style={styles.container}>
        <PlatesDashBoard
          plate={this.state.plate}
          priceFactor={this.state.priceFactor}
          lastPosition={this.props.lastPosition}
          currPlateIndex={this.state.filterActivated ? this.state.currFilteredIndex : this.state.currPlateIndex}
          onSelection={this.handleSelection.bind(this)}
          onRejection={this.handleRejection.bind(this)} />
        <PlatesFooter address={this.state.searchAddress} onPressSettings={this._onPressSettings.bind(this)}/>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  }
});

module.exports = Main;
