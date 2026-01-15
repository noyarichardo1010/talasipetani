import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from '../../../components';
import {colors, gStyles} from '../../../utils/styles';

const title = 'Keluar Aplikasi?';
const desc = 'Anda harus masuk ulang jika ingin mengakses aplikasi nantinya.';

const ModalLogout = ({navigation, handleSubmit, cancel}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <View style={gStyles.row}>
        <Button
          title="Iya, Keluar"
          onPress={() => handleSubmit()}
          type="outline"
          style={gStyles.btnSecondaryOutline}
          textStyle={gStyles.btnSecondaryOutlineText}
        />
        <Button
          title="Tidak"
          onPress={() => cancel()}
          type="full"
          style={gStyles.btnSecondary}
          textStyle={gStyles.btnSecondaryText}
        />
      </View>
    </View>
  );
};

export default ModalLogout;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  title: {
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
});
