import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from '../../components';
import {colors, Mixins} from '../../utils/styles';

const AuthModal = ({img, title, desc, textBtn, navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={img} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <Button
        title={textBtn}
        onPress={() => navigation.navigate('Login')}
        type="full"
        style={styles.button}
        textStyle={styles.buttonText}
      />
    </View>
  );
};

export default AuthModal;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.black,
  },
  desc: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: colors.grey,
  },
  button: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#2A378E',
    marginTop: 16,
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});
