import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useRef} from 'react';
import ViewShot from 'react-native-view-shot';
import {gStyles} from '../../../utils/styles';
import QRCode from 'react-native-qrcode-svg';
import {IconWA} from '../../../assets';
import {setAlert, setMessage, setMessageType} from '../../../services';
import {useDispatch} from 'react-redux';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const QRCodeComponent = ({value, size = 300, message = 'Message value'}) => {
  const viewShotRef = useRef();
  const dispatch = useDispatch();
  const captureViewShot = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      RNFS.readFile(uri, 'base64').then(res => {
        let urlString = 'data:image/jpeg;base64,' + res;
        let options = {
          title: 'Penawaran',
          message: message,
          url: urlString,
          type: 'image/jpeg',
        };
        Share.open(options)
          .then(resShare => {
            console.log('resShare', resShare);
          })
          .catch(err => {
            err && console.log(err);
          });
      });
    } catch (error) {
      console.error('Gagal mengambil tangkapan layar:', error);
      dispatch(setMessage('Gagal mengambil tangkapan layar'));
      dispatch(setMessageType('error'));
      dispatch(setAlert(true));
    }
  };
  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} style={styles.qrcode}>
        <QRCode
          value={value}
          size={size} // Ukuran kode QR
          color="black" // Warna kode QR
          backgroundColor="white" // Warna latar belakang kode QR
        />
      </ViewShot>
      <TouchableOpacity onPress={captureViewShot} style={gStyles.buttonShare}>
        <IconWA
          fill="white"
          width={24}
          height={24}
          style={gStyles.marginRight(8)}
        />
        <Text style={gStyles.text(16, '500', 'white')}>
          Bagikan ke WhatsApp
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QRCodeComponent;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    flex: 1,
    backgroundColor: 'white',
  },
  qrcode: {
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E3E3E5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
});
