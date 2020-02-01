import firebase from 'react-native-firebase';
const firestore = firebase.firestore();
import moment from 'moment-timezone';
import Contacts from 'react-native-contacts'
import _ from 'underscore';
let userDataListener = undefined;

export function saveFcmToken(fcmToken) {
  return function (dispatch, getState) {
    dispatch({
      type: 'fcmToken',
      fcmToken
    });
  }
}

export function logout(fcmToken) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {
      dispatch({ type: 'userLogout' });
      resolve();
    })
  }
}

export function registerUser(signupData) {
  return function (dispatch, getState) {
    return new Promise(async (resolve, reject) => {

      const fcmToken = getState().user && getState().user.fcmToken;

      signupData['fcmToken'] = fcmToken;
      signupData['timeZone'] = moment.tz.guess();
      signupData['aboutMe'] = 'Using MyWhatsApp!'
      signupData['allAboutMe'] = ['Using MyWhatsApp!','At Work!','Available','Busy','In a meeting','Urgent calls only'];

      let userData = await firestore.collection('users').where('mobileNo', '==', signupData.mobileNo).get();

      if (!userData.docs.length) {
        let userImage = null;

        let newUserData = await firestore.collection('users').add(signupData);
        let userId = newUserData.id;

        if (signupData.hasProfileImage && signupData.imagePath) {
          let storageRef = firebase.storage().ref().child(`userImages/${userId}.jpg`);
          await storageRef.putFile(signupData.imagePath);
          userImage = await storageRef.getDownloadURL();
          firestore.collection('users').doc(userId).update({ profilePic: userImage, userId })
        } else {
          firestore.collection('users').doc(userId).update({ userId })
        }

        delete signupData.imagePath;

        dispatch({
          type: 'userRegistered',
          subtype: 'success',
          userData: { userId, ...signupData, profilePic: userImage },
        });
        resolve()
      } else {

        dispatch({
          type: 'userRegistered',
          subtype: 'success',
          userData: { ...userData.docs[0].data() },
        });
        resolve()
      }

    })
  }
}

export function changeUserName(userName) {
  return function (dispatch, getState) {
    let userData = getState().user.userData;
    firestore.collection('users').doc(userData.userId).update({ userName });
    dispatch({
      type: 'updateUserData',
      userData: { ...userData, userName }
    })
  }
}

export function changeProfilePicture(imagePath) {
  return async function (dispatch, getState) {
    let userData = getState().user.userData;

    dispatch({ 
      type:'userImageUpdate',
      userImageUpdateStatus:false,
      userImageUpdateText:'Uploading...' 
    });

    let storageRef = firebase.storage().ref().child(`userImages/${userData.userId}.jpg`);
    await storageRef.putFile(imagePath);
    userImage = await storageRef.getDownloadURL();
    firestore.collection('users').doc(userData.userId).update({ profilePic: userImage})

    dispatch({
      type: 'updateUserData',
      userData: { ...userData, profilePic:userImage }
    });

    dispatch({ 
      type:'userImageUpdate',
      userImageUpdateStatus:true,
      userImageUpdateText:'Image Uploaded Successfully.' 
    });
  }
}

export function removeProfilePic() {
  return function (dispatch, getState) {
    let userData = getState().user.userData;
    firestore.collection('users').doc(userData.userId).update({ profilePic:'' });
    dispatch({
      type: 'updateUserData',
      userData: { ...userData, profilePic:'' }
    })
  }
}

export function changeAboutMe(aboutMe) {
  return function (dispatch, getState) {
    let userData = getState().user.userData;

    let oldAboutMe = [...userData.allAboutMe];
    oldAboutMe.push(aboutMe.trim());
    let allAboutMe = [...new Set(oldAboutMe)];

    firestore.collection('users').doc(userData.userId).update({ aboutMe:aboutMe.trim(),allAboutMe });
    dispatch({
      type: 'updateUserData',
      userData: { ...userData, aboutMe }
    })
  }
}

export function registerOnChangeData(aboutMe) {
  return function (dispatch, getState) {
    let userData = getState().user.userData;
    if(!userDataListener){
      userDataListener = firestore.collection('users').doc(userData.userId).onSnapshot((userData) => {
        dispatch({
          type: 'updateUserData',
          userData: { ...userData.data() }
        })
      })
    }
  }
}

export function contact(forceUpdate = false) {
  return async function (dispatch, getState) {
    let userContacts = getState().user && getState().user.allContacts;
    if (!userContacts || forceUpdate) {
      Contacts.getAll(async (err, allContacts) => {

        let resContacts = [...allContacts];
        if (resContacts && resContacts.length) {

          let newCont = {}, appContacts = [];

          let myProfileData = getState().user.userData;
          let myCountryCode = myProfileData.countryCode;

          let requests = resContacts.map((contact) => {
            return new Promise(async (resolve) => {
              let phoneNumbers = contact.phoneNumbers;
              let user = await checkUser(phoneNumbers, myCountryCode);
              if (user) {
                delete contact['thumbnailPath'];
                contact['phoneNumbers'] = [user.defaultNo];
                user['savedName'] = (contact.givenName || '') +' '+(contact.familyName||'');
                contact = {...contact,...user};
                
                newCont[user.userID] = contact;
                appContacts.push(user)
                resolve()
              }
              else {
                const key = phoneNumbers[0] && phoneNumbers[0].number.replace(/[^0-9]/g, "");
                if (key)
                  newCont[key] = contact;
                resolve()
              }
            })
          });

          await Promise.all(requests);

          let sortedContacts = _.sortBy(appContacts, (k) => { return (k.savedName || k.userName).toLowerCase() });

          dispatch({
            type: 'contact',
            val: newCont
          });
          dispatch({
            type: 'appContacts',
            val: sortedContacts
          });

        }
      })
    }

  }
}

async function checkUser(phoneNumbers, myCountryCode) {
  let finalData;
  const user = phoneNumbers.map(k => (async () => {
    const number = k.number.replace(`+${myCountryCode}`, '').replace(/\D/g, '');
    const snapshot = await firestore.collection('users').where('mobileNo', '==', number).get();
    if (snapshot.docs.length > 0) {
      let userData = snapshot.docs[0].data();
      finalData = { ...userData, userID: snapshot.docs[0].id, defaultNo: k };
    }
  })())
  await Promise.all(user);
  return finalData
}