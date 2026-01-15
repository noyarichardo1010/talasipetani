import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {colors, gStyles} from '../../../utils/styles';
import Gap from '../Gap';
import Lottie from 'lottie-react-native';
import {IconLoading} from '../../../assets';

const Button = ({
  title,
  onPress,
  color,
  type,
  style,
  icon,
  textStyle,
  loading,
  isDisabled = false,
  left,
  right,
  paddingVertical = 13,
  fullWidth = true,
}) => {
  if (type === 'full') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.btnFull(color),
          style,
          {
            backgroundColor: isDisabled ? colors.neutral : colors.primary,
            paddingVertical: paddingVertical,
          },
        ]}
        disabled={isDisabled}>
        {loading ? (
          <View style={styles.btnWrapper}>
            {/* <Lottie
              style={gStyles.height(20)}
              source={require('../../../assets/icon/loading.json')}
              autoPlay
              loop
            /> */}
            <Image style={styles.loadingImage} source={IconLoading} />
          </View>
        ) : (
          <View style={styles.btnWrapper}>
            {left}
            {left && <Gap width={8} />}
            {icon ? icon : null}
            <Text
              style={[
                styles.btnText('#fff'),
                styles.textStyle,
                textStyle,
                {
                  color: isDisabled ? colors.grey2 : colors.light,
                },
              ]}>
              {title}
            </Text>
            {right && <Gap width={8} />}
            {right}
          </View>
        )}
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.btnOutline(color),
          style,
          {
            borderColor: isDisabled ? colors.neutral : colors.primary,
            paddingVertical: paddingVertical,
          },
        ]}
        disabled={isDisabled}>
        {loading ? (
          <Text>loading</Text>
        ) : (
          <View style={styles.btnWrapper}>
            {left}
            {left && <Gap width={8} />}
            {icon ? icon : null}
            <Text
              style={[
                styles.btnText(color),
                styles.textStyle,
                textStyle,
                {
                  color: isDisabled ? colors.neutral : colors.primary,
                },
              ]}>
              {title}
            </Text>
            {right && <Gap width={8} />}
            {right}
          </View>
        )}
      </TouchableOpacity>
    );
  }
};

export default Button;

const styles = StyleSheet.create({
  btnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
    textAlign: 'center',
  },
  loadingImage: {
    width: 25,
    height: 25,
  },
  btnFull: color => {
    return {
      backgroundColor: color,
      paddingVertical: 13,
      borderRadius: 4,
      paddingHorizontal: 6,
    };
  },
  btnText: color => {
    return {
      textAlign: 'center',
      color: color,
      fontWeight: '700',
    };
  },
  btnOutline: color => {
    return {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingVertical: 13,
      paddingHorizontal: 6,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: color,
    };
  },
});
