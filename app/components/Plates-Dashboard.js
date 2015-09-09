var React = require('react-native');
var clamp = require('clamp');
var Dimensions = require('Dimensions');
var window = Dimensions.get('window');
var mapbox_api = require('../utils/mapbox-api');
var prevIndex;

var {
  StyleSheet,
  PanResponder,
  ActivityIndicatorIOS,
  View,
  Text,
  Image,
  LayoutAnimation,
  Animated,
} = React;

class PlatesDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SWIPE_THRESHOLD: 120,
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
      distance: null,
      loadingImage: true,
      plate: null,
      showMinutes: false,
    };
  }

  _springBack() {
    Animated.spring(this.state.pan, {
      toValue: {x: 0, y: 0},
      friction: 10
    }).start();
  }

  _goToNextPlate() {
    let newPlateIndex = this.props.currPlateIndex + 1;
    newPlateIndex = newPlateIndex >= this.props.plates.length ? 0 : newPlateIndex;

    this.props.onRejection(newPlateIndex);

    this.setState({
      loadingImage: true,
      plate: this.props.plates[newPlateIndex]
    });
  }

  getDistance(origin, dest) {
    var newDish=false;
    var userPosition = {
      lat: origin.coords.latitude,
      lng: origin.coords.longitude
    };
    if (this.props.currPlateIndex === 0) prevIndex=this.props.currPlateIndex;
    if (this.props.currPlateIndex!== prevIndex || this.props.currPlateIndex===0) {
      prevIndex=this.props.currPlateIndex;
      newDish=true;
      this.getAsyncDirections(userPosition, dest)
      .then((distance) => {
        newDish ? this.setState({distance: distance}) : null;
      })
      .catch((err) => { console.log('Something went wrong: ' + err); });
    }
  }

  componentWillUpdate(nextProps) {
    if( !this.state.plate && nextProps.plates.length ) {
      this.setState({
        plate: nextProps.plates[0]
      });
    }
    (!!this.state.plate && !!this.props.lastPosition) ? this.getDistance(this.props.lastPosition, this.state.plate.location) : null;
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        var velocity;

        if (vx > 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        }

        // didn't swipe far enough
        if (Math.abs(this.state.pan.x._value) < this.state.SWIPE_THRESHOLD) {
          this._springBack();
          return;
        }

        // Accepted Dish
        if( this.state.pan.x._value > 0 ) {
          this.props.onSelection(this.state.plate);
          this._springBack();
          return;
        }

        this._resetState();
        this._goToNextPlate();
      }
    });
  }

  _imageLoaded() {
    this.setState({
      loadingImage: false
    });
    this._animateEntrance();
  }

  _animateEntrance() {
    Animated.spring(
      this.state.enter,
      { toValue: 1, friction: 8 }
    ).start();
  }

  _resetState() {
    this.state.pan.setValue({x: 0, y: 0});
    this.state.enter.setValue(0);
  }

  async getAsyncDirections(origin, dest) {
    var responseDirections = await (mapbox_api.getDirections(origin, dest)
      .then((data) => {
        // Human: 5000 meters --> 60 min
        return Math.round(data.routes[0].distance/5000*60);
      }));
   return responseDirections;
  }

  render() {

    let { pan, enter, } = this.state;

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]})
    let scale = enter;

    let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    let yupOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    let yupScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    let animatedYupStyles = {transform: [{scale: yupScale}], opacity: yupOpacity}

    let nopeOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    let nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    let animatedNopeStyles = {transform: [{scale: nopeScale}], opacity: nopeOpacity}

    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS
          animating={this.state.loadingImage}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
        <Animated.View style={[styles.card, animatedCardStyles]} {...this._panResponder.panHandlers}>
          <Image
            style={styles.img}
            source={{uri: this.state.plate ? this.state.plate.img_url : null}}
            onLoad={this._imageLoaded.bind(this)}
          />
          <View style={styles.imageFooter}>
            <View style={styles.textDisplayer}>
              <Text styles={styles.introTime}> You're just
                  <Text style={styles.minutes}> {this.state.distance ? this.state.distance : null} minutes </Text>
                away!</Text>
              <Text style={styles.plateName}> {this.state.plate ? this.state.plate.name : null} </Text>
            </View>
            <Image
              source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Dollar_sign_in_circle.svg/2000px-Dollar_sign_in_circle.svg.png'}}
              style={styles.priceImage}/>
          </View>
        </Animated.View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  card: {
    marginTop: 100,
    width: window.width,
    height: window.height/2
  },
  img: {
    flex: 1
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFooter: {
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    borderColor: 'black',
    borderWidth: 1,
  },
  textDisplayer: {
    flexDirection: 'column',
  },
  priceImage: {
    width: 60,
    height: 60
  },
  plateName: {
    fontSize: 25
  },
  minutes: {
    color: '#FEBB27',
    fontWeight: 'bold',
  }
});

module.exports = PlatesDashBoard;
