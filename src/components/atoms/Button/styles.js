import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  btnFull: color => {
    return {
      backgroundColor: color,
      paddingVertical: 13,
      borderRadius: 8,
      width: '100%',
    };
  },
  btnText: color => {
    return {
      textAlign: 'center',
      color: color,
      fontWeight: '700',
    };
  },
  btnOutline: color => {
    return {
      backgroundColor: 'white',
      paddingVertical: 13,
      width: '100%',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: color,
    };
  },
});

export default styles;
