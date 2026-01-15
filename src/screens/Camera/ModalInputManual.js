import {StyleSheet, Text, View, Keyboard} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {gStyles} from '../../utils/styles';
import {Button, Input} from '../../components';
import {removeNonNumeric} from '../../utils/helpers/number';

const ModalInputManual = ({handleSubmit, setModalPosition}) => {
  const [data, setData] = useState({
    nomorPenawaran: '',
  });

  const handleChange = useCallback(
    (forField, value) => {
      setData({
        ...data,
        [forField]: value,
      });
    },
    [data],
  );
  const isDisabled = data.nomorPenawaran === '';

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        console.log('show', e);
        setModalPosition(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      e => {
        console.log('hide', e);
        setModalPosition(e.endCoordinates.height);
      },
    );

    // Clean up function
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={[gStyles.formInput]}>
        <Text
          style={[
            gStyles.label('#6B6D7A', 13, '400'),
            gStyles.weight('400'),
            gStyles.marginBottom(4),
          ]}>
          Nomor Penawaran
        </Text>
        <View style={styles.fieldContainer}>
          <Input
            placeholder={'Sample: 12345678910111213'}
            name="nomorPenawaran"
            placeholderTextColor={'#687083'}
            autoCorrect={false}
            autoCapitalize="none"
            value={data.nomorPenawaran}
            onChangeText={value =>
              handleChange('nomorPenawaran', removeNonNumeric(value))
            }
            style={gStyles.field}
            keyboardType="numeric"
          />
        </View>
      </View>
      <Button
        title="Simpan"
        onPress={() => handleSubmit(data.nomorPenawaran)}
        isDisabled={isDisabled}
        type="full"
      />
    </View>
  );
};

export default ModalInputManual;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 25,
    backgroundColor: '#fff',
  },
});
