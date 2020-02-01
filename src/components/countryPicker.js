import React, { Component } from 'react';
import { View, Text, Modal, VirtualizedList, Dimensions, Image, StyleSheet, TouchableOpacity, TextInput, Keyboard, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'underscore';

const countriesJson = require('./../assets/data/countries.json');
const countries = Object.values(countriesJson);

export default class CountryPicker extends Component {

    constructor() {
        super();
        this.state = {
            showSearch: true,
            countryName: '',
            countries
        }
        this.searchInput = null;

    }

    searchCountry = _.debounce((text) => {
        let countryData = [...countries];
        let filteredCountries = countryData.filter((country) => {
            return country.name.common && country.name.common.toLowerCase().indexOf(text.toLowerCase()) >= 0
        });
        this.setState({ countries: filteredCountries, countryName: text })
    }, 300)

    componentDidMount() {
        setTimeout(() => {
            this.focusSearch()
        }, 500);
    }

    focusSearch() {
        this.searchInput.focus()
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={true}
                style={styles.container}
                onRequestClose={() => {
                    this.props.onHide()
                }}
            >
                <SafeAreaView>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.onHide()}>
                            <Ionicons name={'md-arrow-back'} color='white' size={30} />
                        </TouchableOpacity>
                        {
                            this.state.showSearch ?
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingRight: 15 }}>
                                    <TextInput
                                        ref={(e) => { this.searchInput = e; }}
                                        placeholderTextColor="#aaa"
                                        placeholder='Search country...'
                                        style={styles.countryNameInput}
                                        value={this.state.countryName}
                                        onChangeText={(text) => { this.setState({ countryName: text }, () => { this.searchCountry(text) }) }}
                                    />
                                    <TouchableOpacity onPress={() => this.setState({ showSearch: false, countryName: '',countries })}>
                                        <Ionicons name={'md-close'} color='white' size={30} />
                                    </TouchableOpacity>
                                </View>
                                :
                                <>
                                    <Text style={{ color: 'white', fontSize: 22 }}>Select a Country</Text>
                                    <TouchableOpacity onPress={() => this.setState({ showSearch: true }, () => { this.focusSearch() })}>
                                        <Ionicons name={'md-search'} color='white' size={30} />
                                    </TouchableOpacity>
                                </>
                        }

                    </View>
                    <VirtualizedList
                        keyboardShouldPersistTaps={'handled'}
                        data={this.state.countries}
                        initialNumToRender={20}
                        maxToRenderPerBatch={20}
                        getItem={(data, index) => data[index]}
                        getItemCount={data => data.length}
                        keyExtractor={(item, index) => {
                            return `${item.callingCode}${index}`
                        }}
                        ListEmptyComponent={() => (
                            <Text style={styles.emptyMessageStyle}>Can't find this country...</Text>
                        )}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => this.props.setCountryData({ callingCode: item.callingCode, countryImage: item.flag })}
                                    style={{ paddingVertical: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: item.flag }} style={{ width: 35, height: 25, marginRight: 20, borderRadius: 5 }} />
                                    <Text style={{ color: 'black' }}>{item.name.common}  (+{item.callingCode})</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </SafeAreaView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    emptyMessageStyle: {
        textAlign: 'center',
        marginTop:50,
        fontSize:22
    },
    container: {
        flex: 1
    },
    header: {
        height: 70,
        paddingHorizontal: 15,
        backgroundColor: 'black',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    countryNameInput: {
        marginLeft: 20,
        flex: 1,
        fontSize: 18,
        color: 'white'
    }
})
