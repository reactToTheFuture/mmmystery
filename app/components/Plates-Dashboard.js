var React = require('react-native');
var clamp = require('clamp');
var Dimensions = require('Dimensions');
var window = Dimensions.get('window');

var {
  StyleSheet,
  PanResponder,
  View,
  Text,
  Image,
  LayoutAnimation,
  Animated,
} = React;

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
  }
});

class PlatesDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SWIPE_THRESHOLD: 100,
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
      plateIndex: 0,
      plate: null,
    };
  }

  _goToNextPlate() {
    let newPlateIndex = this.state.plateIndex + 1;
    newPlateIndex = newPlateIndex >= this.props.plates.length ? 0 : newPlateIndex;

    this.setState({
      plateIndex: newPlateIndex,
      plate: this.props.plates[newPlateIndex]
    });
  }

  componentWillUpdate(nextProps) {
    if( !this.state.plate && nextProps.plates.length ) {
      this.setState({
        plate: nextProps.plates[0]
      })
    }
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

        if (Math.abs(this.state.pan.x._value) > this.state.SWIPE_THRESHOLD) {

          Animated.decay(this.state.pan.x, {
            velocity: velocity,
            deceleration: 0.98,
          }).start(this._resetState.bind(this))

          Animated.decay(this.state.pan.y, {
            velocity: vy,
            deceleration: 0.985,
          }).start();

          // Accepted a dish
          if( this.state.pan.x._value > 0 ) {
            this.props.onSelection(this.state.plate);
          }

        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    });
  }

  componentDidMount() {
    console.log(this.props.navigator);
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
    this._goToNextPlate();
    this._animateEntrance();
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
        <Animated.View style={[styles.card, animatedCardStyles]} {...this._panResponder.panHandlers}>
          <Image
            style={{flex: 1}}
            source={{uri: this.state.plate ? this.state.plate.img_url : null}}
          />
        </Animated.View>
      </View>
    );
  }
}

module.exports = PlatesDashBoard;
