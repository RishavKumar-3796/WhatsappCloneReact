import React from 'react';
import { StatusBar } from 'react-native'
import Router from './router';
import _ from 'lodash';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
// import FilesystemStorage from 'redux-persist-filesystem-storage';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/lib/integration/react';
import colors from './appConfig/color'
import firebase from 'react-native-firebase'

const persistConfig = {
  timeout: 0,
  key: 'root',
  storage: storage,
  keyPrefix: '',
  whitelist: ['user', 'appSetting', 'fcmToken', 'Task', 'Chat']
};

const pReducer = persistReducer(persistConfig, reducer);

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(pReducer);
const persistor = persistStore(store);

const config = {
  apiKey: "AIzaSyDo9k3Cio4Bwt2oA1-GPyoahqtMGfg9_Uw",
  authDomain: "mywhatsapp-202fa.firebaseapp.com",
  databaseURL: "https://mywhatsapp-202fa.firebaseio.com",
  projectId: "mywhatsapp-202fa",
  storageBucket: "mywhatsapp-202fa.appspot.com",
  messagingSenderId: "716284620805",
  appId: "1:716284620805:web:54a16ed50bb4465c"
};
firebase.initializeApp(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}  >
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar backgroundColor={colors.themeColor} barStyle="light-content" />
          <Router />
        </PersistGate>
      </Provider>

    )
  }
}