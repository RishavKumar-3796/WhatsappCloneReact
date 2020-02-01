import React, { Component } from 'react'
import { View, Text, Animated, ImageBackground, Dimensions, Image, StyleSheet, TouchableOpacity, TextInput, Keyboard, Platform, PermissionsAndroid } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import CountryPicker from './../../components/countryPicker';
import CountryPicker from 'rn-country-picker-minimal'

import colors from './../../appConfig/color'

const SCREEN_HEIGHT = Dimensions.get('window').height

export default class SignupScreen extends Component {

    constructor() {
        super();
        this.state = {
            placeholder: 'Enter Mobile Number',
            keyboardHeight: 0,
            cca2: 'IN',
            callingCode: '91',
            countryImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAeCAMAAABpA6zvAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAqZQTFRF53MA5HIC43ID53MB9XcA+3oA9ngA53QB83cA6XMCpV8oX0hPR0RkSUVlXkdPpF8o53EA428B9ncArmIkL0OAG02vZo3TfJ3agqLcZYzTJFSzLkJ/6X0R6X0S5XsS+IQOl2E+BDqjgJ7X5eny5enz5uv05er05OjyjancCD6llmE+/fXu+/Ps///zvMPUCDefqbre8fP32ODwyNPpwMzmwc3mxNDo1N3u8fL3v8znEj+kucHS/////v//NVuwf5bK9/n7vcrkma3WgZnMf5fLlKnUusjjzdfr+Pn7iZ/OOmCz/f7///7+/Pz9tcPgGUWh4efz2eDwvMrkf5nMXH2+aojDa4jEW3y9gJnMuMbi6u/3Jk+ms8Hf+/z9aofDXn2+9ff70Nrsm6/XXHy+jKPRxNDnxdHol6vVWXq8kqfTz9ns9vj7co3Ga4fD/P3+UHK5dZDI8fT5w8/ngpvNaIbDxM/nvMnku8jkcIzGfZfLws7m8/b6iaDQU3W6dI/H8vT6aIbCu8nkucfjydTpepXK9Pb6UnS67vL4ztfrmKzWWnu9kKbTmK3WW3u9kqjTy9Xq8PP5cY3GbIjD/v/+GEWh4ujz1t7ugZrNbInEfJbL7fH4JlCns8LgOVuxfpbKzNbqlqrUfpbLe5TKytTqj6XRPWCz/v7/8fju7vXt/v/zssXUCTigs8Hi8fT309zuxtHo0Nns7vL2wMznFECkr8LT///0QJkUQJoUPpcVSKIRKHVADDqki6DY4+ny4ujy4Oby4ejyl6ndEj+mJ3Q/LpAAL5AALI4BNZgAJHomD0iAJk6xd47Uip7bjqHceI7VLlW0LY4BM5IEM5MEMZEFNZcAMpMDIXUqDFZQDE9lDlBmDFVQMpIDNpgAOJsANpkAOZsAMZEGMpEFwJ5XlQAAAAFiS0dEPKdqYc8AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAGtSURBVDjLY2AY1oCRiRGICCtjZmFlY2NlYcZQyo4CGDk4ubh5ePn4OTkYUWUYBJCBoJCwiKiYuISklLSwkCCKFIMMAsjKySsoKimrqKqpq2toasnLySJJMmgjgI6unr6BoZGxiamZuYWllbWuDpIkgw0c2NrY2tk7mDk6Obu4url7eHp5A4XggMEHDnxt/PwDAoOCQ0LDwiMi3aOiY2x8EbJIJsbaxMUnJCYlp6SmpWdkZmXn5AKFECYimHk2+QWFRcUlpWXlxhWVVdU1tUAhHArr6k0jGooam5orWkxaa9pwKIy1yY1v7+js6k4t6unt658wcRKK1ZPhINbGb8rUaeXTw0NndM1sMp81e45NLEIWJXhs5s5zmF+2YOGivsjFDkuWLkMJnuUIsGLlqtVr1q5bXxZUumHjps1btq5AkmTYhgDbd+zctXvP3n1T9x/Ye/DQ4Z07tiNJMhxBAkePHT9x8tTpM2fPnT954viFo8hyDBeRwKVLl69cvXb9xs1b125fuXzpErIcw21UcPn2nbv37t2/A2SgAnSFQKUPHj58cBlDGFMhDjAUFAIALMfjyKVz+egAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTMtMTAtMDdUMTM6MTQ6MzQrMDI6MDDj9ijFAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDEzLTEwLTA3VDEzOjE0OjM0KzAyOjAwkquQeQAAAABJRU5ErkJggg==',
            mobileNo: '',
            isValid: true,
            validationMsg: '',
            showCountryModal: false
        }
        this.loginHeight = new Animated.Value(150);
        this.forwardArrowOpacity = new Animated.Value(0);
        this.borderBottomWidth = new Animated.Value(0);
    }

