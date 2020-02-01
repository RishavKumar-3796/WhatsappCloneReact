import React, { Component } from 'react';
import { View, Text, StatusBar, VirtualizedList, Dimensions, Image, StyleSheet, TouchableOpacity, TextInput, Keyboard, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'underscore';
import colors from './../../appConfig/color'
import PageHeader from '../../components/PageHeader'
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as userActions from '../../actions/userActions';
class AboutMe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editAboutMe: false,
            aboutMe: this.props.userData.aboutMe || 'Using MyWhatsApp!'
        }
        this.editAboutMeRef = null;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.userData.aboutMe != this.state.aboutMe){
            this.setState({ aboutMe:nextProps.userData.aboutMe })
        }
    }

    editAboutMe() {
        this.setState({ editAboutMe: true }, () => {
            setTimeout(() => {
                this.editAboutMeRef.focus()
            }, 200);
        })
    }

    saveAboutMe(aboutMe) {
        Keyboard.dismiss();
        this.props.actions.changeAboutMe(aboutMe || this.state.aboutMe)
        this.setState({ editAboutMe: false });
    }

    render() {
        let { userData } = this.props;
        let allAboutMe = userData && userData.allAboutMe || [];
        return (
            <>
                <PageHeader headerHeight={50} title={'About'} onBackPress={() => this.props.navigation.goBack()} />

                <View style={styles.currentAbout}>
                    <Text style={{ color: color.themeColor, fontWeight: '500', fontSize: 15, }}>Currently set to</Text>
                    <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.editAboutMe()}>
                        <Text style={{ color: 'black', fontSize: 15, flex: 0.9 }}>{userData.aboutMe}</Text>
                        <MaterialCommunityIcons size={23} name={'pencil'} color={colors.lightgray} />
                    </TouchableOpacity>
                </View>

                <View style={styles.selectAbout}>
                    <Text style={{ color: color.themeColor, fontWeight: '500', fontSize: 15, }}>Select About</Text>

                    {
                        allAboutMe.map((aboutMe) => {
                            return (
                                <TouchableOpacity key={aboutMe} style={{ justifyContent: 'space-between', marginTop: 20, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.saveAboutMe(aboutMe)}>
                                    <Text style={{ color: 'black', fontSize: 15, flex: 0.9 }}>{aboutMe}</Text>
                                    {
                                        aboutMe == userData.aboutMe &&
                                        <MaterialCommunityIcons size={23} name={'check'} color={colors.themeColor} />
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }


                </View>

                <Dialog
                    rounded={false}
                    visible={this.state.editAboutMe}
                    onTouchOutside={() => {
                        this.setState({ editAboutMe: false });
                    }}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    onHardwareBackPress={() => {
                        this.setState({ editAboutMe: false });
                        return true;
                    }}
                    dialogStyle={{ width: '100%', height: 150, position: 'absolute', bottom: 0, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                >
                    <DialogContent style={{ height: 150, paddingTop: 25, width: '100%' }}>
                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 18, marginBottom: 10 }}>Add About</Text>
                        <TextInput
                            value={this.state.aboutMe}
                            onChangeText={(text) => this.setState({ aboutMe: text })}
                            numberOfLines={1}
                            maxLength={180}
                            selectTextOnFocus
                            style={{ padding: 0, borderBottomColor: colors.themeColor, borderBottomWidth: 2, fontSize: 16 }}
                            ref={(e) => { this.editAboutMeRef = e; }}
                        />
                        <Text style={{ marginBottom: 10 }}>{180 - this.state.aboutMe.length} characters left</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity style={{ marginRight: 30 }} onPress={() => { Keyboard.dismiss(), this.setState({ editAboutMe: false }) }}>
                                <Text style={{ color: colors.themeColor, fontWeight: 'bold', fontSize: 15 }}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.saveAboutMe()}>
                                <Text style={{ color: colors.themeColor, fontWeight: 'bold', fontSize: 15 }}>SAVE</Text>
                            </TouchableOpacity>
                        </View>
                    </DialogContent>
                </Dialog>

            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.user.userData
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutMe);

const styles = StyleSheet.create({
    currentAbout: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#dedede'
    },
    selectAbout: {
        padding: 20
    }
})
