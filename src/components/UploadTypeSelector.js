import React, { Component } from 'react';
import { View, Text, StatusBar, VirtualizedList, Dimensions, Image, StyleSheet, TouchableOpacity, TextInput, Keyboard, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'underscore';
import colors from './../appConfig/color';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';

export default class UploadTypeSelector extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <Dialog
                rounded={false}
                visible={this.props.imageSelector}
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
                        <Image source={require('./../assets/camera.png')} style={styles.modalIcon} />
                        <Text>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flexCenter} onPress={() => {this.props.onHide()}}>
                        <Image source={require('./../assets/gallery.png')} style={styles.modalIcon} />
                        <Text>Gallery</Text>
                    </TouchableOpacity>
                    {
                        this.props.isImageSelected &&
                        <TouchableOpacity style={styles.flexCenter} onPress={() => this.props.onHide()}>
                            <View style={styles.deleteIcon}>
                                <Ionicons name='md-trash' color='white' size={30} />
                            </View>
                            <Text>Remove Photo</Text>
                        </TouchableOpacity>
                    }
                </DialogContent>
            </Dialog>
        )
    }
}

const styles = StyleSheet.create({
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
})
