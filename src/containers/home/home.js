import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import DefaultTabBar from './DefaultTabBar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from './../../actions/userActions';

import CallsTab from '../../components/homeTabs/callsTab';
import StatusTab from '../../components/homeTabs/statusTab';
import ChatTab from '../../components/homeTabs/chatTab';
import Header from '../../components/header';

class Home extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            showSearchbar: false
        }
    }

    componentDidMount() {
        this.props.actions.contact();
    }

    render() {

        return (

            <View style={{ flex: 1 }} >
                <Header searchBarStatus={(status) => this.setState({ showSearchbar: status })} {...this.props} />
                <ScrollableTabView
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar showSearchbar={this.state.showSearchbar} />}
                >
                    <View tabLabel="CHATS" style={[styles.tabView]} >
                        <ChatTab {...this.props} />
                    </View>

                    <View tabLabel="STATUS" style={[styles.tabView]} >
                        <StatusTab />
                    </View>

                    <View tabLabel="CALLS" style={[styles.tabView]} >
                        <CallsTab CallsData={this.state.Chats} />
                    </View>

                </ScrollableTabView>
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
    tabView: {
        flex: 1
    },
    card: {
        backgroundColor: '#fff',
        margin: 5,
        padding: 15,
    },
})

// import React, { Component } from "react";
// import { Animated, Dimensions, Platform, Text, View } from 'react-native';
// import { Body, Header, List, ListItem as Item, ScrollableTab, Tab, Tabs, Title } from "native-base";

// const NAVBAR_HEIGHT = 56;
// const { width: SCREEN_WIDTH } = Dimensions.get("window");
// const COLOR = "rgb(45,181,102)";
// const TAB_PROPS = {
//     tabStyle: { width: SCREEN_WIDTH / 2, backgroundColor: COLOR },
//     activeTabStyle: { width: SCREEN_WIDTH / 2, backgroundColor: COLOR },
//     textStyle: { color: "white" },
//     activeTextStyle: { color: "white" }
// };

// export default class Home extends Component {
//     scroll = new Animated.Value(0);
//     headerY;

//     constructor(props) {
//         super(props);
//         this.headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, NAVBAR_HEIGHT), -1);
//     }

//     render() {
//         const tabY = Animated.add(this.scroll, this.headerY);
//         return (
//             <View>
//                 {Platform.OS === "ios" &&
//                     <View style={{ backgroundColor: COLOR, height: 20, width: "100%", position: "absolute", zIndex: 2 }} />}


//                     <Tabs renderTabBar={(props) => 
//                     <Animated.View
//                         style={[{
//                             transform: [{ translateY: tabY }],
//                             zIndex: 1,
//                             width: "100%",
//                             backgroundColor: COLOR,
//                             flex:1
//                         }, Platform.OS === "ios" ? { paddingTop: 20 } : null]}>
//                         <ScrollableTab {...props} underlineStyle={{ backgroundColor: "white" }} />
//                     </Animated.View>
//                     }>
//                         <Tab heading="Tab 1" {...TAB_PROPS} style={{flex:1}}>
//                             {
//                                 <List>
//                                     {
//                                         new Array(20).fill(null).map((_, i) => {
//                                             return (
//                                                 <Item key={i}><Text>Item {i}</Text></Item>
//                                             )
//                                         })
//                                     }
//                                 </List>
//                             }
//                         </Tab>
//                         <Tab heading="Tab 2" {...TAB_PROPS}>
//                             {
//                                 <List>
//                                     {
//                                         new Array(20).fill(null).map((_, i) => {
//                                             return (
//                                                 <Item key={i}><Text>Item {i}</Text></Item>
//                                             )
//                                         })
//                                     }
//                                 </List>
//                             }
//                         </Tab>
//                     </Tabs>
//             </View>
//         );
//     }
// }