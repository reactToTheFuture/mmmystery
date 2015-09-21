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
  View,
  Image
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
      searchText: '',
      status: null
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
      isLoading: true,
      status: 'Uploading image...'
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

        this.setState({
          status: 'Saving plate info...'
        });

        firebase_api.updatePlate(restaurantID, plateID, imageId, imageUrl)
        .then(() => {
          return firebase_api.addImageData(imageId, imageUrl, this.props.user.id, restaurantID, plateID);
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
        underlayColor={globals.primaryLight}
        onPress={this.handleOverlayOpen.bind(this)}
        style={styles.newMealButton}>
        <Text style={[styles.centerText, styles.newMealButtonText]}>Sweet, let's add it!</Text>
      </TouchableHighlight>
    );

    var noPlatesView = (
      <View style={styles.noPlatesContainer}>
        <View style={styles.noPlatesContainer}>
          <View style={styles.noPlatesIconContainer}>
            <Image
              style={styles.noPlatesIcon}
              source={require('image!icon-first-meal')}
            />
          </View>
          <View style={styles.noPlatesText}>
            <Text style={[styles.centerText, styles.headline, styles.noPlatesSubheader]}>You're the first Mmmystery at</Text>
            <Text style={[styles.centerText, styles.headline, styles.noPlatesHeader]}>{this.props.route.props.restaurant.name}</Text>
            <Text style={[styles.centerText, styles.headline, styles.subheadline]}>It would be so wonderful if you would take a moment to add your meal</Text>
          </View>
        </View>
        {addMealButton}
      </View>
    );

    var status = '';

    if(!this.state.noPlates) {
      status = !this.state.status ? 'Click on a meal to upload your image!' : this.state.status;
    }

    var platesView = (
      <View style={styles.platesContainer}>
        <Text style={styles.restaurantTitle}>{this.props.route.props.restaurant.name.toUpperCase()}</Text>
        <Text style={[styles.centerText, styles.headline, styles.status]}>{status}</Text>
        <View style={styles.restaurantsContainer}>
          <ListView
            style={styles.restaurantsList}
            dataSource={this.state.meals}
            renderRow={this._renderMeal.bind(this)}>
          </ListView>
          <View style={styles.textContainer}>
            <Text style={[styles.centerText, styles.headline, styles.callout]}>Don't see what you're looking for?</Text>
            {addMealButton}
          </View>
        </View>
      </View>
    );

    return (
      <View style={styles.container}>
        { this.state.noPlates ? {noPlatesView} : {platesView} }
        <ActivityIndicatorIOS
          animating={this.state.isLoading}
          style={styles.loadingIcon}
          size="large"
        />
        <AddMealOverlay
          status={this.state.status}
          isVisible={this.state.isAddingMeal}
          onAddMeal={this.selectMeal.bind(this)}
          onOverlayClose={this.handleOverlayClose.bind(this)} />
        <MealSubmittedOverlay
          isVisible={this.state.isMealSubmitted}
          onUploadAnother={this.uploadAnother.bind(this)}
          onReturnHome={this.returnHome.bind(this)} />
      </View>
    );
  }
};

export default MealSelection;

var styles = StyleSheet.create({
  restaurantTitle: {
    padding: 15,
    backgroundColor: globals.secondary,
    fontFamily: globals.fontTextSemibold,
    fontSize: 16,
    color: globals.darkText,
  },
  loadingIcon: {
    position: 'absolute',
    top: (window.height/2 - 18),
    left: (window.width/2 - 18),
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    fontFamily: globals.fontTextSemibold,
    color: globals.darkText,
  },
  subheadline: {
    fontSize: 17,
    lineHeight: 23,
    paddingHorizontal: 15,
    color: globals.lightText,
    fontFamily: globals.fontTextRegular,
  },
  restaurantsContainer: {
    flex: 1,
  },
  restaurantsList: {
    flex: 3,
  },
  button: {
    fontSize: 18,
    fontFamily: globals.fontTextSemibold,
    color: globals.primaryDark,
  },
  status: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    color: globals.darkText,
  },
  callout: {
    marginBottom: 10,
    fontSize: 16,
  },
  noPlatesSubheader: {
    fontSize: 20,
    color: globals.lightText,
    fontFamily: globals.fontDisplayRegular,
    marginBottom: 5,
  },
  noPlatesHeader: {
    fontSize: 28,
    fontFamily: globals.fontDisplayRegular,
    marginBottom: 30,
  },
  meal: {
    paddingTop: 15,
    paddingRight: 5,
    paddingBottom: 15,
    paddingLeft: 5,
    borderBottomColor: globals.mediumText,
    borderBottomWidth: 1,
  },
  noPlatesIconContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  noPlatesIcon: {
    height: 180,
    width: 84,
    flex: 0,
  },
  noPlatesText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  noPlatesContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  platesContainer: {
    flex: 1,
  },
  newMealButton: {
    width: window.width,
    height: 60,
    flex: 0,
    backgroundColor: globals.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  newMealButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: globals.fontTextSemibold,
  },
});
