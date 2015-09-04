var React = require('react-native');
var firebase_api = require('../utils/firebase-api');
var _ = require('underscore');
var helpers = require('../utils/helpers');

var {
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Text,
  View,
} = React;

class RestaurantSelection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      restaurants: [],
      restaurantKeys: {}
    };
  }

  componentDidMount() {
    firebase_api.getNearbyRestaurants(this.props.lastPosition.coords,60, (key, loc, dist) => {
      var restaurants = this.state.restaurantKeys;

      if( Object.keys(restaurants).length < 25 ) {
        restaurants[key] = {
          dist: dist.toFixed(2),
          name: helpers.formatIdString(key)
        };

        return;
      }
      
      this.renderRestaurants();
    });
  }

  renderRestaurants() {
    this.setState({
      loading: false,
      restaurants: _.sortBy(this.state.restaurantKeys, 'dist')
    });
  }

  selectRestaurant(restaurant) {
    console.log(restaurant);
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
        <View style={styles.restaurants}>
          {this.state.restaurants.map((restaurant, i) => {
            return (
              <TouchableHighlight
                key={i}
                underlayColor={'orange'}
                style={styles.button}
                onPress={this.selectRestaurant.bind(this, restaurant)}>
                <Text>{restaurant.name} | {restaurant.dist} miles away</Text>
              </TouchableHighlight>
            );
          })}
        </View>
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
  restaurants: {

  }
});

module.exports = RestaurantSelection;