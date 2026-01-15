import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {gStyles} from '../../../utils/styles';

const EmptyStateUpdateHariIni = ({icon, title, desc}) => {
  return (
    <View style={styles.wrapper}>
      {icon ? icon : null}
      <Text
        style={[
          gStyles.text(16, '700', '#313447'),
          gStyles.marginBottom(8),
          gStyles.marginTop(16),
        ]}>
        {title ? title : 'Title'}
      </Text>
      <Text style={[gStyles.text(14, '400', '#797B8A')]}>
        {desc ? desc : 'Description'}
      </Text>
    </View>
  );
};

export default EmptyStateUpdateHariIni;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6F7',
    borderWidth: 1,
    borderColor: '#E3E3E5',
  },
});
