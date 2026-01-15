import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors, gStyles} from '../../../utils/styles';
import {IconBiometrik} from '../../../assets';

const title = 'Masuk Dengan Sidik Jari';
const desc = 'Silahkan letakkan jari Anda pada sensor sidik jari.';
const textBtn = 'Sentuh sensor sidik jari';

const LoginBiometrik = ({navigation, handleSubmit}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={[gStyles.marginVertical(16), styles.buttonBiometrik]}>
        <IconBiometrik fill={'#313447'} width={40} height={40} />
        <Text style={styles.buttonText}>{textBtn}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginBiometrik;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
    color: colors.black,
  },
  desc: {
    textAlign: 'left',
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '400',
    color: colors.grey,
  },
  buttonBiometrik: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#6B6D7A',
    fontSize: 12,
    marginTop: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 16,
  },
});
