const initialState = {
};

export default function user(state =initialState, action = {} ) {
  switch (action.type) {
    case 'userRegistered': {
      return {
        ...state,
        signupError: action.error ? action.error : null,
        signupSuccess: action.subtype === 'success',
        userData: action.subtype === 'success' ? action.userData : state.userData
      }
    };
    case 'userLogout': {
      return {
        ...state,
        userData: {}
      }
    };
    case 'fcmToken': {
      return {
        ...state,
        fcmToken: action.fcmToken || state.fcmToken
      }
    };
    case 'contact': {
      return {
        ...state,
        allContacts: action.val,
      }
    };
    case 'appContacts': {
      return {
        ...state,
        appContacts: action.val,
      }
    };
    case 'updateUserData': {
      return {
        ...state,
        userData: action.userData,
      }
    };
    case 'userImageUpdate': {
      return {
        ...state,
        userImageUpdateStatus: action.userImageUpdateStatus,
        userImageUpdateText: action.userImageUpdateText
      }
    };

    default:
      return state;
  }
}
