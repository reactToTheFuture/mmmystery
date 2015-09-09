# Mystery Meal - A new way of discovering food
Thesis project at MKS-20 implemented by using React, React-Native and Relay.

##When instaling Camera Roll Feature (needed for both cameraroll and live features)
1. In XCode, go to your `Project` ➜ `Libraries` ➜ `React.xcodeproj` ➜ `React` ➜ `Base`
2. Right click on `Base` and select `New File...`
3. Select `Objective-C File` and click `Next`
4. Name the file **RCTCustom.m** and click `Next`
5. Change the file contents to [this file](https://raw.githubusercontent.com/scottdixon/react-native-upload-from-camera-roll/master/RCTCustom.m)
6. Press `Enter` after @end to create a newline (XCode specific syntax rule)
7. `Save`

##After doing an npm install, In react-native-fbsdk-cor/js-modules/FBSDKGraphRequest.ios.js:
Change line 121 to be FBSDKGraphRequestManager.batchRequests([this], function(){}, timeout)

##When using the app font system
###San Francisco Display
- fontFamily: 'SanFranciscoDisplay-Light'
- fontFamily: 'SanFranciscoDisplay-Regular'
- fontFamily: 'SanFranciscoDisplay-Semibold'

###San Francisco Text
- fontFamily: 'SanFranciscoText-Regular'
- fontFamily: 'SanFranciscoText-RegularItalic'
- fontFamily: 'SanFranciscoText-Medium'
- fontFamily: 'SanFranciscoText-Semibold'

##Color Guide
These are located within the globalVariables.js file at the root of the directory. Just require either the whole set or choose which ones...

![Colorguide](https://s3-us-west-2.amazonaws.com/mystery-meal/color-guide.png)

##Icon Guide
The available icons are located [here](http://ionicons.com/). To see the name you use, just click on one and it's the words after the 'ion'.

```
var { Icon, } = require('react-native-icons');

<Icon
  name='ion|beer'
  size={30}
  color='#887700'
  style={styles.beer}
/>
```

Do note, you must explicitly include the width and height in the styles for the icon. so for this instance it would be...

```
styles = StyleSheet.create({
  beer: {
    width: 30,
    height: 30
  }
});
```

License
-------

MIT, see LICENSE.
