import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {RadioButtons} from '../../atoms';
import {gStyles} from '../../../utils/styles';
import {IconClose} from '../../../assets';

let {height, width} = Dimensions.get('window');

const FilterUnit = ({setFilterShowed, value, setValue, filterUnitOptions}) => {
  const handleChange = val => {
    setValue(val);
    setFilterShowed('');
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setFilterShowed('')}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setFilterShowed('')}>
            <IconClose fill={'#9AA2B1'} width={17} height={17} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Tipe Unit</Text>
        </View>
        <View style={gStyles.col}>
          {filterUnitOptions &&
            filterUnitOptions.map((obj, index) => (
              <React.Fragment key={index}>
                <RadioButtons
                  option={obj}
                  setOption={val => handleChange(val)}
                  selected={value}
                  radioButtonBorderColor="#BEBFC2"
                  radioButtonSize={22}
                  selectedRadioButtonColor="#fff"
                  selectedRadioButtonBorderColor="#C20102"
                  optionTextStyling={{
                    fontSize: 14,
                    color: '#1E1E1F',
                    fontWeight: '600',
                  }}
                  type="row-reverse"
                  key={obj}
                />
                <View style={gStyles.line('#DCDDE0', 1)} />
              </React.Fragment>
            ))}
        </View>
      </View>
    </View>
  );
};

export default FilterUnit;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: '#092540',
    opacity: 0.25,
  },
  container: {
    height: '90%',
    position: 'absolute',
    bottom: -25,
    width: width,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 6,
    marginLeft: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092540',
    marginLeft: 22,
  },
});
