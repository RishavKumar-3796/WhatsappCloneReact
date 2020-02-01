import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated
} from 'react-native';
import colors from './../../appConfig/color';

class DefaultTabBar extends React.Component {
  icons = [];

  constructor(props) {
    super(props);
    this.icons = [];
    this.state = {
      tabHeight: new Animated.Value(50),
      tabOpacity: new Animated.Value(1),
    }
  }

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showSearchbar) {
      Animated.parallel([
        Animated.timing(this.state.tabHeight, {
          toValue: 0,
          duration: 300
        }),
        Animated.timing(this.state.tabOpacity, {
          toValue: 0,
          duration: 300
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(this.state.tabHeight, {
          toValue: 50,
          duration: 300
        }),
        Animated.timing(this.state.tabOpacity, {
          toValue: 1,
          duration: 300
        }),
      ]).start()
    }
  }

  setAnimationValue({ value, }) {
    this.icons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  }

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (204 - 59) * progress;
    const green = 89 + (204 - 89) * progress;
    const blue = 152 + (204 - 152) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    let height = this.props.showSearchbar ? 0 : 50;
    let opacity = this.props.showSearchbar ? 0 : 1;
    return (
      <Animated.View style={[styles.tabs, { height, opacity }]}>
        {this.props.tabs.map((tab, i) => {

          const containerWidth = this.props.containerWidth;
          const numberOfTabs = this.props.tabs.length;
          let isTabActive = this.props.activeTab === i;
          const textColor = isTabActive ? 'white' : '#6a7f89e3';
          const fontWeight = isTabActive ? 'bold' : 'bold';

          const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 3,
            backgroundColor: 'white',
            bottom: -0.5,
          };

          const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, containerWidth / numberOfTabs],
          });

          return (
            <>
              <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
                <Text style={{ color: textColor, fontWeight }}>{tab}</Text>
              </TouchableOpacity>
              <Animated.View
                style={[
                  tabUnderlineStyle,
                  {
                    transform: [
                      { translateX },
                    ]
                  },
                  this.props.underlineStyle,
                ]}
              />
            </>
          );
        })}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: colors.themeColor
  },
});

export default DefaultTabBar;