import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {colors, gStyles} from '../../../../utils/styles';
import {IconSelectDropdown, IconSelectUp} from '../../../../assets';
import {Dropdown} from 'react-native-element-dropdown';

const Select = ({
  value,
  setValue,
  data,
  label,
  placeholder,
  searchable = false,
  animationLabel = false,
  disable = false,
  emptyField = false,
  deleteValue = false,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: colors.primary}]}>
          {label}
        </Text>
      );
    }
    return null;
  };
  // console.log('emptyField', label, emptyField);
  return (
    <View style={[gStyles.formInput]}>
      {animationLabel ? (
        renderLabel()
      ) : (
        <View
          onPress={() => setValue(false)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={[
              gStyles.label('#6B6D7A', 14, '400'),
              gStyles.marginBottom(6),
            ]}>
            {label}
          </Text>

          {deleteValue !== false && value !== false && (
            <TouchableOpacity onPress={deleteValue}>
              <Text
                style={[
                  gStyles.label('red', 14, '400'),
                  gStyles.marginBottom(6),
                ]}>
                Kosongkan
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* emptyField ? {borderWidth: 1, borderColor: 'red'} : {}, */}
      <Dropdown
        style={[
          gStyles.field,
          {
            padding: 10,
            borderColor: disable ? 'transparent' : '#CBCCD1',
            borderWidth: 1,
            borderRadius: 4,
            backgroundColor: disable ? '#F5F6F7' : 'white',
            color: 'black',
            borderColor: emptyField
              ? 'red'
              : isFocus
              ? colors.primary
              : '#D1D5DC',
          },
        ]}
        selectedStyle={{color: 'gray'}}
        disable={disable}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={searchable ? true : false}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={
          !isFocus ? (placeholder ? placeholder : 'Select item') : '...'
        }
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
        renderRightIcon={() =>
          isFocus ? (
            <IconSelectUp width={15} height={15} fill="grey" />
          ) : (
            <IconSelectDropdown width={15} height={15} fill="grey" />
          )
        }
      />
      {emptyField && (
        <Text style={gStyles.text(12, '400', '#F36767')}>
          Mohon pilih {label}
        </Text>
      )}
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  field: {
    paddingVertical: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'grey',
  },
  itemTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderColor: '#CBCCD1',
    color: 'black',
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 0.5,
  },
});
