import React from 'react-native';
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

  handleTextInput(searchText) {

  }

  selectMeal(meal) {
    console.log(meal);
  }

  render() {

    var text = this.state.noPlates ? 'Oh no! There are no meals.' : '';

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={this.handleTextInput.bind(this)}
          placeholder="Search for your meal"
          placeholderTextColor="grey"
          value={this.state.searchText}
        />
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
        <Text>{text}</Text>
        <ListView
          dataSource={this.state.meals}
          renderRow={this._renderMeal.bind(this)}>
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
  meal: {
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});

module.exports = MealSelection;