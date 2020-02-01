import { StyleSheet, Platform, Dimensions } from 'react-native';
import color from '../appConfig/color';
import fonts from '../appConfig/font';
const deviceWidth = Dimensions.get("window").width;

export default commonStyle = {
  container: {
    flex: 1
  },
  padding10: {
    padding: 10
  },
  pv10: {
    paddingVertical: 10
  },
  ph10: {
    paddingHorizontal: 10
  },
  pv20: {
    paddingVertical: 20
  },
  ph20: {
    paddingHorizontal: 20
  },
  fdRow: {
    flexDirection: 'row'
  },
  flex1: {
    flex: 1
  },
  jcCntr: {
    justifyContent: 'center'
  },
  aiCntr: {
    alignItems: 'center'
  },
  jcaiCntr: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  homeTopBtn: {
    padding: 10
  },
  inputShadowView: {
    backgroundColor: '#f6f1ec',
    paddingBottom: 30,
    borderRadius: 80,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    shadowOpacity: 0.6,
    shadowColor: color.ccc,
    borderWidth: 7,
    borderColor: color.white
  },
  inputView: {
    backgroundColor: color.white,
    borderRadius: 3,
    justifyContent: 'center',
    marginHorizontal: 10,
    elevation: 17,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    shadowColor: color.ccc
  },
  inputViewAbs: {
    backgroundColor: color.white,
    borderRadius: 3,
    justifyContent: 'center',
    position: 'absolute',
    width: deviceWidth - 40,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    shadowColor: color.ccc
  },
  inputBtnView: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderColor: color.ccc
  },
  inputBtn: {
    paddingVertical: 10,
    width: 200,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: color.themeColor,
  },

}