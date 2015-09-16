var React = require('react-native');
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');
var Colors = require('../../../globalVariables');

var {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
} = React;

class LoadingText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(0),
      title: "Searching for your location",
      subtitle: "Please be patient!",
    };
  }
  componentWillMount() {
    this._opacityAnimation = this.state.fadeAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.3, 1]
    }),
    this._yAnimation = this.state.fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0]
    });
  }
  componentDidMount() {
    Animated.sequence([
      Animated.delay(750),
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.circle(3)
      })
    ]).start();
  }
  componentWillReceiveProps(nextProps) {
    var title, subtitle;
    if (nextProps.currentStep === 2) {
      title="Fetching yummy meals";
      subtitle="You are in for quite the treat!";
    } else {
      title = "Searching your location";
      subtitle = "Wait one moment while we find all your nearby restaurants!";
    }
    this.setState({
      title: title,
      subtitle: subtitle
    });
  }
  getFadeInAnimationStyle() {
    return {
      transform: [
        {translateY: this._yAnimation}
      ],
      opacity: this._opacityAnimation
    }
  }

  render() {
    var key = this.state.title;
    return (
      <Animated.View  style={[styles.notificationTextAnim, this.getFadeInAnimationStyle()]}>
        <Text style={styles.header}>{this.state.title}</Text>
        <Text style={styles.subheader}>{this.state.subtitle}</Text>
      </Animated.View>
    );
  }
}

let styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 10,
    color: '#394453',
    fontFamily: 'SanFranciscoDisplay-Regular',
    color: Colors.darkText
  },
  subheader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'SanFranciscoText-Regular',
        color: Colors.lightText
  },
  notificationTextAnim: {
    paddingLeft: 35,
    paddingRight: 35
  }
});

module.exports = LoadingText;