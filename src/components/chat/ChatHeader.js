import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'underscore';
import colors from './../../appConfig/color'
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment-timezone';

import firebase from 'react-native-firebase';
const firestore = firebase.firestore();

export default class ChatHeader extends Component {

    constructor(props) {
        super(props);
        this.userDataListener = null;
        this.state={
            isOnline:false,
            lastSeen:null
        }
    }

    componentWillMount(){
        let {userData} = this.props.navigation.state.params;
        if(userData){
            this.getUserData(userData.userID);
        }
    }

    getUserData(userID) {
        this.userDataListener = firestore.collection('users').doc(userID).onSnapshot((userDoc)=>{
            let userData = userDoc.data();
            this.setState({ userData,isOnline: userData.isOnline, lastSeen: userData.lastSeen })
        });
    }

    componentWillUnmount(){
        if(this.userDataListener){
            this.userDataListener();
        }
    }

    render() {
        let { userData } = this.props.navigation.state.params;
        let userImage = userData.profilePic ? { uri: userData.profilePic } : require('./../../assets/user.png');

        let headerText = this.state.isOnline ? 'Online' : this.state.lastSeen ? `last seen ${moment(this.state.lastSeen).calendar()}`:false;

        return (
            <SafeAreaView style={styles.header}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name={'md-arrow-back'} color='white' size={30} />
                        <Image source={userImage} style={styles.pic} />
                    </TouchableOpacity>
                    <View style={{justifyContent:'center',alignItems:'flex-start'}}>
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: '400' }}>{userData.savedName || userData.userName}</Text>
                        {
                            headerText &&
                            <Text style={{ fontSize: 12, color: 'white' }}>{headerText}</Text>
                        }
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Icon onPress={() => alert('Coming soon in next release')}
                        name="videocam" size={25} color="white"
                        style={{ marginRight: 15 }}
                    />
                    <Icon onPress={() => alert('Coming soon in next release')}
                        name="call" size={25} color="white"
                        style={{ marginRight: 15 }}
                    />
                    <Icon
                        name="more-vert" size={25} color="white"
                    />
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: colors.themeColor,
        height: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        flexDirection: 'row'
    },
    userInfo: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pic: {
        borderRadius: 20,
        width: 40,
        height: 40,
        marginLeft: 5,
        marginRight: 10
    },
})
