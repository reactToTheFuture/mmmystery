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
      imagesUploaded: ds.cloneWithRows([]),
      adventures: ds.cloneWithRows([]),
      totalLikes: 0
    };
  }

  getImagesUploaded() {
    var images = [];
    firebase_api.getImagesByUser(this.props.user.id, (image) => {
      var likeCount = 0;
      images.push(image);

      if(image.likes) {
        likeCount = Object.keys(image.likes).length;
      }

      this.setState({
        imagesUploaded: this.state.imagesUploaded.cloneWithRows(images),
        totalLikes: this.state.totalLikes += likeCount
      });
    });
  }

  getAdventuresTaken() {
    var adventures = [];
    firebase_api.getAdventuresByUser(this.props.user.id)
    .then((adventures) => {
      adventures.forEach((image_id) => {
        firebase_api.getImageById(image_id)
        .then((img) => {
          adventures.push(img);
          this.setState({
            adventures: this.state.adventures.cloneWithRows(adventures)
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

  _renderImageUploaded() {
    return (
      <Text>hey</Text>
    );
  }

  render () {

    return (
      <View>
        <Image
          style={styles.avatar}
          source={{uri: this.props.user && this.props.user.picture.data.url}}/>
        <Text style={styles.name}>{this.props.user && this.props.user.first_name}</Text>
        <ListView
          dataSource={this.state.imagesUploaded}
          renderRow={this._renderImageUploaded}
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
});
