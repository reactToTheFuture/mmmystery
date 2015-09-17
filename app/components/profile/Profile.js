import React from 'react-native';
import _ from 'underscore';
import Dimensions from 'Dimensions';

import firebase_api from '../../utils/firebase-api';

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

class Profile extends React.Component {

  constructor(props) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    super(props);

    this.state = {
      _imagesUploadedData: [],
      _adventuresData: [],
      imagesEndIndex: imagesPerCycle,
      adventuresEndIndex: imagesPerCycle,
      imagesUploaded: ds.cloneWithRows([]),
      adventures: ds.cloneWithRows([]),
      totalLikes: 0,
    };
  }

  getImagesUploaded() {
    firebase_api.getImagesByUser(this.props.user.id, (image) => {
      this.state._imagesUploadedData.push(image);

      if(image.likes) {
        this.state.totalLikes += Object.keys(image.likes).length;
        this.state._imagesUploadedData = _.sortBy(this.state._imagesUploadedData, 'likes');
      }

      this.setState(this.state, () => {
        // if no images in list view, get the first batch
        if( !this.state.imagesUploaded.getRowCount()  ) {
          this.setState({
            imagesUploaded: this.getMoreImages()
          });
        }

      });
    });
  }

  getAdventuresTaken() {
    firebase_api.getAdventuresByUser(this.props.user.id)
    .then((adventures) => {

      adventures.forEach((image_id) => {

        firebase_api.getImageById(image_id)
        .then((image) => {

          this.state._adventuresData.push(image);
          this.setState(this.state, () => {
            // if no images in list view, get the first batch
            if( !this.state.adventures.getRowCount() ) {
              this.setState({
                adventures: this.getMoreAdventures()
              });
            }
          });

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
    return this.state.imagesUploaded.cloneWithRows( this.state._imagesUploadedData.slice(0, this.state.imagesEndIndex + increment) )
  }

  getMoreAdventures(increment) {
    increment = increment || 0;
    return this.state.adventures.cloneWithRows( this.state._adventuresData.slice(0, this.state.adventuresEndIndex + increment) )
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

  _renderImageRow(imgData, wow) {

    var likes = null;

    if(imgData.likes) {
      likes = Object.keys(imgData.likes).length;

      likes = this._formatAmount(likes, 'like');
    }

    return (
      <View>
        <Image
          style={styles.image}
          source={{uri: imgData.img_url}}/>
        <Text>{imgData.plate_id}</Text>
        <Text>{imgData.restaurant_id}</Text>
        <Text>{imgData.date}</Text>
        {likes ? <Text>{likes}</Text> : <Text></Text>}
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
    var adventures = this.state._adventuresData.length;
    adventures = this._formatAmount(adventures, 'adventure');

    var imagesUploaded = this.state._imagesUploadedData.length;
    imagesUploaded = this._formatAmount(imagesUploaded, 'mmmeal');

    return (
      <View>
        <Image
          style={styles.avatar}
          source={{uri: this.props.user && this.props.user.picture.data.url}}/>
        <Text style={styles.name}>{this.props.user && this.props.user.first_name}</Text>

        <Text>{adventures} complete</Text>

        <Text>{imagesUploaded} uploaded</Text>

        <Text>{this.state.totalLikes} # of likes</Text>

        <ListView
          style={styles.imagesUploadedContainer}
          scrollRenderAheadDistance={0}
          dataSource={this.state.imagesUploaded}
          renderRow={this._renderImageRow.bind(this)}
          onEndReached={this._onImagesEndReached.bind(this)}
        />
        <Text>Adventures:</Text>
        <ListView
          style={styles.adventuresContainer}
          scrollRenderAheadDistance={0}
          dataSource={this.state.adventures}
          renderRow={this._renderImageRow.bind(this)}
          onEndReached={this._onAdventuresEndReached.bind(this)}
        />
      </View>
    );
  };
}

export default Profile;

let styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  imagesUploadedContainer: {
    height: 200
  },
  adventuresContainer: {
    height: 200
  },
  image: {
    width: 50,
    height: 50,
  }
});
