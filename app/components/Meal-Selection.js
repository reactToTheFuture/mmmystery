import React from 'react-native';
import AddMealOverlay from './AddMeal-Overlay';

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

class MealSelection extends React.Component {

  constructor(props) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    super(props);
    this.state = {
      loading: true,
      meals: ds.cloneWithRows([]),
      noPlates: false,
      isOverlayShowing: false,
      searchText: ''
    };
  }

  componentDidMount() {
    firebase_api.getPlatesByRestaurantId(this.props.route.props.restaurant.id)
    .then((plates) => {

      if(!plates.length) {
        this.setState({
          loading: false,
          noPlates: true
        });
        return;
      }

      this.setState({
        loading: false,
        meals: this.state.meals.cloneWithRows(plates)
      })
    });
  }

  _renderMeal(meal) {
    return (
      <TouchableHighlight
        underlayColor={'orange'}
        style={styles.meal}
        onPress={this.selectMeal.bind(this, meal.key)}>
        <Text>{helpers.formatIdString(meal.key)}</Text>
      </TouchableHighlight>
    );
  }

  handleOverlayClose() {
    this.setState({
      isOverlayShowing: false
    });
  }

  handleOverlayOpen() {
    this.setState({
      isOverlayShowing: true
    });
  }

  selectMeal(meal) {
    console.log(meal);
  }

  render() {

    var noPlatesText = '';
    var addPlatesText = "Don't see what you're looking for?";

    if(this.state.noPlates) {
      noPlatesText = 'Oh no! There are no meals.';
      addPlatesText = '';
    }

    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
        <Text>{noPlatesText}</Text>
        <ListView
          dataSource={this.state.meals}
          renderRow={this._renderMeal.bind(this)}>
        </ListView>
        <Text>{addPlatesText}</Text>
        <TouchableHighlight
          underlayColor={'orange'}
          style={styles.button}
          onPress={this.handleOverlayOpen.bind(this)}>
          <Text>Add a new meal</Text>
        </TouchableHighlight>
        <AddMealOverlay
          isVisible={this.state.isOverlayShowing}
          onAddMeal={this.selectMeal.bind(this)}
          onOverlayClose={this.handleOverlayClose.bind(this)}/>
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
  button: {

  },
  meal: {
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});

module.exports = MealSelection;