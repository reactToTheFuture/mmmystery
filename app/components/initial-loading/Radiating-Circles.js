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

var RadiatingCircles = React.createClass({
  getDefaultProps() {
    return {
      onComplete() {}
    }
  },
  getInitialState: function () {
    return {
      size: new Animated.Value(0)
    }
  },
  _createOpacityAnimation(currentStep) {
    return this.state.size.interpolate({
      inputRange: [0, 1],
      outputRange: currentStep === 1 ? [1, 0] : [0, 1]
    });
  },
  _createScaleAnimation(currentStep) {
    return this.state.size.interpolate({
      inputRange: [0, 1],
      outputRange: currentStep === 1 ? [0, 2.5] : [2.5, 0]
    });
  },
  componentWillMount() {
    this._opacityAnimation = this._createOpacityAnimation(this.props.currentStep),
    this._scaleAnimation = this._createScaleAnimation(this.props.currentStep)
  },
  componentDidMount() {
    Animated.timing(this.state.size, {
      toValue: 1,
      duration: this.props.currentStep === 1 ? 2000 : 3500
    }).start(this.props.onComplete);
  },
  ComponentWillReceiveProps(nextProps) {
    this._opacityAnimation = this._createOpacityAnimation(nextProps.currentStep),
    this._scaleAnimation = this._createScaleAnimation(nextProps.currentStep)
  },
  getCircleAnimationStyle() {
    return {
      transform: [
        {scale: this._scaleAnimation}
      ],
      opacity: this._opacityAnimation
    }
  },

  render () {
    return (
      <Animated.View style={[styles.circleAnim, this.getCircleAnimationStyle(), this.props.style]} />
    );
  }
});

var styles = StyleSheet.create ({
  circleAnim: {
    width: 126,
    height: 126,
    borderRadius: 126/2,
    backgroundColor: '#ffc000',
    borderWidth: 1,
    borderColor: '#F78914',
    position: 'absolute',
    left: (width / 2) - 63,
    right: 0,
    top: (height / 2.25) - 63,
  }
});

module.exports = RadiatingCircles;