    async componentWillMount() {
        if (Platform.OS == 'android')
            try {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        'title': '####',
                        'message': 'MyWhatsapp needs access to your storage so you can upload awesome pictures.'
                    }
                )

                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        'title': '####',
                        'message': 'MyWhatsapp needs access to your Photo '
                    }
                )
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    {
                        'title': '####',
                        'message': 'MyWhatsapp needs access to your contacts '
                    }
                )

                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        'title': '####',
                        'message': 'MyWhatsapp needs access to your camera '
                    }
                )

            } catch (err) {
                console.warn(err)
            }
    }

    setCountryData(selectedCountryData) {
        this.setState({ showCountryModal: false, ...selectedCountryData })
    }

    increaseLoginPanel() {

        Animated.parallel([
            Animated.timing(this.loginHeight, {
                toValue: SCREEN_HEIGHT,
                duration: 500
            }),
            Animated.timing(this.forwardArrowOpacity, {
                duration: 500,
                toValue: 1
            }),
            Animated.timing(this.borderBottomWidth, {
                duration: 500,
                toValue: 1
            }),
        ]).start(() => {
            this.setState({ placeholder: '1111111111' });
            this.refs.textInputMobile.focus();
        })

    }

    decreaseLoginPanel() {
        Keyboard.dismiss();

        Animated.parallel([
            Animated.timing(this.loginHeight, {
                toValue: 150,
                duration: 500
            }),
            Animated.timing(this.forwardArrowOpacity, {
                duration: 500,
                toValue: 0
            }),
            Animated.timing(this.borderBottomWidth, {
                duration: 500,
                toValue: 0
            }),
        ]).start(() => {
            this.setState({ placeholder: 'Enter Mobile Number', isValid: true, mobileNo: '', cca2: 'IN', callingCode: '91', })
        })
    }

    validateNumber() {
        if (!this.state.mobileNo) {
            this.setState({ isValid: false, validationMsg: 'Enter Your mobile number' })
        } else if (this.state.mobileNo && this.state.mobileNo.length < 10) {
            this.setState({ isValid: false, validationMsg: 'Please enter valid mobile number' })
        } else {
            this.props.navigation.navigate('OtpVerify', { cca2: this.state.cca2, callingCode: this.state.callingCode, mobileNo: this.state.mobileNo });
            this.setState({ isValid: true, validationMsg: '' })
        }
    }

    render() {
        // this.setState({ cca2: value.cca2, callingCode: value.callingCode });
        const headerTextOpacity = this.loginHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [1, 0]
        })

        const marginTop = this.loginHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [25, 100]
        })

        const headerBackArrowOpacity = this.loginHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [0, 1]
        })

        return (
            <View style={styles.container}>

                <Animated.View style={[styles.backButton, { opacity: headerBackArrowOpacity }]}>
                    <TouchableOpacity onPress={() => this.decreaseLoginPanel()}>
                        <Ionicons color={'black'} size={30} name={'md-arrow-back'} />
                    </TouchableOpacity>
                </Animated.View>

                <ImageBackground
                    source={require('./../../assets/signupBG.png')}
                    style={{ flex: 1 }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Animatable.View animation="zoomIn" iterationCount={1} style={{ height: 130, width: 130, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('./../../assets/logo.png')}
                                style={{ width: 100, height: 100 }}
                            />
                        </Animatable.View>
                    </View>

                    <Animatable.View animation={'slideInUp'} iterationCount={1}>
                        <Animated.View style={{ height: this.loginHeight, backgroundColor: 'white' }}>
                            <Animated.View style={{ opacity: headerTextOpacity, alignItems: 'flex-start', paddingHorizontal: 25, marginTop: marginTop }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 26 }}>Chat Along with Whatsapp</Text>
                            </Animated.View>

                            <View style={{ paddingHorizontal: 20, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => { this.refs.textInputMobile.blur(), this.setState({ showCountryModal: true }) }}
                                >
                                    <Image
                                        source={{ uri: this.state.countryImage }}
                                        style={{ width: 35, height: 25, borderRadius: 5 }}
                                    />
                                </TouchableOpacity>

                                <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>+{this.state.callingCode}</Text>

                                <TouchableOpacity onPress={() => this.increaseLoginPanel()} style={{ height: 50, flex: 1 }}>
                                    <Animated.View pointerEvents='none' style={{ flex: 1, height: 50, borderBottomWidth: this.borderBottomWidth, borderColor: this.state.isValid ? 'black' : 'red' }}>
                                        <TextInput
                                            style={{ fontSize: 20 }}
                                            placeholder={this.state.placeholder}
                                            underlineColorAndroid="transparent"
                                            ref='textInputMobile'
                                            keyboardType='phone-pad'
                                            maxLength={10}
                                            value={this.state.mobileNo}
                                            onChangeText={(mobileNo) => this.setState({ mobileNo })}
                                        />

                                        {
                                            !this.state.isValid &&
                                            <View style={{ justifyContent: 'flex-start', display: 'flex', flex: 1, marginTop: 5 }}>
                                                <Text style={{ color: 'red' }}>{this.state.validationMsg}</Text>
                                            </View>
                                        }
                                    </Animated.View>
                                </TouchableOpacity>
                            </View>

                            <Animated.View
                                style={[styles.forwardButtonContainer, { opacity: this.forwardArrowOpacity }]}
                            >
                                <TouchableOpacity style={styles.forwardButton} onPress={() => this.validateNumber()} >
                                    <Ionicons color={'white'} size={26} name={'md-arrow-forward'} />
                                </TouchableOpacity>
                            </Animated.View>

                        </Animated.View>
                    </Animatable.View>
                </ImageBackground>

                {
                    this.state.showCountryModal &&
                    <CountryPicker
                        onHide={() => this.setState({ showCountryModal: false })}
                        setCountryData={(callingCode) => this.setCountryData(callingCode)}
                    />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backButton: {
        position: 'absolute',
        height: 60,
        width: 60,
        top: 60,
        left: 30,
        zIndex: 100
    },
    forwardButtonContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 100,
        display: 'flex',
        flex: 1,
        marginTop: 50,
    },
    forwardButton: {
        height: 60,
        width: 60,
        backgroundColor: colors.themeColor,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
