import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors, gStyles} from '../../../../utils/styles';
import {Button} from '../../../../components';

const ModalDeletePhoneNumber = ({clickedData, handleSubmit, cancel}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hapus Nomor Handphone?</Text>
      <Text
        style={
          styles.desc
        }>{`Apakah Anda yakin ingin menghapus nomor ${clickedData.phone_number}?`}</Text>
      <View style={gStyles.row}>
        <Button
          title="Iya, Hapus"
          onPress={() => handleSubmit(clickedData.index)}
          type="outline"
          style={styles.btnOutline}
          textStyle={styles.btnOutlineText}
        />
        <Button
          title="Tidak"
          onPress={() => cancel()}
          type="full"
          style={styles.btn}
          textStyle={styles.btnText}
        />
      </View>
    </View>
  );
};

export default ModalDeletePhoneNumber;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 20,
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
  btnOutline: {
    paddingVertical: 13,
    borderRadius: 4,
    flex: 1,
    borderColor: '#2A378E',
    borderWidth: 1,
    marginRight: 5,
  },
  btn: {
    paddingVertical: 13,
    borderRadius: 4,
    backgroundColor: '#2A378E',
    flex: 1,
  },
  btnOutlineText: {
    color: '#2A378E',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
