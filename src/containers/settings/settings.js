import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Keyboard, Image, Animated, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import PageHeader from '../../components/PageHeader'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import colors from '../../appConfig/color';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../../actions/userActions';

const DEVICE_WIDTH = Dimensions.get('window').width

class SettingsScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            editProfile: false,
            imageSelector: false,
            editDisplayName: false,
            displayName: this.props.userData.userName,
            aboutMe: `This is so cool!! isn't it?`,
            removePhotoConfirmation: false,
            isProfilePicUploading: false
        }
        this.animatedValue = new Animated.Value(0);
        this.animatedImageWidth = new Animated.Value(0);
        this.animatedOpacity = new Animated.Value(0);
        this.editNameInputRef = null;
    }

    onBackPress() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        this.props.actions.registerOnChangeData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.userImageUpdateStatus != nextProps.userImageUpdateStatus) {
            this.setState({ isProfilePicUploading: !nextProps.userImageUpdateStatus })
        }
    }

    animateMyProfile() {
        Animated.parallel([
            Animated.timing(this.animatedValue,
                {
                    toValue: 1, // Animate to final value of 1
                    useNativeDriver: true,
                    duration: 250
                }
            ),
            Animated.timing(this.animatedImageWidth,
                {
                    toValue: 1,
                    duration: 250
                }
            ),
            Animated.timing(this.animatedOpacity,
                {
                    toValue: 1,
                    duration: 100
                }
            )
        ]).start(() => {
            this.setState({
                editProfile: true
            })
        });
    }

    backToSettings() {
        this.setState({
            editProfile: false
        }, () => {
            Animated.parallel([
                Animated.timing(this.animatedValue,
                    {
                        toValue: 0, // Animate to final value of 1
                        useNativeDriver: true,
                        duration: 250
                    }
                ),
                Animated.timing(this.animatedImageWidth,
                    {
                        toValue: 0,
                        duration: 250
                    }
                ),
                Animated.timing(this.animatedOpacity,
                    {
                        toValue: 0,
                        duration: 100
                    }
                )
            ]).start();
        })
    }

    editDisplayName() {
        this.setState({ editDisplayName: true }, () => {
            setTimeout(() => {
                this.editNameInputRef.focus()
            }, 200);
        })
    }

    saveUserName() {
        Keyboard.dismiss();
        this.props.actions.changeUserName(this.state.displayName)
        this.setState({ editDisplayName: false });
    }

    launchLibrary() {

        const options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Gallery' }],
            permissionDenied: {
                title: "Give permission",
                text: "Text",
                reTryTitle: 'reTryTitle',
                okTitle: "okTitle"
            }
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            this.setState({ isImageSelected: true }, () => {
                this.props.actions.changeProfilePicture(response.path);
            });
        });
    }

    removeProfilePic() {
        this.setState({ removePhotoConfirmation: false });
        this.props.actions.removeProfilePic();
    }

    render() {
        let { userData } = this.props;
        const position = {
            transform: [
                {
                    translateX: this.animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [15, (DEVICE_WIDTH / 2 - 70 - 15)]
                    })
                },
                {
                    translateY: this.animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [5, 50]
                    })
                }
            ]
        };

        let imageHeight = this.animatedImageWidth.interpolate({
            inputRange: [0, 1],
            outputRange: [70, 140]
        });

        let opacity = this.animatedOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
        });

        let isEditProfile = this.state.editProfile;

        let userImage = userData.profilePic ? { uri: userData.profilePic } : require('./../../assets/user.png');

        return (
            <KeyboardAvoidingView style={styles.container}>

                <PageHeader title={isEditProfile ? 'Profile' : 'Settings'} onBackPress={() => isEditProfile ? this.backToSettings() : this.onBackPress()} />

                <Animated.View style={[position, styles.row]}>
                    <TouchableOpacity onPress={() => this.animateMyProfile()}>
                        <Animated.Image style={{ height: imageHeight, width: imageHeight, borderRadius: 70 }} source={userImage} />

                        {
                            this.state.editProfile &&
                            <TouchableOpacity disabled={this.state.isProfilePicUploading} onPress={() => this.setState({ imageSelector: true })} style={{ height: 46, width: 46, backgroundColor: colors.themeColor, borderRadius: 23, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, right: 0 }}>
                                {
                                    this.state.isProfilePicUploading ?
                                        <ActivityIndicator size='large' color={'white'} />
                                        :
                                        <MaterialCommunityIcons style={{}} size={20} name={'camera'} color={'white'} />
                                }
                            </TouchableOpacity>
                        }

                    </TouchableOpacity>
                    <Animated.View style={[styles.nameContainer, { opacity }]}>
                        <Text style={styles.userName}> {userData.userName} </Text>
                        <Text style={styles.statusText}>{userData.aboutMe}</Text>
                    </Animated.View>
                </Animated.View>

                {
                    this.state.editProfile &&
                    <Animatable.View animation={'fadeIn'} delay={0} iterationCount={1} style={{ marginTop: 50, paddingHorizontal: 10 }}>

                        <TouchableOpacity onPress={() => this.editDisplayName()} style={[styles.settingRow, { justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#ddd', paddingHorizontal: 0, paddingVertical: 10 }]}>
                            <MaterialIcons style={styles.settingIcon} size={23} name={'chat'} color={colors.lightThemeColor} />

                            <View style={{ justifyContent: 'space-between', padding: 10, flex: 1 }}>
                                <Text style={{ color: '#888', fontSize: 14 }}>Display Name </Text>
                                <Text style={{ color: 'black', fontSize: 15 }}>{this.state.displayName}</Text>
                            </View>
                            <MaterialCommunityIcons style={styles.settingIcon} size={23} name={'pencil'} color={colors.lightgray} />

                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AboutMe')} style={[styles.settingRow, { justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#ddd', paddingHorizontal: 0, paddingVertical: 10 }]}>
                            <MaterialIcons style={styles.settingIcon} size={23} name={'info-outline'} color={colors.lightThemeColor} />

                            <View style={{ justifyContent: 'space-between', padding: 10, flex: 1 }}>
                                <Text style={{ color: '#888', fontSize: 14 }}>About </Text>
                                <Text style={{ color: 'black', fontSize: 15 }}>{userData.aboutMe}</Text>
                            </View>
                            <MaterialCommunityIcons style={styles.settingIcon} size={23} name={'pencil'} color={colors.lightgray} />
                        </TouchableOpacity>

                        <View style={[styles.settingRow, { justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#ddd', paddingHorizontal: 0, paddingVertical: 10 }]}>
                            <MaterialIcons style={styles.settingIcon} size={23} name={'phone'} color={colors.lightThemeColor} />
                            <View style={{ justifyContent: 'space-between', padding: 10, flex: 1 }}>
                                <Text style={{ color: '#888', fontSize: 14 }}>Phone </Text>
                                <Text style={{ color: 'black', fontSize: 15 }}>+91 95745 89874</Text>
                            </View>
                        </View>
                    </Animatable.View>
                }

                <Animated.View style={{ opacity }}>
                    <View style={[styles.settingRow, styles.accountSettings]}>
                        <MaterialCommunityIcons style={styles.settingIcon} size={23} name={'key-variant'} color={colors.lightThemeColor} />
                        <View style={styles.nameContainer}>
                            <Text style={styles.settingKey}> Account </Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.settingInfo}>Privacy, security, change number</Text>
                        </View>
                    </View>
                    <View style={styles.settingRow}>
                        <MaterialIcons style={styles.settingIcon} size={23} name={'chat'} color={colors.lightThemeColor} />
                        <View style={styles.nameContainer}>
                            <Text style={styles.settingKey}> Chats </Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.settingInfo}>Backup, history, wallpaper</Text>
                        </View>
                    </View>
                    <View style={styles.settingRow}>
                        <MaterialCommunityIcons style={styles.settingIcon} size={23} name={'bell'} color={colors.lightThemeColor} />
                        <View style={styles.nameContainer}>
                            <Text style={styles.settingKey}> Notifications </Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.settingInfo}>Message, group & call tones</Text>
                        </View>
                    </View>
                    <View style={styles.settingRow}>
                        <MaterialIcons style={styles.settingIcon} size={23} name={'data-usage'} color={colors.lightThemeColor} />
                        <View style={styles.nameContainer}>
                            <Text style={styles.settingKey}> Notifications </Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.settingInfo}>Message, group & call tones</Text>
                        </View>
                    </View>
                    <View style={styles.settingRow}>
                        <MaterialIcons style={styles.settingIcon} size={23} name={'help-outline'} color={colors.lightThemeColor} />
                        <View style={styles.nameContainer}>
                            <Text style={styles.settingKey}> Help </Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.settingInfo}>FAQ, contact us, privacy policy</Text>
                        </View>
                    </View>
                    <View style={styles.inviteRow}>
                        <MaterialIcons style={styles.settingIcon} size={23} name={'person'} color={colors.lightThemeColor} />
                        <View style={styles.nameContainer}>
                            <Text style={styles.settingKey}> Invite a friend </Text>
                        </View>
                    </View>
                </Animated.View>

                <Dialog
                    rounded={false}
                    visible={this.state.imageSelector}
                    onTouchOutside={() => {
                        this.setState({ imageSelector: false });
                    }}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    onHardwareBackPress={() => {
                        this.setState({ imageSelector: false });
                        return true;
                    }}
                    dialogStyle={{ width: '100%', height: 120, position: 'absolute', bottom: 0 }}
                >
                    <DialogContent style={styles.iconContainer}>
                        <TouchableOpacity style={styles.flexCenter}>
                            <Image source={require('./../../assets/camera.png')} style={styles.modalIcon} />
                            <Text>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flexCenter} onPress={() => this.setState({ imageSelector: false }, () => this.launchLibrary())}>
                            <Image source={require('./../../assets/gallery.png')} style={styles.modalIcon} />
                            <Text>Gallery</Text>
                        </TouchableOpacity>

                        {
                            !userData.profilePic || userData.profilePic != '' &&
                            <TouchableOpacity style={styles.flexCenter} onPress={() => this.setState({ imageSelector: false, removePhotoConfirmation: true })}>
                                <View style={styles.deleteIcon}>
                                    <Ionicons name='md-trash' color='white' size={25} />
                                </View>
                                <Text>Remove Photo</Text>
                            </TouchableOpacity>
                        }

                    </DialogContent>
                </Dialog>

                <Dialog
                    rounded={false}
                    visible={this.state.removePhotoConfirmation}
                    onTouchOutside={() => {
                        this.setState({ removePhotoConfirmation: false });
                    }}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    onHardwareBackPress={() => {
                        this.setState({ removePhotoConfirmation: false });
                        return true;
                    }}
                    dialogStyle={{ width: '85%' }}
                >
                    <DialogContent style={{ height: 100, paddingVertical: 15, width: '100%' }}>
                        <Text style={{ color: 'black', fontSize: 18, marginBottom: 15 }}>Remove profile photo?</Text>
                        <View style={{ marginTop: 10, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity style={{ marginRight: 30 }} onPress={() => this.setState({ removePhotoConfirmation: false })}>
                                <Text style={{ color: colors.themeColor, fontWeight: 'bold', fontSize: 14 }}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.removeProfilePic()}>
                                <Text style={{ color: colors.themeColor, fontWeight: 'bold', fontSize: 14 }}>REMOVE</Text>
                            </TouchableOpacity>
                        </View>
                    </DialogContent>
                </Dialog>

                <Dialog
                    rounded={false}
                    visible={this.state.editDisplayName}
                    onTouchOutside={() => {
                        this.setState({ editDisplayName: false });
                    }}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    onHardwareBackPress={() => {
                        this.setState({ editDisplayName: false });
                        return true;
                    }}
                    dialogStyle={{ width: '100%', height: 150, position: 'absolute', bottom: 0, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                >
                    <DialogContent style={{ height: 150, paddingTop: 25, width: '100%' }}>
                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 18, marginBottom: 10 }}>Enter your name</Text>
                        <TextInput
                            value={this.state.displayName}
                            onChangeText={(text) => this.setState({ displayName: text })}
                            numberOfLines={1}
                            style={{ padding: 0, borderBottomColor: colors.themeColor, borderBottomWidth: 2, marginBottom: 30, fontSize: 16 }}
                            ref={(e) => { this.editNameInputRef = e; }}
                        />
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity style={{ marginRight: 30 }} onPress={() => { Keyboard.dismiss(), this.setState({ editDisplayName: false }) }}>
                                <Text style={{ color: colors.themeColor, fontWeight: 'bold', fontSize: 15 }}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.saveUserName()}>
                                <Text style={{ color: colors.themeColor, fontWeight: 'bold', fontSize: 15 }}>SAVE</Text>
                            </TouchableOpacity>
                        </View>
                    </DialogContent>
                </Dialog>

            </KeyboardAvoidingView>
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.user.userData,
        userImageUpdateStatus: state.user.userImageUpdateStatus,
        userImageUpdateText: state.user.userImageUpdateText
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    accountSettings: {
        borderColor: '#eee',
        borderTopWidth: 1,
    },
    nameContainer: {
        justifyContent: 'space-between',
        paddingRight: 10
    },
    userName: {
        marginLeft: 10,
        color: '#222',
        fontSize: 16,
    },
    statusText: {
        color: '#666',
        fontSize: 15,
        marginHorizontal: 15,
        width:DEVICE_WIDTH - 110
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 20,
        justifyContent: 'flex-start',
    },
    settingIcon: {
        width: 50,
        textAlign: 'center'
    },
    settingKey: {
        marginLeft: 10,
        color: '#222',
        fontSize: 15,
    },
    settingInfo: {
        color: '#666',
        fontSize: 14,
        marginLeft: 15,
        maxHeight: 22
    },
    inviteRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#eee',
        paddingVertical: 20,
        paddingHorizontal: 15,
        justifyContent: 'flex-start',
    },
    flexCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    popupDialogStyle: {
        backgroundColor: 'white',
        height: 150,
        flex: 1
    },
    modalIcon: {
        height: 50,
        width: 50,
        borderRadius: 30,
        margin: 10
    },
    deleteIcon: {
        height: 50,
        width: 50,
        borderRadius: 30,
        margin: 10,
        backgroundColor: '#ff5c33',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 120,
        flexDirection: 'row',
        paddingTop: 25
    },
    profilePicUploading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
