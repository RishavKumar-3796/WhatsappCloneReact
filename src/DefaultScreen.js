import React, { Component } from "react";
import { View } from "react-native";
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '@actions/userActions';
import firebase from 'react-native-firebase';
class DefaultScreen extends Component {

  resetAction(routeName) {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  redirectToApp(props) {
    if (props && props.userData && props.userData.userId) {
      this.resetAction("Home");
    }
    else {
      this.resetAction("Signup");
    }
  }

  logout() {
    this.props.userAction.logout();
  }

  componentDidMount() {
    this.redirectToApp(this.props);
    this.setupPushNotifications();
  }

  setupPushNotifications() {
    let channel = new firebase.notifications.Android.Channel('TaksMonkey', 'TaksMonkey Channel', firebase.notifications.Android.Importance.High).setDescription('My apps test channel').setBypassDnd(true).enableVibration(true).setVibrationPattern([100, 200, 300, 400, 500, 400, 300, 200, 400])
      .enableLights(true).setLightColor('#ff0000');

    firebase.notifications().android.createChannel(channel);

    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notificationOpen) => {
      if (notificationOpen) {
        if (Platform.OS !== 'android') {
          firebase.notifications().getBadge().then(count => {
            count++
            firebase.notifications().setBadge(count)
          })
        }
      }
    });

    firebase.messaging().hasPermission({ badge: true, sound: true, alert: true }).then(enabled => {
      if (enabled) {
      } else {
        firebase.messaging().requestPermission({ badge: true, sound: true, alert: true });
      }
    });

    firebase.messaging().onTokenRefresh(fcmToken => {
      console.log('onTokenRefresh', fcmToken);
      this.props.userAction.fcmToken(fcmToken);
    });

    //App Closed
    firebase.notifications().getInitialNotification().then((notificationOpen) => {
      if (notificationOpen) {
        console.log("initial notification opened")
      }
    });

    // App in Foreground and background
    this.notificationListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      if (notificationOpen) {
        console.log("notification opened")
      }
    });

    firebase.notifications().onNotification((message) => {
      if (message) {
        let data = message._data;
        const notification = new firebase.notifications.Notification()
          .setNotificationId(new Date().getTime().toString())
          .setTitle(message._title)
          .setBody(message._body)
          .setData(data)
          .setSound('default')
        {
          Platform.OS == 'android' &&
            notification
              .android.setChannelId('TaksMonkey')
              .android.setSmallIcon('ic_launcher');
        }
        AsyncStorage.getItem('active_chatId').then(active_chatId => {
          if (data && data.taskId != active_chatId) {
            firebase.notifications().displayNotification(notification).catch(err => console.error(err));
          }
        });
        setTimeout(() => {
          firebase.notifications().removeAllDeliveredNotifications();
        }, 5000);
      }
    });

    firebase.messaging().getToken().then(fcmToken => {
      this.props.userAction.saveFcmToken(fcmToken);
      console.log('fcmToken', fcmToken);
    })

  }

  componentWillReceiveProps(nextProps) {
    this.redirectToApp(nextProps)
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }} />
    );
  }
}

function mapStateToProps(state) {
  console.log("inside map state to props => ", state)
  return {
    userData: state.user && state.user.userData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userAction: bindActionCreators(userActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultScreen);
