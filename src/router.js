import React, { Component } from 'react'
import {
  Animated,
  Easing
} from 'react-native'
import { createAppContainer, createStackNavigator } from "react-navigation";

import DefaultScreen from './DefaultScreen';
import Signup from './containers/signup'
import OtpVerify from './containers/signup/otpVerify'
import SignupProfile from "./containers/profile/signupProfile";
import AboutMe from "./containers/profile/AboutMe";
import Home from "./containers/home/home";
import SettingsScreen from "./containers/settings/settings";
import UserChat from './containers/chat/UserChat';
import ContactList from './containers/contacts/contactList';
import firebase from 'react-native-firebase'

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { position, layout, scene, index, scenes } = sceneProps
      const toIndex = index
      const thisSceneIndex = scene.index
      const height = layout.initHeight
      const width = layout.initWidth

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        outputRange: [width, 0, 0]
      })

      // Since we want the card to take the same amount of time
      // to animate downwards no matter if it's 3rd on the stack
      // or 53rd, we interpolate over the entire range from 0 - thisSceneIndex
      const translateY = position.interpolate({
        inputRange: [0, thisSceneIndex],
        outputRange: [height, 0]
      })

      const slideFromRight = { transform: [{ translateX }] }
      const slideFromBottom = { transform: [{ translateY }] }

      const lastSceneIndex = scenes[scenes.length - 1].index

      // Test whether we're skipping back more than one screen
      if (lastSceneIndex - toIndex > 1) {
        // Do not transoform the screen being navigated to
        if (scene.index === toIndex) return
        // Hide all screens in between
        if (scene.index !== lastSceneIndex) return { opacity: 0 }
        // Slide top screen down
        return slideFromBottom
      }

      return slideFromRight
    },
  }
}


const AppNavigator = createStackNavigator(
  {
    DefaultScreen: {
      screen: DefaultScreen,
    },
    Signup: {
      screen: Signup
    },
    OtpVerify: {
      screen: OtpVerify
    },
    ProfileInfo: {
      screen: SignupProfile
    },
    Home: {
      screen: Home
    },
    Settings: {
      screen: SettingsScreen,
    },
    UserChat: {
      screen: UserChat
    },
    ContactList: {
      screen: ContactList
    },
    AboutMe: {
      screen: AboutMe
    }
  },
  {
    initialRouteName: "DefaultScreen",
    headerMode: "none",
    cardStyle: {
      backgroundColor: "white"
    },
    transitionConfig
  });

const App = createAppContainer(AppNavigator);

export default App;

// var firebaseConfig = {
//   apiKey: "AIzaSyDo9k3Cio4Bwt2oA1-GPyoahqtMGfg9_Uw",
//   authDomain: "mywhatsapp-202fa.firebaseapp.com",
//   databaseURL: "https://mywhatsapp-202fa.firebaseio.com",
//   projectId: "mywhatsapp-202fa",
//   storageBucket: "",
//   messagingSenderId: "716284620805",
//   appId: "1:716284620805:web:54a16ed50bb4465c"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);



