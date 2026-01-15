import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IconSearch, IconShip} from '../../../assets';

const DataNotFound = ({icon, title, desc, backgroundColor, bgFill, fill}) => {
  return (
    <View style={[styles.wrapper, {backgroundColor: backgroundColor}]}>
      <View style={[styles.icon, {backgroundColor: bgFill}]}>
        {icon === 'vessel' ? (
          <IconShip fill={fill} width={27} height={27} />
        ) : (
          <IconSearch fill={fill} width={27} height={27} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  );
};

export default DataNotFound;

const styles = StyleSheet.create({
  wrapper: {flex: 0.8, alignItems: 'center', justifyContent: 'center'},
  icon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 24,
    fontWeight: '700',
    fontSize: 18,
    color: '#687083',
  },
  desc: {
    fontWeight: '400',
    fontSize: 14,
    color: '#687083',
    marginTop: 8,
  },
});
