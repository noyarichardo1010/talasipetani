import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function CustomRadio({
  text,
  setOption,
  selected,
  radioButtonBorderColor = '#000',
  radioButtonSize = 20,
  radioButtonBGColor = '#fff',
  selectedRadioButtonColor = '#000',
  selectedRadioButtonBorderColor = '#fff',
  optionTextStyling,
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        setOption(text);
      }}
      style={
        selected === text
          ? [
              styles.option,
              {
                borderColor: selectedRadioButtonBorderColor,
                backgroundColor: selectedRadioButtonColor,
              },
            ]
          : [
              styles.option,
              {
                borderColor: radioButtonBorderColor,
                backgroundColor: radioButtonBGColor,
              },
            ]
      }>
      <Text style={optionTextStyling}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginRight: 8,
    marginTop: 12,
    borderWidth: 1,
    position: 'relative',
  },
  selected: {
    borderRadius: 100,
    backgroundColor: '#000',
  },
});
