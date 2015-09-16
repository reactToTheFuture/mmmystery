import React from 'react-native';
import Overlay from 'react-native-overlay';

import Dimensions from 'Dimensions';
var window = Dimensions.get('window');
import LoadingComponent from './Loading-Component';

var {
  View,
  Modal,
  Text,
  StyleSheet
} = React;

class initialLoadingOverlay extends React.Component {
  render() {
    return (
      <View style={this.props.isVisible && styles.overlayContainer}>
        <Overlay
          isVisible={this.props.isVisible}>
          <LoadingComponent
            status={this.props.status}
          />
        </Overlay>
      </View>
    );
  }
}

export default initialLoadingOverlay;

let styles = StyleSheet.create({
  overlayContainer: {
    position: 'relative',
    height: window.height,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    width: window.width,
    textAlign: 'center'
  }
});