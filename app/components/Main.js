'use strict';

import React from 'react-native';
import InitialLoadingOverlay from './Initial-Loading-Overlay';
import PlatesDashBoard from './plate-screen/Plates-Dashboard';
import PlatesFooter from './plate-screen/Plates-Footer';
import MapDashBoard from './map/Map-Dashboard';
import NavigationBar from 'react-native-navbar';
import firebase_api from '../utils/firebase-api';
import helpers from '../utils/helpers';
import FBSDKLogin from 'react-native-fbsdklogin';
import Login from './Login';
import Colors from '../../globalVariables';
import SettingsDashboard from './Settings-Dashboard';
import { Icon, } from 'react-native-icons';
import SideMenu from 'react-native-side-menu';
import Menu from './side-menu/Menu';
var emptySettings=false;

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
      currPlateIndex: -1,
      plates: [],
      goSettings: false,
      categoryFilter: [],
      radius: null,
      prevRadius: null,
      dollar: null,
      filterActivated: false,
      defaultRadius: 5,
      maxRadius: 10,
      userInfo: 'not null',
      prevCategory: null,
    };

    if(props.initialPosition) {
      this.state.status = 'Finding nearby restaurants...';

      var {latitude, longitude} = props.initialPosition.coords;
      this.buildPlatesArray({latitude, longitude}, this.state.maxRadius);
      this._getAddress(latitude, longitude);
    }
  }

  buildPlatesArray(userLocation, radius) {
    console.log('new search on radius:', radius);
    this.setState({
      status: 'Fetching yummy dishes...'
    });

    firebase_api.getNearbyRestaurants(userLocation, radius, (restaurantId, locationTuple, distance) => {
      firebase_api.getPlatesByRestaurantId(restaurantId)
      .then((plates) => {
        if(!plates.length) {
          throw new Error(`no plates for ${restaurantId}`);
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
          var category = helpers.formatCategory(restaurantInfo.categories);
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

        var shuffleIndexIncrement = 2;
        var currPlateIndex = this.state.currPlateIndex;

        // initally, shuffle entire array of images
        // otherwise, start shuffling 2 indexes up from current plate index
        if( currPlateIndex === -1 ) {
          shuffleIndexIncrement = 1;
          currPlateIndex = 0;
        }

        // First time: defaul radius
        this.setState({
          currPlateIndex,
          plates: helpers.shuffle(this.state.plates.concat(morePlates),this.state.currPlateIndex+shuffleIndexIncrement)
        });

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
      this.setState({
        searchAddress: responseData.results[0].formatted_address.slice(0, 30) + '...'
      });
    });
  }

  componentWillReceiveProps(newProps) {
    if(this.props.initialPosition || !newProps.initialPosition) {
      return;
    }

    this.setState({
      status: 'Finding nearby restaurants...'
    });

    var {latitude, longitude} = newProps.initialPosition.coords;
    this.buildPlatesArray({latitude, longitude}, this.state.maxRadius);
    this._getAddress(latitude, longitude);
  }

  handleSelection(image) {
    this.props.navigator.push({
      component: MapDashBoard,
      props: {
        image,
        userPosition: this.props.lastPosition
      },
      navigationBar: (
        <NavigationBar
          title="Directions" />
      )
    });
  }

  handleRejection(imageIndex) {
    if (this.state.filterActivated) {
      this.setState({indexFilter: imageIndex});
    } else {
      this.setState({currPlateIndex: imageIndex});
    }
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
    console.log('emptySettings',emptySettings);
    var filterActivated;
    emptySettings= emptySettings || false;

    // reptresent no changes
    if (this.state.defaultRadius === this.state.maxRadius &&
        this.state.dollar === -1 &&
        this.state.categoryFilter.length === 0 && !emptySettings) {
      filterActivated=false;
    } else if (this.state.defaultRadius === this.state.prevRadius &&
               this.state.dollar === this.state.prevDollar &&
               this.state.categoryFilter === this.state.prevCategory && !emptySettings) {
      filterActivated=true;
    } else {
      filterActivated=true;
      var filteredPlates = this.state.plates.slice();
      if (this.state.defaultRadius>0){
        filteredPlates = helpers.filterByDistance(filteredPlates, this.state.defaultRadius);
      }

      if (this.state.dollar !== null && this.state.dollar >= 0) {
        filteredPlates = helpers.filterByPrice(filteredPlates, this.state.dollar);
      }

      // Filtering by categories

      if (this.state.categoryFilter.length > 0) {
        filteredPlates = helpers.filterBycategory(filteredPlates, this.state.categoryFilter );
      }
      this.setState({indexFilter: 0});
      console.log('after settings', filteredPlates.length);
      if (filteredPlates.length === 0) {
        AlertIOS.alert('No plates found. Please, try different settings.');
        emptySettings=true;
        filterActivated=false;
      } else {
        emptySettings=false;
      }

      !emptySettings && this.setState({filteredPlates: filteredPlates});
    }
    !emptySettings && this.props.navigator.pop();
    this.setState({filterActivated});
  }

  componentWillMount() {
    this.setState({touchToClose: this.props.route.props.isOpen});
  }

  componentDidMount() {
    console.log('currPlateIndex',this.state.currPlateIndex);
  }

  _onPressSettings() {

    this.setState({prevRadius: this.state.defaultRadius});
    this.setState({prevDollar: this.state.dollar});
    this.setState({prevCategory: this.state.categoryFilter});
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
    this.setState({goSettings: true});
  }

  handleChange(isOpen) {
    if (!isOpen) {
      this.setState({
        touchToClose: false,
      });
    }
  }

  render() {
    if ( this.state.plates.length <= 0 ) {
      return (
        <InitialLoadingOverlay
          isVisible={this.state.goSettings ? false : !this.state.plates.length}
          status={this.state.status} />
      );
    } else {
      return (
          <View style={styles.container}>
            <PlatesDashBoard
              filterOn={this.state.filterActivated}
              plates={this.state.filterActivated ? this.state.filteredPlates : this.state.plates}
              lastPosition={this.props.lastPosition}
              currPlateIndex={this.state.filterActivated ? this.state.indexFilter : this.state.currPlateIndex}
              onSelection={this.handleSelection.bind(this)}
              onRejection={this.handleRejection.bind(this)} />
            <PlatesFooter address={this.state.searchAddress} onPressSettings={this._onPressSettings.bind(this)}/>
          </View>
      );
    }
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