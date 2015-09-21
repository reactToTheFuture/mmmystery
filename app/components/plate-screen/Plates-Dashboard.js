import React from 'react-native';
import clamp from 'clamp';
import Dimensions from 'Dimensions';
import PlatesDashboardContent from './Plates-Dashboard-Content';
import mapbox_api from '../../utils/mapbox-api';
import Colors from '../../../globalVariables';

var window = Dimensions.get('window');

var {
  StyleSheet,
  PanResponder,
  ActivityIndicatorIOS,
  View,
  Text,
  Image,
  LayoutAnimation,
  Animated,
} = React;

class PlatesDashBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      SWIPE_THRESHOLD: 120,
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
      loadingImage: true,
      showMinutes: false,
      searchAddress: null,
      arr: this._randomArray(4),
    };
  }

  _springBack() {
    Animated.spring(this.state.pan, {
      toValue: {x: 0, y: 0},
      friction: 10
    }).start(function() {
      this.setState({arr: this._randomArray(4)});
    }.bind(this));
  }

  _goToNextPlate() {
    this.props.onRejection();

    this.setState({
      loadingImage: true,
      arr: this._randomArray(4)
    });
  }

  _randomArray(n) {
    let res = [];
    for(let i = 0; i < n; i++) {
      res.push(Math.random());
    }
    return res;
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

        // didn't swipe far enough
        if (Math.abs(this.state.pan.x._value) < this.state.SWIPE_THRESHOLD) {
          this._springBack();
          return;
        }

        // Accepted Dish
        if( this.state.pan.x._value > 0 ) {
          this.props.onSelection();
          this._springBack();
          return;
        }

        this._resetState();
        this._goToNextPlate();
      }
    });
  }

  _imageLoaded() {
    this.setState({
      loadingImage: false
    });

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
  }

  nopeStyle() {
    return {
      bottom: 20 + (window.height*3/4 - 40) * this.state.arr[0],
      left: 20 + (window.width/3 - 40) * this.state.arr[1],
    };
  }

  yupStyle() {
    return {
      bottom: 20 + (window.height*3/4 - 40) * this.state.arr[2],
      right: 20 + (window.width/3 - 40) * this.state.arr[3],
    };
  }

  nopeText() {
    var options = ['Nope!', 'No Way!', 'Never!', 'Thumbs down!', 'Nasty!', 'Yuck!', 'Awful!', 'Gross!', 'Not in my lifetime!', 'Over my dead body!'];
    return options[Math.floor(options.length * this.state.arr[0])];
  }

  yupText() {
    var options = ['Yup!', 'Let\'s go!', 'Mmmm!', 'Gimme!', 'Tasty!', 'Sweet!', 'Nice!', 'Yay!', 'Lets eat!', 'Yummy!'];
    return options[Math.floor(options.length * this.state.arr[2])];
  }

  render() {
    let { pan, enter, } = this.state;

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ['-30deg', '0deg', '30deg']});
    let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]});
    let scale = enter;

    let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    let yupOpacity = pan.x.interpolate({inputRange: [0, 100], outputRange: [0, 1]});
    let yupScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.75, 1], extrapolate: 'clamp'});
    let animatedYupStyles = {transform: [{scale: yupScale}], opacity: yupOpacity};

    let nopeOpacity = pan.x.interpolate({inputRange: [-100, 0], outputRange: [1, 0]});
    let nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.75], extrapolate: 'clamp'});
    let animatedNopeStyles = {transform: [{scale: nopeScale}], opacity: nopeOpacity};

    return (
      <View style={styles.container}>
        <Image
          source={require('image!food-bg')}
          style={styles.bgImage}>
          <ActivityIndicatorIOS
            animating={this.state.loadingImage}
            style={styles.loadingIcon}
            size="large"
          />
          <Animated.View style={[styles.card, animatedCardStyles]} {...this._panResponder.panHandlers}>
            <Image
              style={styles.img}
              source={{uri: this.props.plate.img_url}}
              onLoad={this._imageLoaded.bind(this)}>
            <View style={styles.imageCrop}></View>
            </Image>
            <PlatesDashboardContent plate={this.props.plate} priceFactor={this.props.priceFactor} />
          </Animated.View>
          <Animated.View style={[styles.nope, animatedNopeStyles, this.nopeStyle()]}>
            <Text style={styles.nopeText}>{this.nopeText()}</Text>
          </Animated.View>
          <Animated.View style={[styles.yup, animatedYupStyles, this.yupStyle()]}>
            <Text style={styles.yupText}>{this.yupText()}</Text>
          </Animated.View>
        </Image>
      </View>
    );
  }
}

export default PlatesDashBoard;

// Adjustments
var widthRatio = window.width/375,
    heightRatio = window.height/667;
var sizeCardWidth,
    sizeCardHeight;
switch(window.height) {
    case 480: // iPhone 4s
        sizeCardWidth = 295
        sizeCardHeight = 360;
        break;
    case 568 : // iPhone 5 and 5s
        sizeCardWidth = 345 *  widthRatio;
        sizeCardHeight = 533 * heightRatio;
        break;
    case 667: // iPhone 6
        sizeCardWidth  = 345;
        sizeCardHeight = 533;
        break;
    case 736: // iPhone 5 and 5s
        sizeCardWidth = 345 *  widthRatio;
        sizeCardHeight = 533 * heightRatio;
    default:
        break;
}
//-----

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  card: {
    width: sizeCardWidth,
    height: sizeCardHeight,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: Colors.lightText,
    shadowOpacity: 0.5,
    shadowRadius: .9,
    shadowOffset: {
      height: 1.4,
      width: 0
    }
  },
  img: {
    flex: 11,
    borderRadius: 12,
    borderColor: 'transparent',
    borderWidth: 1,
    position: 'relative',
    resizeMode: 'cover',
  },
  imageCrop: {
    width: 345 *  widthRatio,
    height: 10,
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    left: -1
  },
  loadingIcon: {
    position: 'absolute',
    top: 200,
    left: (window.width/2 - 18),
    backgroundColor: 'transparent',
  },
  yup: {
    backgroundColor: '#ffffff',
    borderColor: 'green',
    borderWidth: 2,
    position: 'absolute',
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 20,
  },
  yupText: {
    fontSize: 16,
    color: 'green',
  },
  nope: {
    backgroundColor: '#ffffff',
    borderColor: 'red',
    borderWidth: 2,
    position: 'absolute',
    bottom: 20,
    padding: 20,
    borderRadius: 5,
    left: 20,
  },
  nopeText: {
    fontSize: 16,
    color: 'red',
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
