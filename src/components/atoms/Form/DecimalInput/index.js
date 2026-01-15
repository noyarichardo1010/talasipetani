import {StyleSheet, TextInput, Text, View} from 'react-native';
import React, {useState} from 'react';
import {TextInputMask} from 'react-native-masked-text';
import {gStyles} from '../../../../utils/styles';
import {MaskedTextInput} from 'react-native-mask-text';
import Input from '../Input';

const DecimalInput = ({value, onChangeText, onChangeDisplayText, ...props}) => {
  const [formattedValue, setFormattedValue] = useState(value.toString());

  const handleTextChange = (rawValue, displayValue) => {
    // console.log('rawValue', rawValue);
    // console.log('displayValue', displayValue);
    onChangeDisplayText(displayValue);
    setFormattedValue(displayValue);
    onChangeText(displayValue);
  };

  // return (
  //   <TextInputMask
  //     type={'money'}
  //     options={{
  //       precision: 2, // Number of decimal places
  //       separator: ',', // Thousand separator
  //       delimiter: '.', // Decimal separator
  //       unit: '', // Prefix
  //       suffix: '', // Suffix
  //     }}
  //     value={formattedValue}
  //     onChangeText={handleTextChange}
  //     keyboardType="numeric"
  //     style={gStyles.flex(1)}
  //   />
  // );
  // return (
  //   <MaskedTextInput
  //     type="currency"
  //     options={{
  //       prefix: '',
  //       decimalSeparator: ',',
  //       groupSeparator: '.',
  //       precision: 2,
  //     }}
  //     onChangeText={(text, rawText) => {
  //       handleTextChange(rawText, text);
  //       // console.log(parseFloat(text));
  //       // console.log(Number(rawText));
  //     }}
  //     style={gStyles.flex(1)}
  //     keyboardType="numeric"
  //   />
  // );
  return (
    <Input
      placeholder={'0'}
      name="number"
      placeholderTextColor={'#687083'}
      autoCorrect={false}
      autoCapitalize="none"
      value={value}
      onChangeText={val => onChangeText(val)}
      // defaultValue={formatNumberWithComma(Quantity)}
      // onChangeText={value => setQuantity(parseInt(removeNonNumeric(value)))}
      // onEndEditing={val => handleChange(val)}
      // value={Quantity}
      // defaultValue={Quantity}
      keyboardType={'number-pad'}
      style={{paddingRight: 65, borderWidth: 0, width: '90%'}}
      {...props}
    />
  );
};

export default DecimalInput;

const styles = StyleSheet.create({});
