import firebase from 'react-native-firebase';
const firestore = firebase.firestore();
import _ from 'underscore';
let chatListener;

export function sentChatMsg(chatObj, toUserID, selectedImages = []) {
    return async function (dispatch, getState) {
        return new Promise(async (resolve, reject) => {
            let loginUserId = getState().user.userData.userId;
            let userIDUrl = (loginUserId < toUserID) ? (loginUserId + '_' + toUserID) : (toUserID + '_' + loginUserId);
            let oldunReedCount = 0;

            let initRef = await firestore.collection('chat_init').doc(toUserID).get();
            if (initRef.exists) {
                oldunReedCount = initRef.data()[loginUserId] && initRef.data()[loginUserId].unReedCount || 0;
            }

            //initiate chat for the list on home page
            firestore.collection(`chat_init`).doc(loginUserId).set({ [toUserID]: { showReadBy: true, lastMsgType: chatObj.msgType, lastMsg: chatObj.msg, readBy: false, msgTime: chatObj.msgTime, imgUrl: chatObj.imgUrl } }, { merge: true }).then((d) => console.log);

            firestore.collection(`chat_init`).doc(toUserID).set({ [loginUserId]: { showReadBy: false, lastMsgType: chatObj.msgType, unReedCount: oldunReedCount + 1, lastMsg: chatObj.msg, readBy: false, msgTime: chatObj.msgTime, imgUrl: chatObj.imgUrl } }, { merge: true }).then((d) => console.log);

            firestore.collection('chat').doc('ChatCollections').collection(userIDUrl).add(chatObj);

        })

    }
}

export function resetReadData(userID) {
    return function (dispatch, getState) {
        let loginUserId = getState().user.userData.userId;
        firestore.collection('chat_init').doc(loginUserId).set({ [userID]: { unReedCount: 0 } }, { merge: true });
        firestore.collection('chat_init').doc(userID).set({ [loginUserId]: { readBy: true } }, { merge: true });
    }
}

export function getAllChats() {
    return function (dispatch, getState) {
        return new Promise(async (resolve, rejects) => {
            let userId = getState().user.userData.userId;
            firestore.collection('chat_init').doc(userId).onSnapshot((chatUserData) => {
                if (!chatUserData.exists) {
                    dispatch({
                        type: 'ChatUsers',
                        ChatUsers: [],
                        subtype: 'success'
                    });
                    resolve([])
                } else {
                    let chatUsers = chatUserData.data();
                    let chatUserKeys = Object.keys(chatUsers);
                    let chatUserValues = Object.values(chatUsers);
                    let chatUserRequests = chatUserKeys.map((userID, index) => {
                        return new Promise(async (resolve) => {
                            const snapshot = await firestore.collection('users').doc(userID).get()
                            const value = snapshot.data()
                            resolve({ ...chatUserValues[index], ...value, userId: userID });
                        });
                    });
                    Promise.all(chatUserRequests).then((allChatUsers) => {
                        console.log("allChat users => ", allChatUsers)
                        dispatch({
                            type: 'ChatUsers',
                            ChatUsers: allChatUsers,
                            subtype: 'success'
                        });
                        resolve(allChatUsers)
                    })
                }
            });

        })
    }
}

export function getUserMsg(userID) {
    return async function (dispatch, getState) {
        let loginUserId = getState().user.userData.userId;
        if (chatListener) {
            chatListener()
        }
        let userIDUrl = (loginUserId < userID) ? (loginUserId + '_' + userID) : (userID + '_' + loginUserId);
        let query = firestore.collection('chat').doc('ChatCollections').collection(userIDUrl);
        query.orderBy('msgTime', 'desc').limit(50).get().then((snapshots) => {
            start = snapshots.docs[snapshots.docs.length - 1];
            chatListener = query.orderBy('msgTime').startAt(start).onSnapshot((chatDocs) => {
                if (chatDocs.docs) {
                    let data = [];
                    chatDocs.forEach(chat => {
                        data.push({ ...chat.data(), chatKey: chat.id })
                    });
                    let oldChatData = getState().Chat.userChatData || [];
                    let chatData = _.uniq([...data], (chat) => { return chat.chatKey })
                    dispatch({
                        type: 'userChatData',
                        userChatData: { ...oldChatData, [userID]: chatData },
                        subtype: 'success'
                    })

                } else {
                    dispatch({
                        type: 'userChatData',
                        userChatData: [],
                        subtype: 'success'
                    })
                }
            })
        });
    }
}