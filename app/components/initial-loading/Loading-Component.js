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
  TouchableWithoutFeedback,
} = React;

var CenterCircle = require('./Center-Circle');
var RadiatingCircles = require('./Radiating-Circles');
var LoadingText = require('./Loading-Text');
var startCount = 1;

var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};

var LoadingComponent = React.createClass({
  mixins: [SetIntervalMixin],
  getInitialState: function () {
    return {
      circles: [],
      currentStep: 1
    }
  },
  componentDidMount() {
    this.setInterval(this.addCircle, 1500);
  },
  addCircle() {
    startCount += 1;
    this.state.circles.push({
      id: startCount
    });
    this.setState(this.state);
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentStep: nextProps.status
    });
  },
  removeCircle(v) {
    var index = this.state.circles.findIndex(function(circle) {
      return circle.id === v;
    });
    this.state.circles.splice(index, 1);
    this.setState(this.state);
  },

  render () {
    return (
      <View style={styles.container}>

        <View style={{flex: 5}}></View>
        {
          this.state.circles.map(function(v, i) {
            return (
              <RadiatingCircles
                currentStep={this.state.currentStep}
                key={v.id}
                onComplete={this.removeCircle.bind(this, v.id)}
              />
            );
          }, this)
        }
        <CenterCircle currentStep={this.state.currentStep}/>
        <View style={{flex: 3}}>
          <LoadingText status={this.props.status} currentStep={this.state.currentStep}/>
        </View>
      </View>
    );
  }
});

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  }
});

module.exports = LoadingComponent;