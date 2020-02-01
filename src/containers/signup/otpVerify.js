import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from './../../appConfig/color'
export default class OtpVerify extends Component {

    constructor() {
        super();
        this.state = {
            callingCode: '91',
            mobileNo: '1231231231',
            focusedInput: 0,
            otpText: [],
            resendTimeout: 15,
            validateOTP: false,
            resendTimeoutStr: '15'
        }
        this.inputs = [];
    }

    componentWillMount() {
        const { params } = this.props.navigation && this.props.navigation.state;
        if (params) {
            this.setState({
                callingCode: params.callingCode,
                mobileNo: params.mobileNo,
            });
        }

    }

    onTextChange = (text, i) => {
        this.setState((prevState) => {
            let { otpText } = prevState;
            otpText[i] = text;
            return { otpText }
        }, () => {
            if (text.length === 1 && i !== 3) {
                this.inputs[i + 1].focus();
            }
            if (this.state.otpText.length == 4) {
                this.otpAccepted();
            }
        });
    }

    otpAccepted() {
        this.props.navigation.navigate('ProfileInfo', {
            callingCode: this.state.callingCode,
            mobileNo: this.state.mobileNo,
        })
    }

    onInputFocus = (i) => {
        this.setState({ focusedInput: i });
    }

    onKeyPress = (e, i) => {
        const { otpText = [] } = this.state;
        if (e.nativeEvent.key === 'Backspace' && i !== 0 && otpText[i] === '') {
            this.inputs[i - 1].focus();
        }
    }

    renderInputs() {
        const TextInputs = [];

        for (let i = 0; i < 4; i += 1) {
            let borderColor = '#DCDCDC';
            const inputStyle = [styles.textInput];

            if (this.state.focusedInput === i) {
                borderColor = '#000';
            }

            if (this.state.validateOTP && !this.state.otpText[i]) {
                borderColor = 'red';
            }

            inputStyle.push({ borderColor });

            TextInputs.push(
                <TextInput
                    ref={(e) => { this.inputs[i] = e; }}
                    key={i}
                    defaultValue={''}
                    style={inputStyle}
                    maxLength={1}
                    keyboardType='phone-pad'
                    onFocus={() => this.onInputFocus(i)}
                    onChangeText={(text) => this.onTextChange(text, i)}
                    multiline={false}
                    onKeyPress={e => this.onKeyPress(e, i)}
                    placeholder='0'
                />
            );
        }
        return TextInputs;
    }

    componentDidMount() {
        this.resendInterval = setInterval(() => {
            let resendTimeout = this.state.resendTimeout - 1;
            this.setState({ resendTimeout });
        }, 1000);
        setTimeout(() => {
            this.inputs[0].focus();
        }, 500)
    }

    componentWillUnmount() {
        clearInterval(this.resendInterval);
    }

    validateNumber() {
        let otp = this.state.otpText.join('').toString();
        if (otp.length == 4) {
            this.otpAccepted();
        } else {
            this.setState({ validateOTP: true })
        }
    }

    render() {
        let resendTimeoutStr = ('0' + this.state.resendTimeout.toString()).substr(-2)
        return (
            <View style={styles.container}>

                <Animatable.View animation="fadeInLeft" iterationCount={1} style={{ margin: 30, zIndex: 100, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                        <Ionicons color={'black'} size={30} name={'md-arrow-back'} />
                    </TouchableOpacity>
                </Animatable.View>

                <View style={{ justifyContent: 'center', paddingHorizontal: 30 }}>

                    <Text style={{ fontSize: 20, color: 'black' }}>
                        Enter the 4-digit code sent to you at
                        <Text style={{ fontWeight: 'bold' }}>  +{this.state.callingCode} {this.state.mobileNo}.</Text>
                        {this.state.resendTimeout <= 0 && <Text style={{ color: 'orange' }}> Did you enter the correct mobile number?</Text>}
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 20 }}>
                        {this.renderInputs()}
                    </View>

                    <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 50 }}>
                        <View style={{}}>
                            {
                                this.state.resendTimeout <= 0 ?
                                    <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => this.props.navigation.pop()}>
                                        <Text style={{ color: '#52a9f5', fontSize: 15 }}>I'm having trouble</Text>
                                    </TouchableOpacity>
                                    :
                                    <Text style={{ fontSize: 15, marginBottom: 20 }}>Resend code in 00:{resendTimeoutStr}</Text>
                            }
                            <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                                <Text style={{ color: '#52a9f5', fontSize: 15 }}>Edit my mobile number</Text>
                            </TouchableOpacity>
                        </View>
                        <Animatable.View
                            style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                display: 'flex',
                                flex: 1,
                            }}
                        >
                            <TouchableOpacity onPress={() => this.validateNumber()} style={styles.forwardArrow} >
                                <Ionicons color={'white'} size={26} name={'md-arrow-forward'} />
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>

                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    forwardArrow:{
        height: 60,
        width: 60,
        backgroundColor: colors.themeColor,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
