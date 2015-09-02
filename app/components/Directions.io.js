var React = require('react-native');
var mapbox_api = require('../utils/mapbox-api');
var stepsToFollow = [];

let {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

var colors = {
  clouds: '#ecf0f1'
};

let styles = StyleSheet.create({
  directions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
  },
});

var origin = {
      'lat': 34.019370,
      'lng': -118.494474
    };
var destiny = {
      'lat': 34.0186152,
      'lng': -118.487058
    };

async function getAsyncDirections (origin, destiny) {
   var responseDirections = await (mapbox_api.getDirections(origin, destiny)
        .then(function(data) {
          data.routes[0].steps.map(function(step){
            stepsToFollow.push(step.maneuver.instruction);
          })
          return stepsToFollow;
        }));
  return responseDirections;
}

class Directions extends React.Component{

  constructor(props) {
    super(props);
    this.state = {stepsDirections: ["Loading directions ... Wait."], stepProgress: 0};
  }

  componentDidMount() {
    var _this = this;
    getAsyncDirections(origin, destiny)
    .then(function(response){
      _this.setState({stepsDirections: response});
    })
    .catch(function (err) { console.log('Something went wrong: ' + err); });
  }

  _onPressButton() {
    if ( this.state.stepProgress < this.state.stepsDirections.length-1) {
      console.log(this.state.stepProgress);
      this.setState({stepProgress: this.state.stepProgress + 1});
    }
  }

  render () {
    return (
      <View style={styles.directions}>
        <Text> {this.state.stepsDirections[this.state.stepProgress]} </Text>
        <TouchableHighlight
        onPress={this._onPressButton.bind(this)}
        style={styles.button}>
          <Text>NEXT STEP</Text>
        </TouchableHighlight>
      </View>
    );
  };
}

module.exports = Directions;