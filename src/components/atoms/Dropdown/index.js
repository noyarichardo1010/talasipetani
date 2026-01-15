import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {IconDownArrow} from '../../../assets';

const Dropdown = ({
  label = '',
  list = [],
  contentCustom,
  styleButtonText = null,
  style,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [Selected, setSelected] = useState('');
  // console.log('disabled', disabled);
  const toggleDropdown = () => {
    if (!disabled) setVisible(!visible);
  };

  const onSelectHandler = val => {
    setVisible(!visible);
    setSelected(val);
  };

  const renderDropdown = () => {
    if (visible) {
      return (
        <ScrollView style={[styles.dropdown]}>
          {list.length > 0
            ? list.map(i => (
                <TouchableOpacity key={i} onPress={() => onSelectHandler(i)}>
                  <Text style={styles.dropdownText}>This {i}</Text>
                </TouchableOpacity>
              ))
            : null}
        </ScrollView>
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      disabled={disabled}
      onPress={toggleDropdown}>
      {renderDropdown()}
      <Text style={[styles.buttonText, styleButtonText]}>
        {Selected === '' ? label : Selected}
      </Text>
      <IconDownArrow style={styles.iconDropown} />
    </TouchableOpacity>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '100%',
    padding: 10,
    marginVertical: 8,
    zIndex: 1,
    backgroundColor: '#fff',
    borderColor: '#CBCCD1',
    borderWidth: 1,
    borderRadius: 4,
  },
  buttonText: {
    flex: 1,
  },
  iconDropown: {
    position: 'absolute',
    right: 10,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: 'auto',
    top: 50,
    height: 'auto',
    width: '115%',
    borderColor: '#CBCCD1',
    borderWidth: 1,
    borderRadius: 4,
    // zIndex: 3,
    // elevation: 3,
  },
  dropdownText: {
    padding: 10,
    margin: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#CBCCD1',
  },
});
