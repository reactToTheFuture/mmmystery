var React = require('react-native');
var firebase_api = require('../utils/firebase-api');
var yelp_api = require('../utils/yelp-api');
var _ = require('underscore');
var helpers = require('../utils/helpers');

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
    firebase_api.getNearbyRestaurants(this.props.lastPosition.coords,60, (key, loc, dist) => {
      var restaurants = this.state.restaurantKeys;

      if( Object.keys(restaurants).length < 40 ) {
        restaurants[key] = {
          key,
          dist: dist.toFixed(2),
          name: helpers.formatIdString(key)
        };

        return;
      }
      
      this.renderRestaurants();
    });
  }

  _renderRow(restaurant) {
    return (
      <TouchableHighlight
        underlayColor={'orange'}
        style={styles.restaurant}
        onPress={this.selectRestaurant.bind(this, restaurant)}>
        <Text>{restaurant.name} | {restaurant.dist} miles away</Text>
      </TouchableHighlight>
    );
  }

  renderRestaurants() {
    this.setState({
      loading: false,
      restaurants: this.state.restaurants.cloneWithRows(_.sortBy(this.state.restaurantKeys, 'dist'))
    });
  }

  handleTextInput(searchText) {

    clearTimeout(this.state.searchingTimer);

    var searchingTimer = setTimeout(() => {

      yelp_api.getRestaurantsByTerms(searchText,this.props.lastPosition.coords)
      .then((data) => console.log(data));

    },1000);
    
    this.setState({
      searchText,
      searchingTimer
    });
  }

  selectRestaurant(restaurant) {
    console.log(restaurant);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={this.handleTextInput.bind(this)}
          value={this.state.searchText}
        />
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
        <ListView
          dataSource={this.state.restaurants}
          renderRow={this._renderRow.bind(this)}>
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