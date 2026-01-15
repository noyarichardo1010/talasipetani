import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

const Input = ({
  placeholder,
  borderColor,
  style,
  color,
  placeholderTextColor = 'gray',
  ...rest
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      {...rest}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#092540',
    borderColor: '#D1D5DC',
  },
});
