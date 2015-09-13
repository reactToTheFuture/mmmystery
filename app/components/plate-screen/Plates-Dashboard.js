import React from 'react-native';
import clamp from 'clamp';
import Dimensions from 'Dimensions';
import PlatesDashboardContent from './Plates-Dashboard-Content';
import mapbox_api from '../../utils/mapbox-api';
import Colors from '../../../globalVariables';
var window = Dimensions.get('window');


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
      loadingImage: true,
      priceFactor: props.plates[0].priceFactor,
      showMinutes: false,
      searchAddress: null,
      plate: props.plates[0],
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
      plate: this.props.plates[newPlateIndex],
      priceFactor: this.props.plates[newPlateIndex].priceFactor,
    });
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

  componentWillReceiveProps(nextProps) {
    // New set of options chosen if 0
    if (nextProps.currPlateIndex === 0) {
      this.setState({
        priceFactor: nextProps.plates[0].priceFactor,
        plate: nextProps.plates[0],
      })
    }
  }

  render() {
    let { pan, enter, } = this.state;

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ['-30deg', '0deg', '30deg']});
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
        <Animated.View style={[styles.card, animatedCardStyles]} {...this._panResponder.panHandlers}>
          <Image
            style={styles.img}
            source={{uri: this.state.plate ? this.state.plate.img_url : null}}
            onLoad={this._imageLoaded.bind(this)}>
          <View style={styles.imageCrop}></View>
          </Image>
          <PlatesDashboardContent plate={this.state.plate} priceFactor={this.state.priceFactor} />
        </Animated.View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  card: {
    //marginTop: 100,
    width: window.width - 30,
    height: window.height/1.25,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: Colors.lightText,
    shadowOpacity: 0.5,
    shadowRadius: .9,
    shadowOffset: {
      height: 1.4,
      width: 0
    }
  },
  img: {
    flex: 11,
    borderRadius: 12,
    borderColor: 'transparent',
    borderWidth: 1,
    position: 'relative'
  },
  imageCrop: {
    width: window.width - 30,
    height: 10,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: -1
  },
});

module.exports = PlatesDashBoard;
