var React = require('react-native');
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

var {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
} = React;

var Colors = require('../../../globalVariables');
var { Icon, } = require('react-native-icons');

class FetchingRestaurants extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(0)
    };
  }
  componentWillMount() {
    this._opacityAnimation = this.state.fadeAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.3, 1]
    }),
    this._yAnimation = this.state.fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0]
    });
  }
  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 1500
    }).start();
  }
  getFadeInAnimationStyle() {
    return {
      transform: [
        {translateY: this._yAnimation}
      ],
      opacity: this._opacityAnimation
    };
  }
  render () {
    return (
      <Animated.View style={[styles.locationPinAnim, this.getFadeInAnimationStyle(),this.props.style]}>
        <Icon name='ion|android-pin' size={45} color={Colors.primary} style={styles.locationPinAnim}/>
      </Animated.View>
    );
  }
}

let styles = StyleSheet.create({
  locationPinAnim: {
    width: 45,
    height: 45,
  }
});

module.exports = FetchingRestaurants;