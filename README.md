# Mmmystery

A new way of discovering food

## Installation

### 1.) npm install

### 2.) install custom camera component
1. In XCode, go to your `Project` ➜ `Libraries` ➜ `React.xcodeproj` ➜ `React` ➜ `Base`
2. Right click on `Base` and select `New File...`
3. Select `Objective-C File` and click `Next`
4. Name the file **RCTCustom.m** and click `Next`
5. Change the file contents to [this file](https://raw.githubusercontent.com/scottdixon/react-native-upload-from-camera-roll/master/RCTCustom.m)
6. Press `Enter` after @end to create a newline (XCode specific syntax rule)
7. `Save`

### 3.) fix FBSDKGraphRequest node module

1. Navigate to node_modules/react-native-fbsdkcore/js-modules/FBSDKGraphRequest.ios.js
2. Change line 121 to be "FBSDKGraphRequestManager.batchRequests([this], function(){}, timeout)"

## Font / Color Conventions

See globalVaribles.js


## Icons
We used [Ion Icons](http://ionicons.com/). Navigate to the Ion Icons site and click on the icon you would like to use. The corresponding name will pop up, "ion-beer" for example. To use this icon as a React Native component, see below.

Note how the name for "ion-beer" becomes "ion|beer".

```
var { Icon } = require('react-native-icons');

<Icon
  name='ion|beer'
  size={30}
  color='#887700'
  style={styles.beer}
/>
```

Also note that you must explicitly include the width and height in the styles for the icon. For example...

```
styles = StyleSheet.create({
  beer: {
    width: 30,
    height: 30
  }
});
```

## Tests

Async tests are handled with Jasmine in /spec. Component tests are handled with Jest in \_\_tests\_\_

## Organization

The app is organized by feature in app/components. Any API related functionality or helper functions should go in app/utils.


## To Do
1. More Tests
2. Add ability to follow friends and share mmmysteries with them
3. “Venmo-like” news feed that shows current activity in your area
4. Have users attach feelings to their meals

## License

MIT, see LICENSE.
