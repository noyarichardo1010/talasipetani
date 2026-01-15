import {Dimensions, StyleSheet} from 'react-native';
import {Mixins, colors} from '../../../utils/styles';

const {width} = Dimensions;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    width: 107,
    height: 40,
  },
  dashboard: {
    borderRadius: 8,
    padding: 16,
    margin: 16,
    backgroundColor: '#fff',
  },
  dashboardAkunLama: {
    borderRadius: 8,
    padding: 12,
    margin: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.24)',
  },
  button: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: 'blue',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
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
  image: {
    width: 48,
    height: 48,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.neutral,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemChange: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.neutral,
  },
});

export default styles;
