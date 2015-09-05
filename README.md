# Mystery Meal - A new way of discovering food
Thesis project at MKS-20 implemented by using React, React-Native and Relay.

When installing camera roll feature



##When installing Live Camera Feature

1. make sure to run npm install to bring in react-native-camera
2. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
3. Go to `node_modules` ➜ `react-native-camera` and add `RCTCamera.xcodeproj`
4. In XCode, in the project navigator, select your project. Add `libRCTCamera.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
5*. Click `RCTCamera.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic').
6.* Look for `Header Search Paths` and make sure it contains both `$(SRCROOT)/../react-native/React` and `$(SRCROOT)/../../React` - mark both as `recursive`.
7. Run your project (`Cmd+R`)

*not needed for now

for more info on this feature visit [react-native-camera](https://github.com/lwansbrough/react-native-camera)

##When instaling Camera Roll Feature
1. In XCode, go to your Project > Libraries > React > Base
2. Right click on base and select 'New File...'
3. Select Objective-C File and click next
4. Name the file RCTCustom.m
5. Change the file contents to [this file](https://raw.githubusercontent.com/scottdixon/react-native-upload-from-camera-roll/master/RCTCustom.m)


License
-------

MIT, see LICENSE.
