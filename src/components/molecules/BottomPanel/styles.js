import {Dimensions, StyleSheet} from 'react-native';
let {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: width,
    height: height,
    zIndex: 10,
    elevation: 10,
  },
  top_section: {
    position: 'relative',
    width: width,
    height: height,
    backgroundColor: '#092540',
    opacity: 0.25,
  },
  contentWrapper: {
    position: 'absolute',
    width: width,
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#313447',
    marginLeft: 10,
  },
});

export default styles;
