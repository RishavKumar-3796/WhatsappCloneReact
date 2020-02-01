import React from 'react';
import {
    View,
    ListView,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from './../../appConfig/color';
import * as helpers from './../../helpers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from './../../actions/userActions';
import * as chatActions from './../../actions/chatActions';
import { thisExpression } from '@babel/types';

class ChatTab extends React.PureComponent {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state={
            chatUsers:props.chatUsers || []
        }
    }

    componentWillMount() {
        this.props.chatAction.getAllChats();
    }

    componentWillReceiveProps(nextProps){
        if(!helpers.isEqual(this.props.chatUsers,nextProps.chatUsers)){
            this.setState({ chatUsers:nextProps.chatUsers })
        }
    }

    openContacts() {
        this.props.navigation.navigate('ContactList');
    }

    renderRow(props) {
        const { allContacts } = this.props;
        let userImage = props.profilePic ? { uri: props.profilePic } : require('./../../assets/user.png');

        let userChatData = allContacts && allContacts[props.userId];

        const profileName = userChatData && `${userChatData.givenName || ''} ${userChatData.familyName || ''}` || props.mobileNo;
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.navigate('UserChat', { userData: userChatData })}>
                <View style={styles.row}>
                    <Image source={userImage} style={styles.pic} />
                    <View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.nameTxt}>{profileName}</Text>
                            <Text style={[styles.time, { color: props.unReedCount > 0 ? colors.themeColor : '#777' }]}>{props.time}</Text>
                        </View>
                        <View style={styles.msgContainer}>
                            {
                                props.lastMsgType == 'text' ?
                                    <Text style={styles.msgTxt}>
                                        {
                                            props.showReadBy ?
                                                props.readBy ?
                                                    <MaterialCommunityIcons name={'check-all'} size={15} color={"#34b7f1"} style={{ marginRight: 5 }} />
                                                    :
                                                    <MaterialCommunityIcons name={'check'} size={15} color={colors.lightgray} style={{ marginRight: 5 }} />
                                                :
                                                null
                                        }
                                        {props.lastMsg}
                                    </Text>
                                    :
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.msgTxt}>
                                        {
                                            props.showReadBy ?
                                                props.readBy ?
                                                    <MaterialCommunityIcons style={{ marginRight: 5 }} name={'check-all'} color={'#2d89e6'} size={15} />
                                                    :
                                                    <MaterialCommunityIcons style={{ marginRight: 5 }} color={'#aaa'} name={'check'} size={15} />
                                                :
                                                null
                                        }
                                        <MaterialCommunityIcons name={'camera'} size={15} />
                                        {' Photo'}
                                    </Text>
                            }
                            {
                                props.unReedCount > 0 ?
                                    <View style={{ height: 20, width: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.themeColor, borderRadius: 10 }}>
                                        <Text style={{ textAlign: 'center', lineHeight: 20, color: 'white', fontSize: 12 }}>{props.unReedCount}</Text>
                                    </View>
                                    :
                                    null
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {

        return (
            <View style={{ flex: 1 }} >
                <ListView
                    dataSource={this.ds.cloneWithRows(this.state.chatUsers || [])}
                    renderRow={props => (
                        this.renderRow(props)
                    )}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                />
                <TouchableOpacity style={styles.textStatusButton} onPress={() => this.openContacts()} activeOpacity={0.5}>
                    <MaterialIcons color={'white'} name={'chat'} size={22} />
                </TouchableOpacity>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.user.userData,
        appContacts: state.user.appContacts,
        allContacts: state.user.allContacts,
        chatUsers: state.Chat.ChatUsers
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        chatAction: bindActionCreators(chatActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatTab);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#f7f7f7',
        borderBottomWidth: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    pic: {
        borderRadius: 30,
        width: 60,
        height: 60,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 280,
    },
    nameTxt: {
        marginLeft: 15,
        fontWeight: '600',
        color: '#222',
        fontSize: 15,
    },
    time: {
        fontWeight: '200',
        fontSize: 13,
    },
    msgContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    msgTxt: {
        fontWeight: '400',
        color: '#666',
        fontSize: 12,
        marginLeft: 15,
    },
    textStatusButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: colors.themeColor,
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
});
