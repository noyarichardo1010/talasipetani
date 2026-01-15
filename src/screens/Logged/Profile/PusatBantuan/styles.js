import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchField: {
    fontSize: 14,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#D1D5DC',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#092540',
  },
  field: {
    width: '90%',
  },
  listBantuan: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.8,
    paddingVertical: 14,
  },
  wrapperBantuanLainnya: (radius = 8) => {
    return {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderRadius: radius ? radius : 0,
      position: 'relative',
      flex: 1,
    };
  },
  textBantuanLainnya: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 2,
    padding: 12,
  },
  imageBackgroundBantuanLainnya: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    right: 0,
    height: '100%',
    width: 160,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  listItem: {
    marginVertical: 6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  wrapperFeedback: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E3E3E5',
    borderRadius: 4,
  },
  // HTML Converter
  p: {
    color: '#313447',
    fontSize: 14,
    lineHeight: 20,
    margin: 0,
    padding: 0,
    height: 'auto',
  },
  b: {weight: '700'},
  ul: {
    color: '#313447',
    fontSize: 14,
    lineHeight: 0,
    margin: 0,
    padding: 0,
    height: 'auto',
  },
  li: {
    color: '#313447',
    fontSize: 14,
    lineHeight: 25,
  },
});

export default styles;
