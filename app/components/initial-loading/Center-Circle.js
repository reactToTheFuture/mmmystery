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

var FetchingRestaurants = require('./Fetching-Restaurants');
var FetchingItems = require('./Fetching-Items');
var startItemCount = 1;


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

var CenterCircle = React.createClass({
  mixins: [SetIntervalMixin],
  getDefaultProps() {
    return {
      onComplete() {}
    }
  },
  getInitialState: function () {
    return {
      items: [],
      size: new Animated.Value(0),
      addingItems: false,
      icon: [
        'ios-bolt',
        'ios-paper-outline',
        'ios-world',
        'ios-bookmarks',
        'ios-navigate',
        'ios-bolt',
        'ios-paper-outline',
        'ios-world',
        'ios-bookmarks',
        'ios-navigate'
      ]
    }
  },

  componentWillMount() {
    this._scaleAnimation = this.state.size.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  },
  componentDidMount() {
    Animated.spring(this.state.size, {
      toValue: 1,
      velocity: 2,
      tension: 0,
      friction: 2
    }).start();
  },
  componentWillReceiveProps(nextProp) {
    if (nextProp.currentStep !== 1 && !this.state.addingItems) {
      this.setInterval(this.addItem, 4000);
      this.setState({
        addingItems: true
      });
    }
  },
  addItem() {
    startItemCount += 1;
    this.state.items.push({
      id: startItemCount
    });
    this.setState(this.state);
  },
  removeItem(v) {
    var index = this.state.items.findIndex(function(item) {
      return item.id === v;
    });
    this.state.items.splice(index, 1);
    this.setState(this.state);
  },
  getPulsateAnimationStyle() {
    return {
      transform: [
        {scale: this._scaleAnimation}
      ]
    };
  },

  render() {
    var secondPiece;
    if(this.props.currentStep === 1) {
      secondPiece = <FetchingRestaurants />
    } else {
      secondPiece =
      this.state.items.map((v, i) => {
        return (
          <FetchingItems
            icon={this.state.icon[v.id]}
            mealItem={v.id}
            key={v.id}
            onComplete={this.removeItem.bind(this, v.id)}
          />
        );
      }, this);
    }
    return (
      <Animated.View style={[styles.mainCircle, this.getPulsateAnimationStyle(), this.props.style]}>
        {secondPiece}
      </Animated.View>
    );
  }
});

let styles = StyleSheet.create({
  mainCircle: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    borderRadius: 100/2,
    borderWidth: 2,
    borderColor: '#FFD968',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: (width / 2) - 50,
    right: 0,
    top: (height / 2.25) - 50,
    shadowColor: '#d3d3d3',
    shadowOpacity: 0.5,
    shadowRadius: .9,
    shadowOffset: {
      height: 1.4,
      width: 0
    },
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

module.exports = CenterCircle;