import { combineReducers } from 'redux';
import user from './user';
import Chat from './chat';

const appReducer = combineReducers({
  user,
  Chat
});

const rootReducer = (state = {}, action) => {
   return appReducer(state, action);
};

export default rootReducer;
