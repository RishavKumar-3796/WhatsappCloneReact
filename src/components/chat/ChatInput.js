import React, { Component } from 'react';
import { View, Dimensions, Image, StyleSheet, TouchableOpacity, TextInput, Text, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import _ from 'underscore';
import colors from './../../appConfig/color'
import Dialog, { FadeAnimation, DialogContent } from 'react-native-popup-dialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as chatActions from './../../actions/chatActions';

const { width, height } = Dimensions.get('window');
class ChatInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageLoader: false,
            msg: '',
            editedMsg: false,
            showImagesModal: false,
            selectedImagePath: [],
            selectedImages: [],
            disabledSend: false,
            showFileTypeSelector: false
        }
        this.msgInput = null;
        this.toUserData = props.navigation.state.params.userData;
    }

    showFileTypeSelector() {
        this.msgInput.blur()
        this.setState({ showFileTypeSelector: true })
    }

    msgChanged(msg) {
        this.setState({ msg: msg })
    }

    sendMessage() {
        if (!this.state.msg.trim() && this.state.selectedImages.length == 0) return;

        let { userData } = this.props;
        if (this.state.editedMsg) {
            this.props.userChatAction.updateMsg(encrypt(this.state.msg.trim()), this.props.selectedUser.userId, this.props.selectedMsg.chatKey);
            this.closeEdit()
        } else {
            const { replayMsg } = this.props;
            var chatObj = {
                senderID: userData.userId,
                senderName: userData.userName,
                msg: this.state.msg.trim(),
                msgType: 'text',
                imgUrl: '',
                msgTime: +new Date(),
                readBy: [userData.userId],
                replayMsg: replayMsg ? { senderID: replayMsg.senderID, senderName: replayMsg.senderName, msg: replayMsg.msg, msgType: replayMsg.msgType, imgUrl: replayMsg.imgUrl, chatKey: replayMsg.chatKey } : null
            };
            this.props.chatAction.sentChatMsg(chatObj, this.toUserData.userId, this.state.selectedImages);
        }
        this.setState({ imageLoader: false, msg: '', selectedImagePath: [], disabledSend: false })
    }

    render() {
        let msg = this.state.msg.trim();
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}>
                <View style={[styles.input, { height: this.state.height, width: msg != '' ? width - 70 : width - 20, marginRight: msg != '' ? 10 : 0 }]}>

                    <TouchableOpacity activeOpacity={0.5} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons color={colors.darkgray} name={'emoticon-excited-outline'} size={25} />
                    </TouchableOpacity>
                    <TextInput
                        style={{ flex: 1, borderRadius: 20, paddingLeft: 10, fontSize: 18, height: this.state.height || 44 }}
                        value={this.state.msg}
                        ref={(e) => { this.msgInput = e; }}
                        onChangeText={msg => this.msgChanged(msg)}
                        blurOnSubmit={false}
                        onSubmitEditing={() => this.send()}
                        placeholder="Type a message"
                        returnKeyType="send"
                        multiline={true}
                        onContentSizeChange={(event) => {
                            this.setState({ height: Math.min(120, event.nativeEvent.contentSize.height) })
                        }}
                    />

                    <TouchableOpacity onPress={() => this.showFileTypeSelector()} activeOpacity={0.5} style={{ justifyContent: 'center', alignItems: 'center', paddingRight: 15 }}>
                        <Entypo color={colors.darkgray} name={'attachment'} size={25} />
                    </TouchableOpacity>

                    {
                        msg == '' &&
                        <TouchableOpacity activeOpacity={0.5} style={{ justifyContent: 'center', alignItems: 'center', paddingRight: 15 }}>
                            <MaterialCommunityIcons color={colors.darkgray} name={'camera'} size={25} />
                        </TouchableOpacity>
                    }

                </View>

                {
                    msg != '' &&
                    <TouchableOpacity onPress={() => this.sendMessage()} style={styles.sendMessageButton} activeOpacity={0.5}>
                        <MaterialCommunityIcons color={'white'} name={'send'} size={22} />
                    </TouchableOpacity>
                }

                <Dialog
                    rounded={false}
                    hasOverlay={false}
                    visible={this.state.showFileTypeSelector}
                    animationDuration={1}
                    onTouchOutside={() => {
                        this.setState({ showFileTypeSelector: false });
                    }}
                    dialogAnimation={new FadeAnimation({
                        initialValue: 0, // optional
                        animationDuration: 150, // optional
                        useNativeDriver: true, // optional
                    })}
                    onHardwareBackPress={() => {
                        this.setState({ showFileTypeSelector: false });
                        return true;
                    }}
                    dialogStyle={{ width: width - 20, borderRadius: 10, height: 200, position: 'absolute', bottom: this.state.height + 10 }}
                >
                    <DialogContent style={styles.iconContainer}>

                        <TouchableOpacity style={[styles.flexCenter, styles.fileType]}>
                            <Image source={require('./../../assets/file.png')} style={styles.modalIcon} />
                            <Text>Document</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.flexCenter, styles.fileType]}>
                            <Image source={require('./../../assets/camera.png')} style={styles.modalIcon} />
                            <Text>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.flexCenter, styles.fileType]} onPress={() => this.setState({ showFileTypeSelector: false }, () => this.launchLibrary())}>
                            <Image source={require('./../../assets/gallery.png')} style={styles.modalIcon} />
                            <Text>Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.flexCenter, styles.fileType]} onPress={() => this.setState({ showFileTypeSelector: false }, () => this.launchLibrary())}>
                            <View style={[styles.customIcon, styles.flexCenter, styles.audioColors]}>
                                <MaterialCommunityIcons color={'white'} name={'headphones'} size={25} />
                            </View>
                            <Text>Audio</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.flexCenter, styles.fileType]} onPress={() => this.setState({ showFileTypeSelector: false }, () => this.launchLibrary())}>
                            <View style={[styles.customIcon, styles.flexCenter, styles.locationColors]}>
                                <Entypo color={'white'} name={'location'} size={25} />
                            </View>
                            <Text>Location</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.flexCenter, styles.fileType]} onPress={() => this.setState({ showFileTypeSelector: false }, () => this.launchLibrary())}>
                            <Image source={require('./../../assets/contact.png')} style={styles.modalIcon} />
                            <Text>Contact</Text>
                        </TouchableOpacity>

                    </DialogContent>
                </Dialog>

            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.user.userData,
        ChatUsers: state.Chat.ChatUsers,
        allContacts: state.user.allContacts,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        chatAction: bindActionCreators(chatActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);

const styles = StyleSheet.create({
    container: {
        // flex: 1
    },
    input: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'space-between',
        color: 'black',
        marginVertical: 5,
        borderRadius: 30,
        paddingLeft: 10,
        shadowColor: '#3d3d3d',
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
        },
    },
    modalIcon: {
        height: 56,
        width: 56,
        borderRadius: 30,
        marginHorizontal: 20
    },
    deleteIcon: {
        height: 60,
        width: 60,
        borderRadius: 30,
        margin: 10,
        backgroundColor: '#ff5c33',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        width: width - 20,
        borderRadius: 10,
        flexWrap: 'wrap',
        paddingTop: 5
    },
    fileType: {
        marginVertical: 10
    },
    flexCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    customIcon: {
        height: 56,
        width: 56,
        borderRadius: 35,
        borderWidth: 6,
        marginHorizontal: 20,
    },
    locationColors: {
        borderColor: colors.lightGreen,
        backgroundColor: colors.darkGreen
    },
    audioColors: {
        borderColor: colors.lightOrange,
        backgroundColor: colors.darkOrange
    },
    sendMessageButton: {
        backgroundColor: colors.themeColor,
        height: 44,
        width: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
