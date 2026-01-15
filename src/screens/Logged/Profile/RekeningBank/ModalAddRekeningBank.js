import {StyleSheet, Text, View, Keyboard} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {gStyles, pickerStyle} from '../../../../utils/styles';
import {Button, Input} from '../../../../components';
import {removeNonNumeric} from '../../../../utils/helpers/number';
import RNPickerSelect from 'react-native-picker-select';
import {useDispatch, useSelector} from 'react-redux';

const ModalAddRekeningBank = ({
  clickedData,
  handleSubmit,
  setModalPosition,
}) => {
  const dispatch = useDispatch();

  const {bankMaster} = useSelector(reducer => reducer.profile);

  const [data, setData] = useState({
    bank_id: '',
    bank_account_name: '',
    bank_account_number: '',
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

  useEffect(() => {
    console.log('bankMaster', bankMaster);
    if (clickedData !== null) {
      setData({
        bank_id: clickedData.bank_id,
        bank_account_number: clickedData.bank_account_number,
        bank_account_name: clickedData.bank_account_name,
      });
    }
  }, [clickedData]);

  const isDisabled =
    data.bank_id === '' ||
    data.bank_account_number === '' ||
    data.bank_account_name === '';

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        setModalPosition(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      e => {
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
    <View style={[styles.container, gStyles.col]}>
      <View>
        <View style={gStyles.formInput}>
          <Text
            style={[
              gStyles.label('#6B6D7A', 13, '400'),
              gStyles.weight('400'),
            ]}>
            Bank
          </Text>
          <View style={gStyles.field}>
            <RNPickerSelect
              items={bankMaster}
              onValueChange={value => handleChange('bank_id', value)}
              value={data.bank_id}
              style={pickerStyle}
              placeholder={{label: 'Pilih bank', value: null, color: '#6B6D7A'}}
            />
          </View>
        </View>
        <View style={[gStyles.formInput]}>
          <Text
            style={[
              gStyles.label('#6B6D7A', 13, '400'),
              gStyles.weight('400'),
            ]}>
            Nomor Rekening
          </Text>
          <View style={styles.fieldContainer}>
            <Input
              name="bank_account_number"
              placeholderTextColor={'#687083'}
              autoCorrect={false}
              autoCapitalize="none"
              value={data?.bank_account_number}
              onChangeText={value =>
                handleChange('bank_account_number', removeNonNumeric(value))
              }
              style={gStyles.field}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={[gStyles.formInput]}>
          <Text
            style={[
              gStyles.label('#6B6D7A', 13, '400'),
              gStyles.weight('400'),
            ]}>
            Nama Pemilik Rekening
          </Text>
          <View style={styles.fieldContainer}>
            <Input
              name="bank_account_name"
              placeholderTextColor={'#687083'}
              autoCorrect={false}
              autoCapitalize="none"
              value={data.bank_account_name}
              onChangeText={value => handleChange('bank_account_name', value)}
              style={gStyles.field}
            />
          </View>
        </View>
      </View>
      <Button
        // style={{bottom: 0}}
        title="Simpan"
        onPress={() =>
          handleSubmit(
            data.bank_id,
            data.bank_account_number,
            data.bank_account_name,
            clickedData?.index,
            data,
            clickedData !== null ? 'edit' : 'add',
          )
        }
        isDisabled={isDisabled}
        type="full"
      />
    </View>
  );
};

export default ModalAddRekeningBank;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 25,
    backgroundColor: '#fff',
    flex: 1,
  },
});
