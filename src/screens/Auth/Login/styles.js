import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    paddingHorizontal: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 129,
    height: 48,
  },
  screenTitle: {
    fontWeight: '700',
    marginTop: 32,
    fontSize: 24,
    color: '#313447',
    marginBottom: 24,
    textAlign: 'center',
  },

  footer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    left: 47,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 14,
    color: '#687083',
    marginRight: 2,
  },
  fieldContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
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
  loginWithWrapper: {display: 'flex', alignSelf: 'center', marginTop: 12},
  forgotPasswordWrapper: {display: 'flex', alignSelf: 'flex-end'},
  forgotPasswordText: {
    display: 'flex',
    alignSelf: 'flex-end',
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '700',
    color: '#5866BB',
  },
  showHidePassword: {position: 'absolute', right: 13},
  btnLogin: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#2A378E',
  },
  btnLoginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  dontHaveAccountWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24,
  },
  dontHaveAccountText: {color: '#313447'},
  dontHaveAccountTextBtn: {fontWeight: '700', color: '#5866BB'},
  biometrikBtn: {
    display: 'flex',
    justifyContent: 'center',
    padding: 12,
    alignSelf: 'center',
    backgroundColor: '#EBEBFF',
    borderColor: '#7F8EDD',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 24,
  },

  btnBantuan: {
    paddingVertical: 5,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    borderWidth: 0,
    justifyContent: 'center',
  },
});

export default styles;
