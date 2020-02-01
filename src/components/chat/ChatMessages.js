import React, { PureComponent } from 'react';
import { KeyboardAvoidingView, ListView, Text, VirtualizedList, Dimensions, FlatList, StyleSheet, TouchableOpacity, TextInput, Keyboard, SafeAreaView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import InvertibleScrollView from 'react-native-invertible-scroll-view';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from './../../actions/userActions';
import * as chatActions from './../../actions/chatActions';

import Message from './Message';

import _ from 'underscore';
import { ScrollView } from 'react-native-gesture-handler';

class ChatMessages extends PureComponent {

    constructor(props) {
        super(props);
        let { userData } = props.navigation.state.params;
        this.state = {
            data: [],
            chatData: props.userChatData[userData.userID] || [],
        }
        this.toUserData = props.navigation.state.params.userData;
    }

    componentWillMount() {
        let { userData } = this.props.navigation.state.params;
        if (userData) {
            this.props.chatAction.getUserMsg(userData.userID);
        }

    }

    componentWillReceiveProps(nextProps) {
        let { userData } = this.props.navigation.state.params;
        if (nextProps.userChatData && nextProps.userChatData[userData.userID].length > 0) {
            // this.resetReadData(this.state.userID, this.state.selectedUser.userID);
            this.setState({ chatData: nextProps.userChatData[userData.userID] }, () => {
                // this.messageList.scrollToEnd();
            });
        }
    }

    getMoreMessage() {
        // this.props.userChatAction.getMoreMessages(this.state.selectedUser.userID)
    }

    render() {
        const chatData = _.sortBy(this.state.chatData, (k) => { return k.msgTime });
        return (
            // <KeyboardAvoidingView behavior={Platform.OS === 'android' ? null : 'padding'} enabled style={{flex:1}}>

            // <VirtualizedList
            //     data={chatData.reverse()}
            //     inverted={true}
            //     // data={chatData}
            //     renderItem={({ item, index }) => <Message key={`message${item.key}`} message={item} isFirst={index == chatData.length-1} prevMsg={chatData[index-1]} />}
            //     onEndReached={() => this.getMoreMessage()}
            //     ref={listRef => { this.messageList = listRef; }}
            //     windowSize={30}
            //     keyExtractor={(item, index) => item.key}
            //     // initialScrollIndex={10}
            //     getItem={(data, index) => data[index]}
            //     style={{ paddingHorizontal: 10,flex:1 }}
            //     getItemCount={data => data.length}
            //     onEndReachedThreshold={0.5}
            //     progressViewOffset={300} //android support
            //     maxToRenderPerBatch={20}
            //     initialNumToRender={20}
            //     getItemLayout={(data, index) => (
            //         { length: 100, offset: 100 * index, index }
            //     )}
            // />
            // </KeyboardAvoidingView>
            <KeyboardAvoidingView behavior={Platform.OS === 'android' ? null : 'padding'} style={{ flex: 1 }}>
                <VirtualizedList
                    data={chatData.reverse()}
                    inverted={true}
                    renderItem={({ item, index }) => (
                        <Message
                            key={`message${item.key}`}
                            message={item}
                            isFirst={index == chatData.length - 1}
                            prevMsg={chatData[index + 1]}
                            toUserData={this.toUserData}
                        />
                    )}
                    ref={reff => { this.messageList = reff; }}
                    windowSize={30}
                    keyExtractor={(item, index) => item.key}
                    getItem={(data, index) => data[index]}
                    style={{ paddingHorizontal: 10 }}
                    getItemCount={data => data.length}
                    onEndReachedThreshold={0.5}
                    progressViewOffset={300} //android support
                    maxToRenderPerBatch={20}
                    initialNumToRender={20}
                    getItemLayout={(data, index) => (
                        { length: 100, offset: 100 * index, index }
                    )}
                />
            </KeyboardAvoidingView>
        )
    }
}

function mapStateToProps(state) {
    return {
        userChatData: state.Chat.userChatData
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        chatAction: bindActionCreators(chatActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessages);
