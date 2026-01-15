import {View, Text, TouchableOpacity, BackHandler, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {IconEmptyWalletTime} from '../../../assets';
import {gStyles} from '../../../utils/styles';

const OTPVia = ({onPress, goBack = () => Alert.alert('go back')}) => {
  // useEffect(() => {
  //   async function load() {
  //     const token = await AsyncStorage.getItem('token');
  //     const user = await AsyncStorage.getItem('user');
  //     console.log('token', token);
  //     console.log('user', user);
  //   }
  //   load();
  // }, []);

  // useEffect(() => {
  //   const backAction = () => {
  //     // Tambahkan logika atau tindakan yang ingin Anda lakukan ketika tombol "Back" ditekan di sini
  //     // Misalnya, Anda bisa menampilkan pesan konfirmasi atau menavigasi kembali

  //     // Sample: Menampilkan pesan konfirmasi sebelum keluar dari aplikasi
  //     Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin keluar?', [
  //       {
  //         text: 'Tidak',
  //         onPress: () => null, // Tidak melakukan apa-apa
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Ya',
  //         onPress: () => goBack(), // Keluar dari aplikasi
  //       },
  //     ]);

  //     return true; // Kembalikan 'true' agar tindakan default tombol "Back" tidak terjadi
  //   };

  //   // Tambahkan listener untuk tombol "Back"
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   // Membersihkan listener saat komponen unmount
  //   return () => {
  //     backHandler.remove();
  //   };
  // }, []);

  const ButtonOTP = ({onChoice, content}) => (
    <TouchableOpacity
      onPress={via => onChoice(via)}
      style={[
        gStyles.row_center3,
        {
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#E3E3E5',
          marginBottom: 16,
          padding: 16,
        },
      ]}>
      {content}
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, padding: 16}}>
      <Text style={[gStyles.text(24, '700', '#313447'), {marginBottom: 16}]}>
        Metode Pengiriman OTP
      </Text>
      <Text style={[gStyles.text(14, '400', '#313447'), {marginBottom: 20}]}>
        Pilih lewat mana OTP akan dikirim.
      </Text>
      <View>
        <ButtonOTP
          onChoice={() => onPress('email')}
          content={
            <>
              <IconEmptyWalletTime fill={'#2E3192'} />
              <Text
                style={[{marginLeft: 12}, gStyles.text(14, '500', '#313447')]}>
                Kirim Lewat Email
              </Text>
            </>
          }
        />
        <ButtonOTP
          onChoice={() => onPress('phone')}
          content={
            <>
              <IconEmptyWalletTime fill={'#2E3192'} />
              <Text
                style={[{marginLeft: 12}, gStyles.text(14, '500', '#313447')]}>
                Kirim Lewat Nomor Handphone
              </Text>
            </>
          }
        />
      </View>
    </View>
  );
};

export default OTPVia;
