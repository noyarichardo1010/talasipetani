import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  screenTitle: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitleRight: {
    fontSize: 24,
    fontWeight: '700',
    color: '#313447',
  },
  screenDesc: {
    fontSize: 14,
    fontWeight: '400',
    color: '#687083',
    marginTop: 16,
    marginBottom: 24,
  },
  fieldContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hideShowPassword: {position: 'absolute', right: 13},
  phoneNumberField: {
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
  btnSubmit: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#2A378E',
  },
  btnSubmitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default styles;
