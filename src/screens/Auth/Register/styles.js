import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
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
  btnNext: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#2A378E',
  },
  btnNextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  haveAccountWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24,
  },
  haveAccountText: {color: '#313447'},
  haveAccountTextBtn: {fontWeight: '700', color: '#5866BB'},
  button: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

export default styles;
