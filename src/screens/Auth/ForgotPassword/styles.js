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
    fontSize: 20,
    fontWeight: '700',
    color: '#313447',
  },
  screenTitleLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EBEBFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 40,
  },
  screenTitleLeftText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 5,
  },
  screenDesc: {
    fontSize: 14,
    fontWeight: '400',
    color: '#687083',
    marginTop: 16,
    marginBottom: 24,
  },
  inputField: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#092540',
    borderColor: '#CBCCD1',
  },
  screenForm: {
    paddingHorizontal: 8,
  },
  btnForgotPassword: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: colors.primary,
  },
  btnForgotPasswordText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  btnBackToLogin: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#ffffff',
    borderColor: colors.primary,
  },
  btnBackToLoginText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default styles;
