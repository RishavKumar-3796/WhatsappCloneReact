import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Image, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-root-toast';
import { NavigationActions, StackActions } from 'react-navigation';
import * as Animatable from 'react-native-animatable';

import colors from './../../appConfig/color'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from './../../actions/userActions';
class ProfileInfo extends Component {

    constructor(props) {
        super(props);
        let { params } = props.navigation.state;
        this.state = {
            imageSelector: false,
            isImageSelected: false,
            isUserNameValid: true,
            imageData: null,
            userName: '',
            imagePath: null,
            mobileNo: params.mobileNo,
            isSigningUp: false,
            callingCode: params.callingCode
        }

    }

    setUserName(userName) {
        this.setState({ userName })
    }

    signupUser() {
        let { userName, callingCode, mobileNo, imagePath, imageData } = this.state;
        if (!userName.trim()) {
            this.setState({ isUserNameValid: false });
        } else {

            Keyboard.dismiss();

            this.setState({ isSigningUp: true })
            let cleanMobileNumber = mobileNo.replace(/\D/g,'');

            const data = {
                userName: userName.trim(),
                mobileNo:cleanMobileNumber,
                countryMobileNo:`${callingCode}${cleanMobileNumber}`,
                countryCode: callingCode,
                createdAt: new Date(),
                isVerified: true,
                imagePath,
                hasProfileImage: this.state.isImageSelected,
            }

            const userId = this.props.userData && this.props.userData.userId;

            if (!userId) {
                this.props.actions.registerUser(data).then((res) => {
                    Toast.show('Regsitered successfully. Enjoy MyWhatsapp!', {
                        duration: 3000,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0
                    });

                    setTimeout(() => {
                        const routeName = 'Home';
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName })],
                        });
                        this.props.navigation.dispatch(resetAction);
                    }, 300)

                }).catch((err) => {
                    console.log("err => ", err);
                    Toast.show('Some error occurred! Please try again', {
                        duration: 3000,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0
                    });
                })
            }
        }
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
            this.setState({ isImageSelected: true, imagePath: response.path, imageData: response.data })
        });
    }

    render() {

        return (
            <SafeAreaView style={styles.container}>

                <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 19, color: '#1b8b82', fontWeight: 'bold' }}>Profile info</Text>
                </View>

                <View style={{ margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#929fa6', fontSize: 17, textAlign: 'center' }}>Please provide your name and an optional profile photo</Text>
                </View>

                <View style={styles.inputContainer}>

                    {
                        this.state.isImageSelected ?
                            <TouchableOpacity
                                onPress={() => { Keyboard.dismiss(), this.setState({ imageSelector: true }) }}
                                activeOpacity={0.6}
                            >
                                <Image
                                    source={{ uri: `data:image/png;base64,${this.state.imageData}` }}
                                    style={styles.profileImage}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => { Keyboard.dismiss(), this.setState({ imageSelector: true }) }}
                                activeOpacity={0.6}
                                style={styles.profileImage}
                            >
                                <Ionicons name='md-camera' color='white' size={30} />
                            </TouchableOpacity>
                    }


                    <TextInput
                        placeholderTextColor="#7a7b7bf2"
                        placeholder='Type your name here'
                        style={[styles.userNameInput, { borderColor: this.state.isUserNameValid ? '#00bfa5' : 'red' }]}
                        value={this.state.userName}
                        onChangeText={(text) => this.setState({ userName: text })}
                    />

                </View>

                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        marginTop: 30
                    }}
                >
                    {
                        this.state.isSigningUp ?
                            <>
                                <Animatable.View
                                    animation="rotate"
                                    easing="linear"
                                    iterationCount="infinite"
                                    style={styles.arrowForward}
                                >
                                    <EvilIcons name="spinner-3" color={'white'} size={26} />
                                </Animatable.View>
                            </>
                            :
                            <TouchableOpacity onPress={() => this.signupUser()} style={styles.arrowForward} >
                                <Ionicons color={'white'} size={26} name={'md-arrow-forward'} />
                            </TouchableOpacity>
                    }


                </View>

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
                            this.state.isImageSelected &&
                            <TouchableOpacity style={styles.flexCenter} onPress={() => this.setState({ isImageSelected: false, imagePath: null, imageData: null, imageSelector: false })}>
                                <View style={styles.deleteIcon}>
                                    <Ionicons name='md-trash' color='white' size={30} />
                                </View>
                                <Text>Remove Photo</Text>
                            </TouchableOpacity>
                        }
                    </DialogContent>
                </Dialog>

            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.user.userData,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);

const styles = StyleSheet.create({
    inputContainer: {
        padding: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    profileImage: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ccc'
    },
    arrowForward: {
        height: 60,
        width: 60,
        backgroundColor: colors.themeColor,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    },
    userNameInput: {
        borderBottomWidth: 1,
        marginLeft: 20,
        flex: 1,
        paddingBottom: 5,
        fontSize: 18
    },
    container: {
        flex: 1
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
        height: 60,
        width: 60,
        borderRadius: 30,
        margin: 10
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
        height: 120,
        flexDirection: 'row',
        paddingTop: 25
    },
    textInput: {
        height: 50,
        width: 50,
        borderBottomWidth: 1,
        margin: 5,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '500',
        color: '#000000'
    },
})
