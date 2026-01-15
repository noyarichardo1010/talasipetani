import {StyleSheet, Text, View, Keyboard} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {gStyles} from '../../../../utils/styles';
import {Button, Input} from '../../../../components';
import {removeNonNumeric} from '../../../../utils/helpers/number';

const ModalAddPhoneNumber = ({clickedData, handleSubmit, setModalPosition}) => {
  const [data, setData] = useState({
    phoneNumber: '',
  });

  useEffect(() => {
    console.log('clickedData', clickedData);
    if (clickedData !== null) {
      handleChange('phoneNumber', clickedData.phone_number);
    }
  }, [clickedData]);

  const handleChange = useCallback(
    (forField, value) => {
      setData({
        ...data,
        [forField]: value,
      });
    },
    [data],
  );
  const isDisabled = data.phoneNumber === '';

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        // console.log('show',e);
        setModalPosition(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      e => {
        // console.log('hide',e);
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
        <Text style={gStyles.label('#6B6D7A', 13, '400')}>
          Nomor Handphone Baru
        </Text>
        <View style={styles.fieldContainer}>
          <Input
            placeholder={'Sample: 082312345678'}
            name="phoneNumber"
            placeholderTextColor={'#687083'}
            autoCorrect={false}
            autoCapitalize="none"
            value={data.phoneNumber}
            onChangeText={value =>
              handleChange('phoneNumber', removeNonNumeric(value))
            }
            style={gStyles.field}
            keyboardType="numeric"
          />
        </View>
      </View>
      <Button
        title="Simpan"
        onPress={() => handleSubmit(data.phoneNumber)}
        isDisabled={isDisabled}
        type="full"
      />
    </View>
  );
};

export default ModalAddPhoneNumber;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 25,
    backgroundColor: '#fff',
  },
});
