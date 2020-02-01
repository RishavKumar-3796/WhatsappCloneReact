import React from 'react';
import {
    View,
    Image,
    Text,
    ListView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from './../../appConfig/color';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const callsData = [
    {
        "name": "Tony Stark",
        "call": "videocam",
        "date": "27-Oct",
        "time": "9:02 PM",
        "image": require("./../../assets/users/tony.jpg")

    },
    {
        "call": "call",
        "date": "25-Feb",
        "time": "5:46 PM",
        "name": "Captain Marvel",
        "image": require("./../../assets/users/captain_marvel.jpg")

    },
    {
        "call": "videocam",
        "date": "31-Jan",
        "time": "12:38 PM",
        "name": "Captain America",
        "image": require("./../../assets/users/captain.jpg")

    },
    {
        "call": "call",
        "date": "01-Jul",
        "time": "1:33 PM",
        "name": "Hulk",
        "image": require("./../../assets/users/hulk.jpg")

    },
    {
        "call": "videocam",
        "date": "19-Feb",
        "time": "3:59 AM",
        "name": "Natasha Romanoff",
        "image": require("./../../assets/users/natasha.jpg")

    },
    {
        "call": "call",
        "date": "12-Apr",
        "time": "9:57 AM",
        "name": "Nick Fury",
        "image": require("./../../assets/users/nick.jpg")

    },
    {
        "call": "videocam",
        "date": "13-Aug",
        "time": "9:37 PM",
        "name": "Black Panther",
        "image": require("./../../assets/users/panther.jpg")

    },
    {
        "call": "call",
        "date": "17-Dec",
        "time": "4:32 AM",
        "name": "Thanos",
        "image": require("./../../assets/users/thanos.jpg")

    },
    {
        "call": "videocam",
        "date": "02-Dec",
        "time": "12:56 AM",
        "name": "Thor",
        "image": require("./../../assets/users/thor.jpg")

    },
    {

        "name": "Vision",
        "call": "call",
        "date": "13-Sep",
        "time": "6:20 PM",
        "image": require("./../../assets/users/vision.jpg")

    }
]

class CallsTab extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <ListView
                    dataSource={ds.cloneWithRows(callsData)}
                    showsVerticalScrollIndicator={false}
                    renderRow={(Calls) => {
                        return (
                            <TouchableOpacity activeOpacity={0.5}>
                                <View style={styles.row}>
                                    <Image source={Calls.image} style={styles.pic} />
                                    <View style={{ justifyContent: 'space-between', flex: 1 }}>
                                        <View style={styles.nameContainer}>
                                            <Text style={styles.nameTxt}>
                                                {Calls.name}
                                            </Text>
                                        </View>
                                        <View style={styles.end}>
                                            <Icon
                                                name="call-received" size={15} color="#ed788b"
                                                style={{ marginLeft: 15, marginRight: 5 }}
                                            />
                                            <Text style={styles.time}>
                                                {Calls.date} {Calls.time}
                                            </Text>
                                        </View>
                                    </View>
                                    <Icon name={Calls.call} size={23} color={colors.themeColor} />
                                </View>

                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }
}

export default CallsTab;


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#eee',
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'flex-start',
    },
    pic: {
        borderRadius: 25,
        width: 50,
        height: 50,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nameTxt: {
        marginLeft: 15,
        fontWeight: '600',
        color: '#222',
        fontSize: 15,

    },
    mblTxt: {
        fontWeight: '200',
        color: '#777',
        fontSize: 13,
    },
    end: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontWeight: '400',
        color: '#666',
        fontSize: 15,

    },
});