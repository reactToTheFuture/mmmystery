var React = require('react-native');
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');
var globals = require('../../../globalVariables');

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
      title: 'Finding your location',
      subtitle: 'One moment while we find the restaurants within walking distance',
      switched: false
    };
  }
  componentWillMount() {
    if ( this.props.status === 1 ) {
      this.setState({
        title: "Finding your location",
        subtitle: "One moment while we find the restaurants within walking distance",
      })
    } else if ( this.props.status === 4 ) {
      this.setState({
        title: "Configuring route",
        subtitle: "One moment while we put together the steps to successfully get there",
      })
    }
    this._opacityAnimation = this.state.fadeAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.3, 1]
    })
  }
  componentDidMount() {
    this.getFadeAnimation(1, 1500);
  }
  getFadeAnimation(toValue, duration) {
    return Animated.timing(this.state.fadeAnim, {
      toValue: toValue,
      duration: duration,
      easing: Easing.circle(3)
    }).start();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentStep === 3 && !this.state.switched) {
      this.getFadeAnimation(0, 400);
      setTimeout(() => {
        this.setState({
          title: 'Fetching Mmmysteries',
          subtitle: 'Bear with us as we grab all the Mmmystery meals from fellow members',
          switched: true,
        });
        this.getFadeAnimation(1, 500);
      }, 500);
    }
  }
  getFadeInAnimationStyle() {
    return {
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
    fontFamily: globals.fontDisplayRegular,
    color: globals.darkText
  },
  subheader: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: globals.fontTextRegular,
    color: globals.lightText
  },
  notificationTextAnim: {
    paddingLeft: 35,
    paddingRight: 35
  }
});

module.exports = LoadingText;