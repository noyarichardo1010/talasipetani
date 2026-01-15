/* eslint-disable react-native/no-inline-styles */
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {colors, Mixins} from '../../../../utils/styles';

const OTPInput = ({column = 4, onSubmit, containerStyle, inputStyle}, ref) => {
  const [inputs, setInputs] = useState({});

  const [refs, setRefs] = useState([useRef(null)]);

  useEffect(() => {
    let arr = {};
    const reff = [];

    for (var i = 0; i < column; i++) {
      arr[i] = '';
      reff.push(React.createRef(null));
    }
    setRefs(reff);
    setInputs(arr);
  }, [column]);

  const submitValue = lastValue => {
    let output = '';
    var keys = Object.keys(inputs);
    // console.log(keys);
    // console.log(inputs);
    for (var i = 0; i < keys.length; i++) {
      output += inputs[keys[i]];
    }
    if (lastValue) {
      output += lastValue;
    }
    console.log('output', output);
    onSubmit(output);
  };

  function clearInput() {
    for (var i = 0; i < column; i++) {
      refs.current[i].clear();
    }
  }

  useImperativeHandle(ref, () => ({
    // methods connected to `ref`
    clearInput: () => {
      clearInput();
    },
  }));
  return (
    <View style={[styles.otpContainer, containerStyle]}>
      {Object.keys(inputs).map((item, index) => {
        let previous = index - 1;
        let next = index + 1;
        return (
          <View
            key={index}
            style={[
              styles.otpBox,
              {
                borderColor: refs[index]?.current?.isFocused()
                  ? colors.primary
                  : colors.neutral,
                marginLeft: index === 0 ? 0 : 5,
                marginRight: index === inputs.length - 1 ? 0 : 5,
              },
            ]}>
            <TextInput
              ref={refs[index]}
              maxLength={1}
              style={[styles.otpText, inputStyle]}
              keyboardType="number-pad"
              selectTextOnFocus
              returnKeyType="next"
              onChangeText={text => {
                setInputs({...inputs, [index]: text});
                if (text || text !== '') {
                  if (index === column - 1) {
                    refs[index]?.current?.blur();
                    submitValue(text);
                  } else if (next === column) {
                  } else {
                    refs[next]?.current?.focus();
                  }
                } else {
                  if (previous >= 0) {
                    refs[previous]?.current?.focus();
                  }
                }
              }}
              onSubmitEditing={() => {
                if (next <= column - 2) {
                  refs[next]?.current?.focus();
                } else {
                  submitValue();
                }
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

export default forwardRef(OTPInput);

const styles = StyleSheet.create({
  otpContainer: {
    marginTop: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  otpBox: {
    // width: Mixins.scaleSize(48),
    flex: 1,
    height: Mixins.scaleSize(48),
    borderRadius: 4,
    borderColor: colors.neutral,
    borderWidth: 1,
  },
  otpText: {
    fontSize: Mixins.scaleSize(20),
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
