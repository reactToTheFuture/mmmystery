import React from 'react-native';

import MealSelection from './Meal-Selection';
import NavigationBar from 'react-native-navbar';

import firebase_api from '../utils/firebase-api';
import yelp_api from '../utils/yelp-api';
import _ from 'underscore';
import helpers from '../utils/helpers';

var {
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Text,
  TextInput,
  ListView,
  View
} = React;

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
    firebase_api.getNearbyRestaurants(this.props.lastPosition.coords,60, (id, loc, dist) => {
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
        underlayColor={'orange'}
        style={styles.restaurant}
        onPress={this.selectRestaurant.bind(this, restaurant)}>
        <Text>{restaurant.name} | {restaurant.distance} miles away</Text>
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
          restaurant.distance = helpers.metersToMiles(restaurant.distance);
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

      if(!found) {
        firebase_api.addRestaurant(restaurant);
      }
      
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
        <TextInput
          style={styles.textInput}
          onChangeText={this.handleTextInput.bind(this)}
          placeholder="Search for a restaurant"
          placeholderTextColor="grey"
          value={this.state.searchText}
        />
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
        <ListView
          dataSource={this.state.restaurants}
          renderRow={this._renderRestaurant.bind(this)}>
        </ListView>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'column',
    flex: 2
  },
  restaurant: {
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});

module.exports = RestaurantSelection;