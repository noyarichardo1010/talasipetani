import {StyleSheet, Image, View, Dimensions} from 'react-native';
import React from 'react';
import {IconLoading} from '../../../assets';
let {height, width} = Dimensions.get('window');

const Loading = () => {
  return (
    <View style={styles.wrapper}>
      <Image style={styles.image} source={IconLoading} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    opacity: 0.25,
    backgroundColor: 'black',
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});
