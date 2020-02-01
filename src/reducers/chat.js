export default function Chat(state = {}, action = {}) {
    switch (action.type) {
        case 'ChatList': {
            return {
                ...state,
                random: Math.random(),
                ChatList: action.subtype == 'success' ? action.ChatList : state.ChatList,
            }
        };
        case 'ChatUsers': {
            return {
                ...state,
                ChatUsers: action.subtype == 'success' ? action.ChatUsers : state.ChatUsers
            }
        };
        case 'userChatSelected': {
            return {
                ...state,
                selectedUserChatID: action.selectedUserChatID
            }
        };
        case 'userChatData': {
            return {
                ...state,
                random: Math.random(),
                userChatData: action.subtype == 'success' ? action.userChatData : state.userChatData
            }
        };
        default:
            return state;
    }
}
