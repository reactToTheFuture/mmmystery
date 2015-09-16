import React from 'react-native';

import Dimensions from 'Dimensions';

import firebase_api from '../../utils/firebase-api';

import globals from '../../../globalVariables';

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
      imagesEndIndex: 3,
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
      }

      this.setState(this.state, () => {
        // if no images in list view, get the first batch
        if( !this.state.imagesUploaded.getRowCount() ) {
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
          this.setState(this.state);
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

  _renderImageUploaded(imgData) {
    return (
      <View>
        <Image
          style={styles.image}
          source={{uri: imgData.img_url}}/>
        <Text>{imgData.plate_id}</Text>
        <Text>{imgData.restaurant_id}</Text>
        <Text>{imgData.date}</Text>
      </View>
    );
  }

  _onImagesEndReached() {
    this.setState({
      imagesUploaded: this.getMoreImages(3),
      imagesEndIndex: this.state.imagesEndIndex + 3
    });
  }

  render () {

    return (
      <View>
        <Image
          style={styles.avatar}
          source={{uri: this.props.user && this.props.user.picture.data.url}}/>
        <Text style={styles.name}>{this.props.user && this.props.user.first_name}</Text>
        <ListView
          style={styles.imagesContainer}
          initialListSize={2}
          scrollRenderAheadDistance={0}
          dataSource={this.state.imagesUploaded}
          renderRow={this._renderImageUploaded.bind(this)}
          onEndReached={this._onImagesEndReached.bind(this)}
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
  imagesContainer: {
    height: 500
  },
  image: {
    width: 50,
    height: 50,
  }
});
