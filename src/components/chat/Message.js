import React, { PureComponent } from 'react';
import { KeyboardAvoidingView, View, Text, VirtualizedList, Dimensions, Image, StyleSheet, TouchableOpacity, TextInput, Keyboard, SafeAreaView } from 'react-native';
import _ from 'underscore';
import moment from 'moment-timezone';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from './../../actions/userActions';
import * as chatActions from './../../actions/chatActions';

const WIDTH = Dimensions.get('window').width;

class Message extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            userId: props.userData.userId
        }
        this.toUserData = props.toUserData;
    }

    render() {
        const { message, prevMsg, isFirst } = this.props;
        let showDate = false;

        let msgDate = moment(message.msgTime).format('DD/MM');
        let prevMsgDate = prevMsg && moment(prevMsg.msgTime).format('DD/MM');

        if (isFirst || (prevMsg && msgDate != prevMsgDate)) { //this is the first message or prevDate != currentDate
            showDate = true;
        }

        // if (!data.readBy || data.readBy.indexOf(this.state.userId) < 0) {
        //     this.props.userChatAction.readMessage(this.state.userId, this.state.selectedUser.userId, data.chatKey, data.readBy || []);
        // }

        return (
            <View style={{ paddingVertical: 5 }}>
                {
                    showDate &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#c2d3daf2', width: 80, borderRadius: 5, paddingVertical: 5, alignItems: 'center' }} >
                            <Text style={{ textAlign: 'center', color: '#455a64f2' }}>{msgDate}</Text>
                        </View>
                    </View>
                }
                {
                    message.senderID == this.state.userId ?
                        <TouchableOpacity style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }} activeOpacity={1} disabled={message.isDeleted}>

                            <View style={{ paddingVertical: 7, paddingHorizontal: 10, backgroundColor: '#dcf8c6', borderRadius: 10, borderTopRightRadius: 0, minWidth: 100, maxWidth: WIDTH / 1.3 }}>

                                <Text style={{ borderRadius: 20, fontSize: 14, textAlign: 'left', color: '#262626', alignSelf: 'flex-start' }}>
                                    {message.msg}
                                </Text>

                                <Text style={{ color: '#79886d', fontSize: 11, marginLeft: 10, textAlign: 'right' }}>
                                    {message.isEdited && !message.isDeleted && `(edited)`}
                                    {moment(message.msgTime).format('hh:mm A')}
                                    {` `}
                                    {
                                        message.readBy && message.readBy.indexOf(this.toUserData.userId) >= 0 ?
                                            <MaterialCommunityIcons name={'check-all'} color={'#4fc3f7'} size={15} />
                                            :
                                            <MaterialCommunityIcons color={'grey'} name={'check'} size={15} />
                                    }
                                </Text>

                            </View>

                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }} activeOpacity={1} disabled={message.isDeleted}>

                            <View style={{ paddingVertical: 7, paddingHorizontal: 10, backgroundColor: '#fff', borderRadius: 10, borderTopLeftRadius: 0, minWidth: 100, maxWidth: WIDTH / 1.3 }}>

                                <Text style={{ borderRadius: 20, fontSize: 14, textAlign: 'left', color: '#262626', alignSelf: 'flex-start' }}>
                                    {message.msg}
                                </Text>
                                <Text style={{ color: '#79886d', fontSize: 11,marginLeft: 15,textAlign: 'right' }}>
                                    {moment(message.msgTime).format('hh:mm A')}
                                </Text>

                            </View>

                        </TouchableOpacity>
                }
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.user.userData,
        userChatData: state.Chat.userChatData
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        chatAction: bindActionCreators(chatActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
