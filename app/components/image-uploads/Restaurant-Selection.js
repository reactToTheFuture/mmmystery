import React from 'react-native';
import NavigationBar from 'react-native-navbar';
import _ from 'underscore';
import Dimensions from 'Dimensions';
import { Icon } from 'react-native-icons';

import MealSelection from './Meal-Selection';

import firebase_api from '../../utils/firebase-api';
import yelp_api from '../../utils/yelp-api';
import helpers from '../../utils/helpers';
import globals from '../../../globalVariables';

var {
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Text,
  TextInput,
  ListView,
  View
} = React;

var window = Dimensions.get('window');

class RestaurantSelection extends React.Component {

  constructor(props) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    super(props);
    this.state = {
      searchingTimer: null,
      loading: true,
      restaurants: ds.cloneWithRows([]),
      searchText: '',
      restaurantKeys: {}
    };
  }

  componentDidMount() {
    firebase_api.getNearbyRestaurants(this.props.lastPosition.coords, 10, (id, loc, dist) => {
      var restaurants = this.state.restaurantKeys;

      if( Object.keys(restaurants).length < 20 ) {
        restaurants[id] = {
          id,
          distance: dist.toFixed(2),
          name: helpers.formatIdString(id)
        };

        return;
      }
      
      this.setState({
        loading: false,
        restaurants: this.state.restaurants.cloneWithRows(_.sortBy(this.state.restaurantKeys, 'distance'))
      });
    });
  }

  _renderRestaurant(restaurant) {
    return (
      <TouchableHighlight
        underlayColor={globals.primary}
        style={styles.restaurant}
        onPress={this.selectRestaurant.bind(this, restaurant)}>
        <View>
          <Text style={styles.headline}>{restaurant.name}</Text>
          <Text style={styles.subheadline}>{restaurant.distance} miles</Text>
        </View>
      </TouchableHighlight>
    );
  }

  handleTextInput(searchText) {

    this.setState({
      loading: true
    });

    clearTimeout(this.state.searchingTimer);

    var searchingTimer = setTimeout(() => {

      yelp_api.getRestaurantsByTerms(searchText,this.props.lastPosition.coords)
      .then((data) => {

        var restaurants = data.businesses.map(function(restaurant) {
          restaurant.distance = helpers.metersToMiles(restaurant.distance).toFixed(2);
          return restaurant;
        });

        this.setState({
          loading: false,
          restaurants: this.state.restaurants.cloneWithRows(restaurants)
        });

      });

    },1000);
    
    this.setState({
      searchText,
      searchingTimer
    });
  }

  goToMealSelection(props) {
    this.props.navigator.push({
      component: MealSelection,
      props,
      navigationBar: (
        <NavigationBar
          title="Find your meal" />
      )
    });
  }

  selectRestaurant(restaurant) {
    firebase_api.getRestaurantById(restaurant.id)
    .then((found) => {
      if(found) {
        return;
      }
      firebase_api.addRestaurant(restaurant);
    })
    .catch(function(err) {
      console.warn(err);
    });

    var props = {
      restaurant,
      image: this.props.route.props.image
    };

    this.goToMealSelection(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Icon
            name='ion|ios-search-strong'
            size={30}
            color={globals.lightText}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={this.handleTextInput.bind(this)}
            placeholder="Search for a restaurant"
            placeholderTextColor="grey"
            value={this.state.searchText}
          />
        </View>
        <ListView
          dataSource={this.state.restaurants}
          renderRow={this._renderRestaurant.bind(this)}>
        </ListView>
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={styles.loadingIcon}
          size="large"
        />
      </View>
    );
  }
};

export default RestaurantSelection;

var styles = StyleSheet.create({
  searchIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  container: {
    flex: 1,
    position: 'relative',
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headline: {
    marginBottom: 5,
    fontSize: 16,
    fontFamily: globals.fontTextSemibold,
    color: globals.darkText,
  },
  subheadline: {
    fontFamily: globals.fontTextRegular,
    fontSize: 16,
    color: globals.lightText,
  },
  restaurant: {
    paddingTop: 10,
    paddingRight: 5,
    paddingBottom: 10,
    paddingLeft: 5,
    borderBottomColor: globals.mediumText,
    borderBottomWidth: 1,
  },
  loadingIcon: {
    position: 'absolute',
    top: (window.height/2 - 36),
    left: (window.width/2 - 36),
    backgroundColor: "transparent",
  },
  textInput: {
    flex: 1,
    height: 50,
    paddingTop: 15,
    paddingRight: 10,
    paddingBottom: 15,
    paddingLeft: 10,
    borderColor: globals.lightText,
    fontFamily: globals.fontTextRegular,
    borderWidth: 1,
  }
});
