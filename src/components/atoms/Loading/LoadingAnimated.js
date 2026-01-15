import {StyleSheet, Image, Dimensions, View, Modal} from 'react-native';
import React, {useEffect} from 'react';
import {IconLoading} from '../../../assets';
let {height, width} = Dimensions.get('window');

const LoadingAnimated = ({visible = false, handleBack = () => {}}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => handleBack()}>
      <View style={[styles.wrapper]}>
        <View style={[styles.wrapper, styles.overlayBackground]} />
        <Image style={styles.image} source={IconLoading} />
      </View>
    </Modal>
  );
};

export default LoadingAnimated;

const styles = StyleSheet.create({
  wrapper: {
    opacity: 1,
    position: 'absolute',
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    elevation: 30,
  },
  overlayBackground: {
    zIndex: 1,
    elevation: 1,
    opacity: 0.3,
    backgroundColor: 'black',
  },
  image: {
    width: 100,
    height: 100,
    zIndex: 2,
    elevation: 2,
  },
});
