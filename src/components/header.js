import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Animated, Easing, BackHandler, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import Menu, { MenuItem } from 'react-native-material-menu';

import { NavigationActions, StackActions } from 'react-navigation';

import colors from './../appConfig/color';

const getBackButtonListener = callback =>
    BackHandler.addEventListener('hardwareBackPress', callback);

export default class Header extends PureComponent {
    _menu = null;

    constructor(props) {
        super(props);

        this.state = {
            showSearchbar: false,
            showMenu: false,
            // the Green background default value
            defaultScaleValue: new Animated.Value(1),
            // the White background default value
            searchScaleValue: new Animated.Value(0.01),
            // we will resolve the radius and diameter whitin onLayout callback
            radius: 0,
            diameter: 0,
            // it'll change zIndex after the animation is complete
            order: 'defaultFirst',
            positionValue: new Animated.Value(0),
        }

        this.backButtonListener = this.state.showSearchbar ? getBackButtonListener(this.onSearchCloseRequested) : null
    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    logout() {
        this._menu.hide();
        this.props.actions.logout().then(() => {
            const routeName = 'DefaultScreen';
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName })],
            });
            this.props.navigation.dispatch(resetAction);
        });
    }

    animateDefaultBackground = onComplete => {
        const { defaultScaleValue } = this.state;

        Animated.timing(defaultScaleValue, {
            toValue: 1,
            duration: 20,
            easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            useNativeDriver: true,
        }).start(onComplete);
    };

    onSearchCloseRequested = () => {
        const { searchScaleValue } = this.state;

        this.animateDefaultBackground(() => {
            // default scale set up back to "hidden" value
            searchScaleValue.setValue(0.01);
            this.setState({ order: 'defaultFirst', showSearchbar: false, searchValue: '' });
            this.props.searchBarStatus(false);
            this.onSearchClosed();
        });

        return true; // because we need to stop propagation
    };

    onSearchClosed = () => {

        if (this.backButtonListener) {
            this.backButtonListener.remove();
        }
    };

    onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        // pythagorean
        const radius = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));
        let diameter = radius * 2;
        // because there is issue in react native that we can't set scale value to 0, we need to use
        // 0.01 and it means we still see the point even if the scale set to 0.01
        const bgPosition = width - radius; // the correct left position of circle background
        // we need circle to be bigger, then we won't see the 0.01 scaled point (because it'll be
        // out of screen)
        const pointSize = diameter * 0.01;
        diameter += pointSize;

        this.setState({
            bgPosition,
            radius: diameter / 2,
            diameter,
        });
    }

    animateBackground = (value, onComplete) => {
        Animated.timing(value, {
            toValue: 1,
            duration: 325,
            easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            useNativeDriver: Platform.OS === 'android',
        }).start(onComplete);
    }

    renderAnimatedBackgrounds = styles => {
        const {
            diameter,
            bgPosition,
            radius,
            defaultScaleValue,
            searchScaleValue,
            order,
        } = this.state;

        const bgStyle = {
            position: 'absolute',
            top: -radius,
            width: diameter,
            height: diameter,
            borderRadius: radius,
        };

        const bgSearch = (
            <Animated.View
                key="searchBackground"
                style={[
                    bgStyle,
                    {
                        left: bgPosition,
                        backgroundColor: 'white',
                        transform: [{ scale: searchScaleValue }],
                    },
                ]}
            />
        );

        const bgDefault = (
            <Animated.View
                key="defaultBackground"
                style={[
                    {
                        right: bgPosition,
                        backgroundColor: colors.themeColor,
                        transform: [{ scale: defaultScaleValue }],
                    },
                ]}
            />
        );

        let content = null;

        if (order === 'defaultFirst') {
            content = [bgDefault, bgSearch];
        } else {
            content = [bgSearch, bgDefault];
        }

        return <View style={StyleSheet.absoluteFill}>{content}</View>;
    };

    animateSearchBackground = onComplete => {
        const { searchScaleValue } = this.state;

        Animated.timing(searchScaleValue, {
            toValue: 1,
            duration: 325,
            easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            useNativeDriver: true,
        }).start(onComplete);
    };

    onSearchPressed() {
        this.animateSearchBackground(() => {
            const { defaultScaleValue } = this.state;

            // default scale set up back to "hidden" value
            defaultScaleValue.setValue(0.01);
            this.setState({ order: 'searchFirst', showSearchbar: true });
            // on android it's typical that back button closes search input on toolbar
            this.backButtonListener = getBackButtonListener(this.onSearchCloseRequested);
            this.props.searchBarStatus(true);
            setTimeout(() => {
                this.refs.searchInput.focus();
            }, 200);
        });
    }

    openSettings() {
        this._menu.hide();
        this.props.navigation.navigate('Settings')
    }

    render() {
        return (
            <Animated.View onLayout={this.onLayout} style={[styles.mainHeader, { paddingHorizontal: this.state.showSearchbar ? 0 : 20 }]}>
                {
                    this.state.showSearchbar ?
                        <View style={styles.searchContainer}>
                            <TouchableOpacity style={styles.searchBackButton} onPress={() => this.onSearchCloseRequested()}>
                                <Ionicons name={'md-arrow-back'} color={colors.themeColor} size={22} />
                            </TouchableOpacity>
                            <TextInput
                                placeholder='Search...'
                                style={{ fontSize: 18 }}
                                ref='searchInput'
                            />
                        </View>
                        :
                        <>
                            {this.renderAnimatedBackgrounds(styles)}
                            <Text style={styles.headerTitle}>WhatsApp</Text>
                            <View style={styles.headerContent}>
                                <TouchableOpacity style={{ marginRight: 20 }} onPress={() => this.onSearchPressed()}>
                                    <Icon name={'search'} color={'white'} size={22} />
                                </TouchableOpacity>
                                <Menu
                                    ref={this.setMenuRef}
                                    button={<Icon onPress={this.showMenu} name={'more-vertical'} color={'white'} size={22} />}
                                >
                                    <MenuItem onPress={() => alert('coming soon in next release')}>New Group</MenuItem>
                                    <MenuItem onPress={() => alert('coming soon in next release')}>New broadcast</MenuItem>
                                    <MenuItem onPress={() => alert('coming soon in next release')}>Starred Messages</MenuItem>
                                    <MenuItem onPress={() => this.openSettings()}>Settings</MenuItem>
                                    <MenuItem onPress={() => this.logout()}>Logout</MenuItem>
                                </Menu>
                            </View>
                        </>
                }

            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({

    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    },
    mainHeader: {
        height: 50,
        paddingHorizontal: 20,
        backgroundColor: colors.themeColor,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    searchContainer: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 3
    },
    searchBackButton: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})