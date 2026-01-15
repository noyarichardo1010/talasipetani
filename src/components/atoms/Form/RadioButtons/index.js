import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {gStyles} from '../../../../utils/styles';

export default function RadioButtons({
  option,
  setOption,
  showOption = true,
  selected,
  radioButtonBorderColor = '#000',
  radioButtonSize = 20,
  selectedRadioButtonColor = '#000',
  selectedRadioButtonBorderColor = '#fff',
  optionTextStyling,
  type = 'row',
  styleTouchButton,
  icon = null,
  paddingTop = 12,
  paddingBottom = 10,
}) {
  let selectedRadioButtonSize = parseInt(radioButtonSize) / 2;
  return (
    <TouchableOpacity
      onPress={() => {
        setOption(option.option);
      }}
      style={styleTouchButton}>
      <View
        style={
          type === 'row-reverse'
            ? [
                styles.option,
                {paddingTop: paddingTop, paddingBottom: paddingBottom},
              ]
            : [styles.option, {paddingRight: 24}]
        }>
        <View
          style={
            type === 'row-reverse'
              ? [
                  styles.label,
                  {
                    flexDirection: 'row-reverse',
                  },
                ]
              : [styles.label, {flexDirection: 'row'}]
          }>
          <View
            style={
              selected === option.option
                ? [
                    styles.radio,
                    {
                      borderWidth: radioButtonSize / 2,
                      borderColor: selectedRadioButtonBorderColor,
                      height: radioButtonSize,
                      width: radioButtonSize,
                    },
                  ]
                : [
                    styles.radio,
                    {
                      borderColor: radioButtonBorderColor,
                      height: radioButtonSize,
                      width: radioButtonSize,
                    },
                  ]
            }>
            <View
              style={
                selected === option.option
                  ? [
                      styles.selected,
                      {
                        backgroundColor: selectedRadioButtonColor,
                        height: selectedRadioButtonSize,
                        width: selectedRadioButtonSize,
                      },
                    ]
                  : null
              }
            />
          </View>
          {showOption && (
            <View style={gStyles.flexCenter('row')}>
              {icon ? icon : null}
              <Text style={optionTextStyling}>{option.option}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingTop: 12,
    paddingBottom: 10,
  },
  label: {alignItems: 'center', justifyContent: 'space-between'},
  radio: {
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderRadius: 100,
    backgroundColor: '#000',
  },
});
