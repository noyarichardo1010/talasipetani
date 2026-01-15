import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import {IconThreeDot} from '../../../assets';
import {gStyles} from '../../../utils/styles';

const {height} = Dimensions.get('window');

const LoadingScreen = ({title, desc, titleStyle, descStyle}) => {
  return (
    <View style={styles.wrapper}>
      <IconThreeDot fill="#93959E" width={50} height={50} />
      <Text
        style={[
          gStyles.text(14, '500', '#313447'),
          gStyles.marginVertical(8),
          titleStyle,
        ]}>
        {title ? title : 'Title'}
      </Text>
      <Text style={[gStyles.text(14, '400', '#797B8A'), descStyle]}>
        {desc ? desc : 'Desc'}
      </Text>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    display: 'flex',
    height: height,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
