export const gStyles = {
  full: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    // backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    elevation: 4, // for Android only
    shadowColor: '#000', // for iOS only
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  screenContainer: bgColor => {
    return {
      display: 'flex',
      flex: 1,
      backgroundColor: bgColor ? bgColor : '#fff',
    };
  },
  textRed: {
    color: '#CF1701',
    fontWeight: 'bold',
  },
  textSuccess: {
    color: '#149614',
    fontWeight: '500',
    fontSize: 12,
  },
  textGrey: {
    color: '#797B8A',
    fontWeight: '400',
    fontSize: 12,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  height: value => {
    return {height: value};
  },

  dimension: (width, height) => {
    return {
      width: width,
      height: height,
    };
  },
  rowWithoutJustify: {
    display: 'flex',
    flexDirection: 'row',
  },
  row_2: {
    display: 'flex',
    flexDirection: 'row',
  },
  row_3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  row_center: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  row_center2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row_center3: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  row_center4: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  col_2: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mgpdScrollView: {
    marginBottom: 120,
    padding: 8,
  },
  formInput: {
    marginBottom: 16,
  },
  flexCenter: direction => {
    return {
      display: 'flex',
      flexDirection: direction,
      alignItems: 'center',
      justifyContent: 'center',
    };
  },

  position: position => {
    return {position: position};
  },
  label: (color, size, weight) => {
    return {
      fontWeight: weight ? weight : '400',
      fontSize: size ? size : 16,
      marginBottom: 6,
      color: color ? color : '#6B6D7A',
    };
  },

  fieldContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  inputField: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#092540',
    borderColor: '#CBCCD1',
    backgroundColor: '#FFFFFF',
  },
  passwordField: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#092540',
    borderColor: '#CBCCD1',
  },

  showHidePassword: {position: 'absolute', right: 13},

  field: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
    color: 'black',
    backgroundColor: 'transparent',
    borderColor: '#CBCCD1',
  },

  card: {
    display: 'flex',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3E3E5',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  cardNoBorder: {
    display: 'flex',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  cardSpace: {
    borderRadius: 0,
    marginBottom: 10,
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomColor: '#E3E3E5',
    borderBottomWidth: 1,
  },
  cardFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopColor: '#E3E3E5',
    borderTopWidth: 1,
  },
  boxIcon: {
    // padding: 10,
    // backgroundColor: '#F5F6F7',
    // borderRadius: 50,
    width: 48,
    height: 48,
    borderRadius: 40,
    backgroundColor: '#F5F6F7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  borderColor: color => {
    return {borderColor: color};
  },
  textareaWrapper: (height, borderColor) => {
    return {
      height: height ? height : 84,
      borderWidth: 1,
      borderColor: borderColor ? borderColor : '#D1D5DC',
      borderRadius: 4,
      padding: 8,
      paddingTop: 0,
    };
  },
  chatField: {
    color: '#092540',
    height: 68,
    fontSize: 14,
  },

  textarea: (height, size) => {
    return {
      color: '#092540',
      height: height ? height : 68,
      fontSize: size ? size : 14,
      textAlignVertical: 'top',
    };
  },
  primaryButton: {
    backgroundColor: '#CF1701',
    paddingVertical: 13,
    // marginTop: 20,
    borderRadius: 8,
  },
  buttonShare: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#2E3192',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  textPrimaryButton: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
  },
  textSmRegular: {
    fontWeight: '400',
    size: 12,
  },
  textMdBold: {
    fontWeight: '700',
    size: 14,
  },

  flex: size => {
    return {
      flex: size,
    };
  },
  fontSize: size => {
    return {
      fontSize: size,
    };
  },
  weight: weight => {
    return {
      fontWeight: weight,
    };
  },
  text: (size, weight, color) => {
    return {
      fontSize: size,
      fontWeight: weight,
      color: color,
    };
  },
  textAlign: align => {
    return {
      textAlign: align,
    };
  },
  space: value => {
    return {
      height: value,
    };
  },
  paddingTop: value => {
    return {
      paddingTop: value,
    };
  },
  paddingBottom: value => {
    return {
      paddingBottom: value,
    };
  },
  margin: value => {
    return {
      margin: value,
    };
  },
  marginTop: value => {
    return {
      marginTop: value,
    };
  },
  marginBottom: value => {
    return {
      marginBottom: value,
    };
  },
  marginRight: value => {
    return {
      marginRight: value,
    };
  },
  marginLeft: value => {
    return {
      marginLeft: value,
    };
  },

  marginHorizontal: value => {
    return {
      marginHorizontal: value,
    };
  },
  marginVertical: value => {
    return {
      marginVertical: value,
    };
  },
  line: (color, height) => {
    return {
      borderTopColor: color,
      borderTopWidth: height,
    };
  },
  padding: value => {
    return {
      padding: value,
    };
  },
  paddingVertical: value => {
    return {
      paddingVertical: value,
    };
  },
  paddingHorizontal: value => {
    return {
      paddingHorizontal: value,
    };
  },
  pLeft: value => {
    return {
      paddingLeft: value,
    };
  },
  pRight: value => {
    return {
      paddingRight: value,
    };
  },
  bottomBoxShadow: (height, color) => {
    return {
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,
      elevation: 15,
      shadowColor: color,
      height: height,
    };
  },
  borderRadius: radius => {
    return {
      borderRadius: radius,
    };
  },
  boxWrapper: {
    width: 48,
    height: 48,
    borderRadius: 40,
    backgroundColor: '#F5F6F7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  textCenter: {
    textAlign: 'center',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  textTitleScreen: {
    color: '#687083',
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  textWrapper: {marginBottom: 8, flexDirection: 'row'},
  textLabel: {
    color: '#687083',
    fontSize: 14,
    fontWeight: '400',
    width: 95,
    marginRight: 12,
  },
  textValue: {
    color: '#092540',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  textScore: {
    color: '#687083',
    fontSize: 14,
    fontWeight: '400',
    marginRight: 12,
  },
  textAppName: {fontSize: 14, marginTop: 8, fontWeight: '700'},

  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  shadowTitle: {
    zIndex: 3,
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 5,
  },
  gradeCard: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 3,
    paddingHorizontal: 8,
    // height: 24,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 12,
    color: '#313447',
    // marginHorizontal: 4,
  },
  gradeA: {
    backgroundColor: '#FFEBEB',
    borderColor: '#F36767',
  },
  gradeB: {
    backgroundColor: '#FFF6EB',
    borderColor: '#FFBD66',
  },
  gradeC: {
    backgroundColor: '#EBF8FF',
    borderColor: '#83D4FF',
  },
  gradeFAIL: {
    backgroundColor: '#FFEBEB',
    borderColor: '#F36767',
  },
  gradeLOW: {
    backgroundColor: '#FFF6EB',
    borderColor: '#FFBD66',
  },
  gradePASS: {
    backgroundColor: '#EBF8FF',
    borderColor: '#83D4FF',
  },
  gradeHIGH: {
    backgroundColor: '#EBF8FF',
    borderColor: '#83D4FF',
  },
  btnSecondaryOutline: {
    paddingVertical: 13,
    borderRadius: 4,
    flex: 1,
    borderColor: '#2A378E',
    borderWidth: 1,
    marginRight: 5,
  },
  btnSecondary: {
    paddingVertical: 13,
    borderRadius: 4,
    backgroundColor: '#2A378E',
    flex: 1,
  },
  btnSecondaryOutlineText: {
    color: '#2A378E',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  btnSecondaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  absoluteBottom: {position: 'absolute', bottom: 0, left: 0, right: 0},
  badgeVoucher: {
    flexDirection: 'row',
    backgroundColor: '#FF9100',
    justifyContent: 'space-around',
    width: 115,
    padding: 4,
    // paddingHorizontal: 8,
    borderRadius: 4,
    borderBottomRightRadius: 0,
    position: 'absolute',
    right: '-3%',
    top: '-2%',
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: 'transparent',
    borderTopColor: '#B86800',
    position: 'absolute',
    right: 0,
    top: 25,
  },
  btnOutlinePrimary: {
    paddingVertical: 8,
    borderRadius: 4,
    flex: 1,
    borderColor: '#2A378E',
    borderWidth: 1,
    marginRight: 5,
  },
  btnPrimary: {
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#2A378E',
    flex: 1,
  },
  btnOutlinePrimaryText: {
    color: '#2A378E',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
};

export const pickerStyle = {
  inputIOS: {
    color: '#092540',
    backgroundColor: 'white',
    borderRadius: 5,
    // paddingHorizontal: 16,
    // paddingVertical: 16,
  },
  placeholder: {
    color: '#6B6D7A',
  },
  inputAndroid: {
    color: '#092540',
    backgroundColor: 'white',
    borderRadius: 5,
  },
};

export const colors = {
  default: '#2194f3',
  darkDefault: '#15317E',
  disable: '#A5B1C2',
  dark: '#474747',
  light: '#e4f2f7',
  text: {
    default: '#7E7E7E',
  },
  lightPrimary: '#EBEBFF',
  darkPrimary: '#15317E',
  primary: '#2A378E',
  neutral: '#E3E3E5',
  grey: '#93959E',
  grey2: '#CBCCD1',
  black: '#313447',
  softBlue: '#EBF8FF',
  blue: '#31B8FF',
  green: '#149617',
};

export const darkTheme = {
  mode: 'dark',
  backgroundColor: '#212121',
  secondaryBackgroundColor: '#282828',
  headerBackgroundColor: colors.darkDefault,
  secondaryHeaderBackgroundColor: '#474747',
  headerTextColor: '#fff',
  iconColor: '#fff',
  activeIconColor: '#15317E',
  textColor: '#ffffff',
  secondaryTextColor: '#aaa',
  buttonColor: colors.light,
  buttonTextColor: '#ffffff',
  borderColor: '#15317E',
  statusBarColor: '#15317E',
  statusBarStyle: 'light-content',
  bgSuccessColor: '#1b5e20',
  bgErrorColor: '#e53935',
  bgWaitingColor: '#263238',
  textSuccessColor: '#fff',
  textErrorColor: '#fff',
  textWaitiginColor: '#fff',
};

export const lightTheme = {
  mode: 'light',
  backgroundColor: '#fff',
  secondaryBackgroundColor: '#F5F5F5',
  headerBackgroundColor: '#244B93',
  secondaryHeaderBackgroundColor: '#ebf3ff',
  headerTextColor: '#fff',
  iconColor: colors.grey,
  activeBackgroundIconColor: colors.lightPrimary,
  activeIconColor: colors.primary,
  textColor: colors.black,
  secondaryTextColor: colors.grey,
  buttonColor: '#244B93',
  buttonTextColor: '#ffffff',
  borderColor: '#fff',
  statusBarColor: '#244B93',
  statusBarStyle: 'default',
  bgSuccessColor: '#43a047',
  bgErrorColor: '#b71c1c',
  bgWaitingColor: '#546e7a',
  textSuccessColor: '#fff',
  textErrorColor: '#fff',
  textWaitiginColor: '#fff',
};

import * as Mixins from './mixins';

export {Mixins};
