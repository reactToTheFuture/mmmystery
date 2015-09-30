'use strict';

import React from 'react-native';
import NavigationBar from 'react-native-navbar';
import FBSDKLogin from 'react-native-fbsdklogin';
import { Icon, } from 'react-native-icons';

import InitialLoadingOverlay from '../initial-loading/Initial-Loading-Overlay';
import PlatesDashBoard from '../plate-screen/Plates-Dashboard';
import PlatesFooter from '../plate-screen/Plates-Footer';
import SettingsDashboard from '../plate-screen/Settings-Dashboard';
import MapDashBoard from '../map/Map-Dashboard';
import Login from '../login/Login';
import SideMenu from '../side-menu/Side-Menu';

import firebase_api from '../../utils/firebase-api';
import helpers from '../../utils/helpers';

import { filterByDistance, filterByCategory, filterByPrice, formatCategory } from '../../utils/filters';

var platesTimer;
var allPlates = [];
var filteredPlates = [];
var defaultRadius = 10;
var noFilteredPlatesResults = false;

let {
  View,
  StyleSheet,
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
      status: 1,
      watchID: null,
      currFilteredIndex: 0,
      currPlateIndex: 0,
      categoryFilter: [],
      plate: null,
      radius: null,
      prevRadius: null,
      dollar: [false,false,false],
      filterActivated: false,
      maxRadius: 10,
      prevCategory: null,
      touchToClose: false,
      resetSettings: false,
      defaultRadius,
    };
  }

  prepareToBuildPlatesArray(props) {
    this.setState({status: 2});
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
          this.setState({
            status: 3
          });
          setTimeout(() => {
          }, 3000);
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

        distance = helpers.kilometersToMiles(distance);

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
          var img_key = imageKeys[randomImageIndex];
          var img_url = plate[prop][img_key];

          var name = helpers.formatIdString(plate.key);
          var category = formatCategory(restaurantInfo.categories);
          var priceFactor = !restaurantInfo.price ? '$' : restaurantInfo.price;

          var platesObj = {
            name,
            category,
            restaurant,
            location,
            img_key,
            img_url,
            priceFactor,
            distance
          };

          firebase_api.getUserByImageId(img_key)
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
          }, 2500);
        }

      })
      .catch((err) => {
        // console.warn(err);
      });
    });
  }

  _getAddress(lat, lng) {
    fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`)
    .then((response) => response.json())
    .then((responseData) => {

      var addressData = responseData.results[0].formatted_address.split(',');
      var searchAddress = `${addressData[0]}, ${addressData[1]}`.substr(0, 35);

      if( searchAddress.length === 35 ) {
        searchAddress += '...';
      }

      this.setState({
        searchAddress
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
    firebase_api.addLikeToImage(this.state.plate.img_key, this.props.user.id);

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

  handleSettingsConfig(key, filter) {
    // Get the queries to make on radius, dollar and/or category
    // 'categories' --> ['Burger', 'French', ...]
    // 'radius'     --> 24 miles
    // 'dollar'     --> 0/1/2   0=$, 1=$$, 2=$$$
    switch(key) {
      case 'categories':
        this.setState({categoryFilter: filter});
        break;

      case 'dollar':
        this.setState({dollar: filter}); // dollar is []
        break;

      case 'keepRadius':
        this.setState({defaultRadius: filter});
      default:
        break;
    }
  }

  onPressResetSettings() {

    this.props.navigator.pop();
    this.setState({
      resetSettings: true,
      dollar: [false,false,false],
      defaultRadius: defaultRadius,
      categoryFilter: [],
    });
    noFilteredPlatesResults = false;
  }

  doneButtonSettingsPressed() {
    this.setState({resetSettings: false});
    let filterActivated = false;
    if (  this.state.defaultRadius === defaultRadius &&
          this.state.dollar.indexOf(true) === [false,false,false].indexOf(true) &&
          this.state.categoryFilter.length === 0 && !noFilteredPlatesResults ) {
      filterActivated = false;
    // no new changes but filter has been activated
    } else if (
      this.state.defaultRadius === this.state.prevRadius &&
      this.state.dollar        === this.state.prevDollar &&
      this.state.categoryFilter === this.state.prevCategory && !noFilteredPlatesResults ) {
      filterActivated = true;
    } else {
      filterActivated = true;
      let tempFilteredPlates = allPlates.slice();
      if ( this.state.defaultRadius > 0 ){
        tempFilteredPlates = filterByDistance(tempFilteredPlates, this.state.defaultRadius);
      }
      if ( this.state.dollar.indexOf(true)  !== -1 ) {
        tempFilteredPlates = filterByPrice(tempFilteredPlates, this.state.dollar);
      }
      if ( this.state.categoryFilter.length > 0 ) {
        tempFilteredPlates = filterByCategory(tempFilteredPlates, this.state.categoryFilter );
      }
      this.setState({currFilteredIndex: 0});

      if ( tempFilteredPlates.length === 0 ) {
        AlertIOS.alert(
          'Please, try again!',
          'No plates found with this selection.',
          [
            {text: 'All plates', onPress: this.onPressResetSettings.bind(this)},
            {text: 'OK'},
          ]
        )
        noFilteredPlatesResults = true;
        filterActivated = false;
      } else {
        noFilteredPlatesResults = false;
      }

      if(!noFilteredPlatesResults) {
        filteredPlates = tempFilteredPlates;
      }

    }

    this.setState({filterActivated}, this.handleFilterChange);

    !noFilteredPlatesResults && this.props.navigator.pop();
  }

  handleFilterChange() {
    let platesToUse;
    let index;

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
        resetSettings: this.state.resetSettings,
      },
      navigationBar: (
        <NavigationBar
          onPrev={this.doneButtonSettingsPressed.bind(this)}
          prevTitle="Done"
          title="Discover Settings"/>
      )
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
        <PlatesFooter address={this.state.searchAddress} onPressSettings={this._onPressSettings.bind(this)} />
        <SideMenu onLogOut={this.props.route.props.onLogOut} isVisible={this.props.menuOpen} onMenuToggle={this.props.route.props.onMenuToggle} navigator={this.props.navigator} user={this.props.user} />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#FFBB00',
  }
});
export default Main;

