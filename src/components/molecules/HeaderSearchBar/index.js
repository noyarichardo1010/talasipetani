import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {IconLeftArrow, IconSearch} from '../../../assets';
import {gStyles} from '../../../utils/styles';
import {Input} from '../../atoms';

const HeaderSearchBar = ({navigation, handleSearch}) => {
  return (
    <View style={styles.searchBarContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <IconLeftArrow fill={'#9AA2B1'} width={24} height={24} />
      </TouchableOpacity>
      <Input
        style={{marginLeft: 8, width: '92%'}}
        placeholder={'Cari komoditi'}
        onChangeText={val => handleSearch(val)}
      />
      <TouchableOpacity style={{position: 'absolute', right: 30}}>
        <IconSearch fill={'#CBCCD1'} width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderSearchBar;

const styles = StyleSheet.create({
  searchBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  searchBar: {
    marginTop: 56,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DC',
    borderRadius: 12,
    height: 40,
    paddingLeft: 16.67,
  },
  placeholder: {
    color: '#D1D5DC',
    fontSize: 14,
    paddingLeft: 7.5,
  },
});
