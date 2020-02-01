import React, { Component } from 'react';
import { View, Text, StatusBar, VirtualizedList, Dimensions, Image, StyleSheet, TouchableOpacity, TextInput, Keyboard, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'underscore';
import colors from './../appConfig/color'

export default class PageHeader extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <SafeAreaView>
                <View style={[styles.header,{height:this.props.headerHeight || 60}]}>
                    <TouchableOpacity onPress={() => this.props.onBackPress()}>
                        <Ionicons name={'md-arrow-back'} color='white' size={30} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20, marginLeft: 40 }}>{this.props.title}</Text>
                    <TouchableOpacity activeOpacity={1}></TouchableOpacity>
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
        paddingHorizontal: 15,
        backgroundColor: colors.themeColor,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    }
})
