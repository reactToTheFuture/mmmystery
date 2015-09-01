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
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingTop: 20,
    width: window.width,
    height: window.height,
  },
});

const Plates = [
  'http://s3-media4.fl.yelpcdn.com/bphoto/vnwQT-DqwR2VKGrXrtgGNw/o.jpg',
  'http://s3-media2.fl.yelpcdn.com/bphoto/XY7ShWc9r04qocYg62gfaA/o.jpg',
  'http://s3-media1.fl.yelpcdn.com/bphoto/0Vcw-scCuHWWlstbmw9rCA/o.jpg',
  'http://s3-media2.fl.yelpcdn.com/bphoto/U5NExON4sMfUTe_vhq13MA/o.jpg',
  'http://s3-media1.fl.yelpcdn.com/bphoto/_f_F0jfO_8BwUdWuOUHy_g/o.jpg',
  'http://s3-media1.fl.yelpcdn.com/bphoto/sAnqRoiZqkdtwOwt-pAP2A/o.jpg',
  'http://s3-media4.fl.yelpcdn.com/bphoto/oBLzvCaruGzjMX5xTh9LeA/o.jpg',
  'http://s3-media4.fl.yelpcdn.com/bphoto/g8OpXz2utIE5_HS0ICb74w/o.jpg',
  'http://s3-media2.fl.yelpcdn.com/bphoto/H_c8HLo28PrbHpfFQfEIiA/o.jpg',
  'http://s3-media4.fl.yelpcdn.com/bphoto/CghtT8RwkWcFWarZvUjwKg/o.jpg',
  'http://s3-media1.fl.yelpcdn.com/bphoto/0ZCKQZKy23THoMAor2Mxmg/o.jpg',
  'http://s3-media1.fl.yelpcdn.com/bphoto/ZncTSLGTwSX6VCNLtvsoBg/o.jpg',
  'http://s3-media4.fl.yelpcdn.com/bphoto/ZGBor6OA-s6BQ090xnafjQ/o.jpg',
  'http://s3-media3.fl.yelpcdn.com/bphoto/Jvavw4449QZbFfR883kTfQ/o.jpg',
  'http://s3-media4.fl.yelpcdn.com/bphoto/EAPI6_mlDeoD9Op9SWabZw/o.jpg',
  'http://s3-media2.fl.yelpcdn.com/bphoto/ba3nUiff6ylZIBHo4_eptQ/o.jpg',
  'http://s3-media2.fl.yelpcdn.com/bphoto/DeA3rO3bS3HjrmACZFvbIw/o.jpg',
  'http://s3-media1.fl.yelpcdn.com/bphoto/ZNIHPSvPrDpCTzVIIaMspg/o.jpg',
  'http://s3-media1.fl.yelpcdn.com/bphoto/qaB_pZqs5AaDdFI-bg35KQ/o.jpg',
  'http://s3-media3.fl.yelpcdn.com/bphoto/BzEVvDaPk0P7ER1xH6PwQQ/o.jpg',
  'http://s3-media2.fl.yelpcdn.com/bphoto/cf5CNR5k3t22neDBWA8JfA/o.jpg',
  'http://s3-media1.fl.yelpcdn.com/bphoto/fwBUx-yOi7uVe5oJ56yINg/o.jpg',
  'http://s3-media1.fl.yelpcdn.com/bphoto/iyQNU133lhwm8utr5LdFuQ/o.jpg'
];

var SWIPE_THRESHOLD = 120;

class PlatesDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
      plate: Plates[0],
    };
  }

  _goToNextPlate() {
    let currentPlateIdx = Plates.indexOf(this.state.plate);
    let newIdx = currentPlateIdx + 1;

    this.setState({
      plate: Plates[newIdx > Plates.length - 1 ? 0 : newIdx],
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

        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          Animated.decay(this.state.pan.x, {
            velocity: velocity,
            deceleration: 0.98,
          }).start(this._resetState.bind(this))

          Animated.decay(this.state.pan.y, {
            velocity: vy,
            deceleration: 0.985,
          }).start();
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
            source={{uri: this.state.plate}}
          />
        </Animated.View>
      </View>
    );
  }
}

module.exports = PlatesDashBoard;
