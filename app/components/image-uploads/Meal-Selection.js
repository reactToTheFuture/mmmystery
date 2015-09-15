import React from 'react-native';
import _ from 'underscore';
import Dimensions from 'Dimensions';

import AddMealOverlay from './AddMeal-Overlay';
import MealSubmittedOverlay from './MealSubmitted-Overlay';

import firebase_api from '../../utils/firebase-api';
import aws_api from '../../utils/aws-api';
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

class MealSelection extends React.Component {

  constructor(props) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    super(props);
    this.state = {
      isLoading: true,
      meals: ds.cloneWithRows([]),
      isMealSubmitted: false,
      noPlates: false,
      isAddingMeal: false,
      searchText: ''
    };
  }

  componentDidMount() {
    firebase_api.getPlatesByRestaurantId(this.props.route.props.restaurant.id)
    .then((plates) => {

      if(!plates.length) {
        this.setState({
          isLoading: false,
          noPlates: true
        });
        return;
      }

      this.setState({
        isLoading: false,
        meals: this.state.meals.cloneWithRows(plates)
      })
    })
    .catch((err) => {
      console.warn(err);
    });
  }

  _renderMeal(meal) {
    return (
      <TouchableHighlight
        underlayColor={globals.primary}
        style={styles.meal}
        onPress={this.selectMeal.bind(this, meal.key)}>
        <Text style={styles.headline}>{helpers.formatIdString(meal.key)}</Text>
      </TouchableHighlight>
    );
  }

  handleOverlayClose() {
    this.setState({
      isAddingMeal: false
    });
  }

  handleOverlayOpen() {
    this.setState({
      isAddingMeal: true
    });
  }

  returnHome() {
    var MainRoute = this.props.navigator.getCurrentRoutes()[1];
    this.props.navigator.popToRoute(MainRoute);
  }

  uploadAnother() {
    var MainRoute = this.props.navigator.getCurrentRoutes()[2];
    this.props.navigator.popToRoute(MainRoute);
  }

  selectMeal(meal) {
    if(!meal) {
      return;
    }

    this.setState({
      isLoading: true
    });

    var props = this.props.route.props;
    var restaurantID = props.restaurant.id;
    var plateID = helpers.formatNameString(meal);
    var base64 = props.image;

    firebase_api.addPlate(restaurantID, plateID, '')
    .then((imageId) => {
      aws_api.uploadToS3(base64, imageId)
      .then((res) => {
        if(!res) {
          throw new Error('upload to s3 failed');
        }
        var imageUrl = res._bodyText;

        firebase_api.updatePlate(restaurantID, plateID, imageId, imageUrl)
        .then(() => {
          return firebase_api.addImageData(imageId, this.props.user.id);
        })
        .then(() => {
          this.setState({
            isLoading: false,
            isAddingMeal: false,
            isMealSubmitted: true
          });
        });

      })
      .catch((err) => {
        console.warn(err);
      });
    });
  }

  render() {

    var addMealButton = (
      <TouchableHighlight
        underlayColor={'#ffffff'}
        onPress={this.handleOverlayOpen.bind(this)}>
        <Text style={[styles.centerText, styles.button]}>Add a new meal +</Text>
      </TouchableHighlight>
    );

    var noPlatesView = (
      <View style={[styles.textContainer]}>
        <Text style={[styles.centerText, styles.headline, styles.callout]}>Oh no! There are no meals</Text>
        <Text style={[styles.centerText, styles.headline, styles.subheadline]}>Add your meal so others can find it too!</Text>
        {addMealButton}
      </View>
    );

    var platesView = (
      <View style={styles.restaurantsContainer}>
        <ListView
          style={styles.restaurantsList}
          dataSource={this.state.meals}
          renderRow={this._renderMeal.bind(this)}>
        </ListView>
        <View style={styles.outerTextContainer}>
          <View style={[styles.textContainer]}>
            <Text style={[styles.centerText, styles.headline, styles.callout]}>Don't see what you're looking for?</Text>
            {addMealButton}
          </View>
        </View>
      </View>
    );

    return (
      <View style={styles.container}>
        <Text style={styles.restaurantTitle}>{this.props.route.props.restaurant.name.toUpperCase()}</Text>

        <View style={[styles.innerContainer, this.state.noPlates && styles.noPlates]}>
          { this.state.noPlates ? noPlatesView : platesView }
        </View>

        <AddMealOverlay
          isVisible={this.state.isAddingMeal}
          onAddMeal={this.selectMeal.bind(this)}
          onOverlayClose={this.handleOverlayClose.bind(this)} />
        <MealSubmittedOverlay
          isVisible={this.state.isMealSubmitted}
          onUploadAnother={this.uploadAnother.bind(this)}
          onReturnHome={this.returnHome.bind(this)} />
        <ActivityIndicatorIOS
          animating={this.state.isLoading}
          style={styles.loadingIcon}
          size="large"
        />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  restaurantTitle: {
    padding: 15,
    backgroundColor: globals.secondary,
    fontFamily: 'SanFranciscoText-Semibold',
    fontSize: 16,
    color: globals.darkText,
  },
  loadingIcon: {
    position: 'absolute',
    top: (window.height/2 - 36),
    left: (window.width/2 - 36),
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  outerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: window.width * 0.75,
  },
  centerText: {
    textAlign: 'center',
  },
  noPlates: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontSize: 18,
    fontFamily: 'SanFranciscoText-Semibold',
    color: globals.darkText,
  },
  subheadline: {
    marginBottom: 50,
    fontSize: 16,
    color: globals.lightText,
  },
  restaurantsContainer: {
    flex: 1,
  },
  restaurantsList: {
    flex: 3,
  },
  button: {
    fontSize: 18,
    fontFamily: 'SanFranciscoText-Semibold',
    color: globals.primary,
  },
  callout: {
    fontSize: 16,
    marginBottom: 10,
  },
  meal: {
    paddingTop: 15,
    paddingRight: 5,
    paddingBottom: 15,
    paddingLeft: 5,
    borderBottomColor: globals.mediumText,
    borderBottomWidth: 1,
  },
});

module.exports = MealSelection;
