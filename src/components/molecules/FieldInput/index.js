import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {gStyles} from '../../../utils/styles';

import {Input} from '../../../components';

import {useTogglePasswordVisibility} from '../../../utils/hooks';

import {EyeClosed, EyeOpen} from '../../../assets';

const FieldInput = ({
  field,
  label,
  label2,
  data,
  checkIsEmpty,
  handleChange,
  content,
  passwordContent,
  style,
  placeholder,
  numeric = false,
}) => {
  const {passwordVisibility, rightIcon, handlePasswordVisibility} =
    useTogglePasswordVisibility();

  return (
    <View style={[gStyles.formInput, style]} key={field}>
      <Text style={gStyles.label('#6B6D7A', 14, '400')}>
        {label}
        {label2 && (
          <Text style={gStyles.text(13, '400', '#8F9099')}> {label2}</Text>
        )}
      </Text>

      <View style={gStyles.fieldContainer}>
        {content ? (
          content
        ) : (
          <>
            <Input
              placeholder={placeholder ? placeholder : `Masukan ${label} Anda`}
              name={field}
              placeholderTextColor={'#687083'}
              autoCorrect={false}
              autoCapitalize="none"
              value={data[field]}
              secureTextEntry={passwordContent && passwordVisibility}
              keyboardType={numeric ? 'numeric' : 'text'}
              onChangeText={value => handleChange(field, value)}
              style={[
                gStyles.inputField,
                {borderColor: checkIsEmpty(field) ? '#F36767' : '#CBCCD1'},
              ]}
            />
            {passwordContent && (
              <TouchableOpacity
                onPress={handlePasswordVisibility}
                style={gStyles.showHidePassword}>
                {rightIcon === 'eye-off' ? (
                  <EyeOpen fill="#8F9099" width={22} height={22} />
                ) : (
                  <EyeClosed fill="#8F9099" width={22} height={22} />
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      {checkIsEmpty(field) && (
        <Text style={gStyles.text(12, '400', '#F36767')}>
          Mohon isi {label}
        </Text>
      )}
      {/* {checkLengthMore4(field) && (
        <Text style={gStyles.text(12, '400', '#F36767')}>
         {label} Tidak boleh kurang dari
        </Text>
      )} */}
    </View>
  );
};

export default FieldInput;
