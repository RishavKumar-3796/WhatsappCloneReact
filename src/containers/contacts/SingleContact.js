import React, { PureComponent } from 'react';
import { View, Text, StatusBar, VirtualizedList, Dimensions, Image, StyleSheet, TouchableOpacity, TextInput, Keyboard, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'underscore';
import colors from './../../appConfig/color';
import UserPlaceholder from '../../components/UserPlaceholder';

export default class SingleContact extends PureComponent {

    constructor() {
        super();
    }

    render() {
        let {contact} = this.props;
        let userImage = contact.profilePic ? {uri:contact.profilePic} : require('./../../assets/user.png');
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.navigate('UserChat',{userData:contact})}>
                <View style={styles.row}>
                    <UserPlaceholder source={userImage} style={styles.pic} borderRadius={20} placeholderStyle={styles.pic}/>
                    <View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.nameTxt}>{contact && contact.savedName || contact.userName}</Text>
                        </View>
                        <View style={styles.msgContainer}>
                            <Text numberOfLines={1} style={styles.msgTxt}>{contact.aboutMe}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    pic: {
        borderRadius: 20,
        width: 40,
        height: 40,
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
        maxWidth:'90%'
    },
})
