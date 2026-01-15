import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BoxBgIcon, IconNote} from '../../../assets';
import {gStyles} from '../../../utils/styles';

const EmptyList = ({title = 'Title', desc = 'Desc', type = 'half'}) => {
  return (
    <View style={type === 'full' ? styles.wrapperFull : styles.wrapper}>
      <BoxBgIcon />
      <Text style={[gStyles.text(16, '700', '#313447'), gStyles.marginTop(16)]}>
        {title}
      </Text>
      <Text
        style={[
          gStyles.text(14, '400', '#797B8A'),
          gStyles.marginTop(8),
          gStyles.textCenter,
        ]}>
        {desc}
      </Text>
    </View>
  );
};

export default EmptyList;

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#F5F6F7',
    borderWidth: 1,
    borderColor: '#E3E3E5',
  },
  wrapperFull: {
    display: 'flex',
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,

    backgroundColor: '#fff',
  },
});
