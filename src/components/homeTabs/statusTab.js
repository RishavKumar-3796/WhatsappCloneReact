import React from 'react';
import {
    View,
    Image,
    Text,
    ListView,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from './../../appConfig/color';

class StatusTab extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={{ flex: 1 }} >

                <ScrollView showsVerticalScrollIndicator={false}>

                    <TouchableOpacity activeOpacity={0.5}>
                        <View style={styles.row}>
                            <View>
                                <Image source={require("./../../assets/users/tony.jpg")} style={styles.pic} />
                                <View style={styles.addNewStatusIcon}>
                                    <Icon name={'plus'} color={'white'} size={13} style={{ fontWeight: 'bold' }} />
                                </View>
                            </View>
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameTxt}> My Status </Text>
                                <Text style={styles.info}>Tap to add status update</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Recent updates */}
                    <View style={{}}>
                        <View style={styles.statusHeader}>
                            <Text style={{ color: '#727272' }}>Recent updates</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.5}>
                            <View style={styles.row}>
                                <View style={[styles.statusBorder, { borderColor: colors.themeColor }]}>
                                    <Image source={require(`./../../assets/users/natasha.jpg`)} style={styles.pic} />
                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameTxt}> Natasha Romanoff </Text>
                                    <Text style={styles.info}>10 minutes ago</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5}>
                            <View style={styles.row}>
                                <View style={[styles.statusBorder, { borderColor: colors.themeColor }]}>
                                    <Image source={require(`./../../assets/users/panther.jpg`)} style={styles.pic} />
                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameTxt}> Black Panther </Text>
                                    <Text style={styles.info}>15 minutes ago</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5}>
                            <View style={styles.row}>
                                <View style={[styles.statusBorder, { borderColor: colors.themeColor }]}>
                                    <Image source={require(`./../../assets/users/thanos.jpg`)} style={styles.pic} />
                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameTxt}> Thanos </Text>
                                    <Text style={styles.info}>20 minutes ago</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5}>
                            <View style={styles.row}>
                                <View style={[styles.statusBorder, { borderColor: colors.themeColor }]}>
                                    <Image source={require(`./../../assets/users/hulk.jpg`)} style={styles.pic} />
                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameTxt}> Hulk </Text>
                                    <Text style={styles.info}>30 minutes ago</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Viewed updates */}
                    <View style={{}}>
                        <View style={styles.statusHeader}>
                            <Text style={{ color: '#727272' }}>Viewed updates</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.5}>
                            <View style={styles.row}>
                                <View style={[styles.statusBorder, { borderColor: colors.unseenStatusBorderColor }]}>
                                    <Image source={require(`./../../assets/users/thor.jpg`)} style={styles.pic} />
                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameTxt}> Thor </Text>
                                    <Text style={styles.info}>2 minutes ago</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5}>
                            <View style={styles.row}>
                                <View style={[styles.statusBorder, { borderColor: colors.unseenStatusBorderColor }]}>
                                    <Image source={require(`./../../assets/users/captain_marvel.jpg`)} style={styles.pic} />
                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameTxt}> Captain Marvel </Text>
                                    <Text style={styles.info}>6 minutes ago</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5}>
                            <View style={styles.row}>
                                <View style={[styles.statusBorder, { borderColor: colors.unseenStatusBorderColor }]}>
                                    <Image source={require(`./../../assets/users/nick.jpg`)} style={styles.pic} />
                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameTxt}> Nick Fury </Text>
                                    <Text style={styles.info}>10 minutes ago</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5}>
                            <View style={styles.row}>
                                <View style={[styles.statusBorder, { borderColor: colors.unseenStatusBorderColor }]}>
                                    <Image source={require(`./../../assets/users/vision.jpg`)} style={styles.pic} />
                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameTxt}> Vision </Text>
                                    <Text style={styles.info}>20 minutes ago</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    </View>

                </ScrollView>


                <TouchableOpacity style={styles.textStatusButton} activeOpacity={0.5}>
                    <MaterialCommunityIcons color={colors.themeColor} name={'pencil'} size={22} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.cameraButton} activeOpacity={0.5} >
                    <MaterialCommunityIcons color={'white'} name={'camera'} size={25} />
                </TouchableOpacity>

            </View>
        )
    }
}

export default StatusTab;


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#eee',
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'flex-start',
    },
    statusHeader: {
        backgroundColor: '#f4f4f4',
        padding: 5,
        paddingLeft: 20,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    addNewStatusIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: colors.themeColor,
        bottom: 0,
        right: 0,
    },
    pic: {
        borderRadius: 30,
        width: 60,
        height: 60,
    },
    statusBorder: {
        borderWidth: 2.5,
        padding: 1,
        borderRadius: 35
    },
    nameContainer: {
        justifyContent: 'space-between',
    },
    nameTxt: {
        marginLeft: 15,
        fontWeight: '600',
        color: '#222',
        fontSize: 15,
    },
    info: {
        fontWeight: '400',
        color: '#666',
        fontSize: 15,
        marginLeft: 15,
    },
    cameraButton: {
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
    textStatusButton: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: '#edf5f7',
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
});