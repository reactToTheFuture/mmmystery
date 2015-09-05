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

License
-------

MIT, see LICENSE.
