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
  Image
} = React;

var Colors = require('../../../globalVariables');
var { Icon, } = require('react-native-icons');

var foodImages = [
  require('image!icon-loading-american'),
  require('image!icon-loading-bacon'),
  require('image!icon-loading-breakfast'),
  require('image!icon-loading-burrito'),
  require('image!icon-loading-cookie'),
  require('image!icon-loading-corn'),
  require('image!icon-loading-croissant'),
  require('image!icon-loading-drumstick'),
  require('image!icon-loading-grape'),
  require('image!icon-loading-healthy'),
  require('image!icon-loading-hotdog'),
  require('image!icon-loading-mexican'),
  require('image!icon-loading-pizza'),
  require('image!icon-loading-popsicle'),
  require('image!icon-loading-sandwich'),
  require('image!icon-loading-seafood')
];

class FetchingItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      panAnim: new Animated.Value(0),
      secondPanAnim: new Animated.Value(0),
      item: foodImages[this.getRandomItem()],
      right: this.getRandomNumber(-25, 25)
    };
  }
  componentWillMount() {
    this._yAnimation = this.state.panAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 75]
    });
    this._xAnimation = this.state.secondPanAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 300]
    });
  }
  componentDidMount() {
    Animated.sequence([
      Animated.timing(this.state.panAnim, {
        toValue: 1,
        duration: 800
      })
    ]).start(this.props.onComplete);
  }
  getPan() {
    return {
      transform: [
        {translateY: this._yAnimation},
        //{translateX: this._xAnimation}
      ],
    };
  }
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min));
  }
  getRandomItem() {
    return Math.floor(Math.random() * (foodImages.length - 1))
  }

  render() {
    return (
      <Animated.View style={[this.getPan(), styles.position, {right: this.state.right}, this.props.style]}>
        <Image source={this.state.item} style={styles.icon} />
      </Animated.View>
    )
  }
}

let styles = StyleSheet.create({
  position: {
    position: 'absolute',
  },
  icon: {
    width: 50,
    height: 50
  }

});

module.exports = FetchingItems;