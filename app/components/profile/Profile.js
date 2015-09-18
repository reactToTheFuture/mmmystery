import React from 'react-native';
import _ from 'underscore';
import Dimensions from 'Dimensions';
import NavigationBar from 'react-native-navbar';
import CameraDashboard from '../camera/Camera-Dashboard';

import firebase_api from '../../utils/firebase-api';

import { formatIdString } from '../../utils/helpers';
import globals from '../../../globalVariables';

var imagesPerCycle = 3;

let {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableHighlight
} = React;

var imagesTimer;
var adventuresTimer;

var _imagesUploadedData = [];
var _adventuresData = [];
var totalLikes = 0;

class Profile extends React.Component {

  constructor(props) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    super(props);

    this.state = {
      imagesEndIndex: imagesPerCycle,
      adventuresEndIndex: imagesPerCycle,
      imagesUploaded: ds.cloneWithRows([]),
      adventures: ds.cloneWithRows([]),
      isLoadingImages: true,
      isLoadingAdventrues: true,
    };
  }

  updateImagesState() {
    _imagesUploadedData = _.sortBy(_imagesUploadedData, (data) => {
      if(!data.likes) {
        return 0;
      }

      return Object.keys(data.likes).length;
    }).reverse();

    this.setState({
      imagesUploaded: this.getMoreImages(),
      isLoadingImages: false,
      totalLikes
    });
  }

  updateAdventuresState() {
    this.setState({
      adventures: this.getMoreAdventures(),
      isLoadingAdventures: false
    });
  }

  getImagesUploaded() {
    firebase_api.getImagesByUser(this.props.user.id, (image) => {
      _imagesUploadedData.push(image);

      if(image.likes) {
        totalLikes += Object.keys(image.likes).length
      }

      // initial build is over, immediately update state
      if(!this.state.isLoadingImages) {
        this.updateImageState();
        return;
      }

      clearTimeout(imagesTimer);
      imagesTimer = setTimeout(this.updateImagesState.bind(this), 500);
    });
  }

  getAdventuresTaken() {
    firebase_api.getAdventuresByUser(this.props.user.id)
    .then((adventures) => {

      adventures.forEach((image_id) => {

        firebase_api.getImageById(image_id)
        .then((image) => {
          _adventuresData.push(image);

          // initial build is over, immediately update state
          if(!this.state.isLoadingAdventures) {
            this.updateAdventuresState();
            return;
          }

          clearTimeout(adventuresTimer);
          adventuresTimer = setTimeout(this.updateAdventuresState.bind(this), 500);
        });

      });
    })
    .catch((err) => {
      console.warn(err);
    });
  }

  componentDidMount() {
    this.getImagesUploaded();
    this.getAdventuresTaken();
  }

  getMoreImages(increment) {
    increment = increment || 0;
    return this.state.imagesUploaded.cloneWithRows( _imagesUploadedData.slice(0, this.state.imagesEndIndex + increment) )
  }

  getMoreAdventures(increment) {
    increment = increment || 0;
    return this.state.adventures.cloneWithRows( _adventuresData.slice(0, this.state.adventuresEndIndex + increment) )
  }

  _formatAmount(value, singular) {
    var string = '';
    if( value !== 1 ) {
      string = `${value} ${singular}s`
    } else {
      string = `${value} ${singular}`
    }

    return string;
  }

  goToCameraDashboard() {
    this.props.navigator.push({
      title: 'Camera',
      component: CameraDashboard,
      navigationBar: (
        <NavigationBar
          title="Picture Time" />
      )
    });
  }

  _renderImageRow(imgData, wow) {

    var likes = null;
    var dateData;
    var dateMonth = '';
    var dateYear = '';

    if(imgData.likes) {
      likes = Object.keys(imgData.likes).length;
      likes = this._formatAmount(likes, 'like');
    }

    dateData = imgData.date.split(' ');

    dateMonth = `${dateData[1]}. ${dateData[2]}`;
    dateYear = `${dateData[3]}`;

    return (
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{uri: imgData.img_url}}/>
        <View style={styles.mainImageInfo}>
          <Text style={styles.plate}>{formatIdString(imgData.plate_id)}</Text>
          <Text style={[styles.text, styles.restaurant]}>{formatIdString(imgData.restaurant_id)}</Text>
          {likes ? <Text style={styles.text}>{likes}</Text> : <Text></Text>}
        </View>
        <View style={styles.secondaryImageInfo}>
          <Text style={styles.text}>{dateMonth}</Text>
          <Text style={styles.text}>{dateYear}</Text>
        </View>
      </View>
    );
  }

  _onImagesEndReached() {
    this.setState({
      imagesUploaded: this.getMoreImages(imagesPerCycle),
      imagesEndIndex: this.state.imagesEndIndex + imagesPerCycle
    });
  }

  _onAdventuresEndReached() {
    this.setState({
      adventures: this.getMoreAdventures(imagesPerCycle),
      adventuresEndIndex: this.state.adventuresEndIndex + imagesPerCycle
    });
  }

  render () {
    var adventures = _adventuresData.length;
    var imagesUploaded = _imagesUploadedData.length;

    var loading = (
      <View style={styles.loadingContainer}>
        <Text style={[styles.text, styles.loadingText]}>Loading your stats...</Text>
      </View>
    );

    var stats = (
      <View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.number}>{adventures}</Text>
            <Text style={styles.text}>adventure{adventures !== 1 ? 's' : ''}</Text>
            <Text style={styles.text}>complete</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.number}>{imagesUploaded}</Text>
            <Text style={styles.text}>mmmeal{imagesUploaded !== 1 ? 's' : ''}</Text>
            <Text style={styles.text}>uploaded</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.number}>{this.state.totalLikes}</Text>
            <Text style={styles.text}>total</Text>
            <Text style={styles.text}>likes</Text>
          </View>
        </View>

        <View style={styles.imagesContainer}>
          <Text style={[styles.text, styles.headline]}>Mmmeals Uploaded:</Text>
          {imagesUploaded ?
            <ListView
              style={styles.list}
              scrollRenderAheadDistance={0}
              dataSource={this.state.imagesUploaded}
              renderRow={this._renderImageRow.bind(this)}
              onEndReached={this._onImagesEndReached.bind(this)}
            />
          :
            <TouchableHighlight
              style={styles.button}
              onPress={this.goToCameraDashboard.bind(this)}
              underlayColor={globals.primary}>
              <Text style={[styles.text, styles.none, styles.buttonText]}>Upload an Image!</Text>
            </TouchableHighlight>
          }
        </View>

        <View style={styles.imagesContainer}>
          <Text style={[styles.text, styles.headline]}>Adventures Completed:</Text>
          {adventures ?
            <ListView
              style={styles.list}
              scrollRenderAheadDistance={0}
              dataSource={this.state.adventures}
              renderRow={this._renderImageRow.bind(this)}
              onEndReached={this._onAdventuresEndReached.bind(this)}
            />
          :
            <Text style={[styles.text, styles.none]}>Swipe right on a tasty meal to get started!</Text>
          }
        </View>
      </View>
    );

    return (
      <View style={styles.container}>

        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{uri: this.props.user.picture.data.url}}/>
          <Text style={[styles.text, styles.name]}>{this.props.user.first_name} {this.props.user.last_name}</Text>
        </View>

        { (this.state.isLoadingImages || this.state.isLoadingAdventures) && loading }
        { (!this.state.isLoadingImages && !this.state.isLoadingAdventures) && stats }

      </View>
    );
  };
}

export default Profile;

let styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: globals.primaryDark,
    fontSize: 22,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  text: {
    fontFamily: 'SanFranciscoText-Regular'
  },
  headline: {
    marginBottom: 5,
    fontSize: 18,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'SanFranciscoText-SemiBold'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  stat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: globals.secondary,
  },
  number: {
    fontSize: 20,
    fontFamily: 'SanFranciscoText-SemiBold'
  },
  imagesContainer: {
    flex: 1,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: globals.primaryDark,
  },
  imageContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: globals.secondary,
    paddingVertical: 2.5 
  },
  mainImageInfo: {
    flex: 3,
    justifyContent: 'center',
    padding: 5,
  },
  secondaryImageInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  plate: {
    marginBottom: 5,
    color: globals.primaryDark,
    fontSize: 18,
    fontFamily: 'SanFranciscoText-SemiBold',
  },
  restaurant: {
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
  },
  list: {
    height: 150,
  },
  none: {
    marginVertical: 50,
    textAlign: 'center',
    fontSize: 22,
  },
  button: {
    backgroundColor: globals.primaryDark,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'SanFranciscoText-SemiBold'
  }
});
