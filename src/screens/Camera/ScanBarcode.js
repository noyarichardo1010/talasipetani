import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {Svg, Rect, Defs, Mask} from 'react-native-svg';
// import {RNCamera} from 'react-native-camera';
import {RNCamera} from 'react-native-camera-kit';
import {AppBar, BottomPanel, Button} from '../../components';
import {gStyles} from '../../utils/styles';
import {IconCloseCircle, IconReceipt} from '../../assets';
import {Image} from 'react-native-compressor';
import ModalInputManual from './ModalInputManual';

const {width, height} = Dimensions.get('window');
/**
 * ------------------------------------------------------------------------------------------------ *
 * @component ScanBarcode
 * @param {Function} onBack - a callback function for on back pressed
 * @summary Building Keys View Component
 * @returns a Components block
 * ------------------------------------------------------------------------------------------------ *
 */

const CameraMask = () => {
  return (
    <Svg height="100%" width="100%">
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Rect height="48%" width="75%" x="12.5%" y="18%" fill="black" />
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill="rgba(0, 0, 0, 0.8)"
        mask="url(#mask)"
        fill-opacity="0"
      />
    </Svg>
  );
};

const ScanBarcode = forwardRef(({onCapture, navigation, route}) => {
  const cameraRef = useRef();

  const handleDetectedBarcode = data => {
    // console.log('data', data);
    navigation.navigate('DetailSurvey', {nomorPenawaran: data});
  };

  const [isBottomPanelShowed, setIsBottomPanelShowed] = useState(false);
  const [modalPosition, setModalPosition] = useState(0);

  const [nomorPenawaran, setNomorPenawaran] = useState('');

  const handleSubmitNomorPenawaran = newNomorPenawaran => {
    setNomorPenawaran(newNomorPenawaran);

    setIsBottomPanelShowed(false);

    setModalPosition(0);
    navigation.navigate('DetailSurvey', {nomorPenawaran: newNomorPenawaran});
  };

  async function onCapture() {
    if (cameraRef) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      if (data) {
        const image = await Image.compress(data.uri, {
          //compress image
          compressionMethod: 'manual',
          quality: 0.5,
        });
        // setImage(image);
        // navigation.goBack();

        //go to screen preview

        //   navigation.navigate('PreviewImage', {
        //     image: image,
        //     base64: data.base64,
        //   });
      }
    }
  }

  return (
    <View style={styles.container}>
      <AppBar
        navigation={navigation}
        appBarColor={'#fff'}
        headerTextColor={'#313447'}
        hideRightContent
        iconLeft={<IconCloseCircle width={20} height={20} fill={'#313447'} />}
        title="Scan QR Code"
        titleStyle={{fontSize: 16}}
        borderBottom
        borderBottomColor={'#313447'}
      />

      {/* <View style={{flex: 1}}> */}
      {/* ini gabisa nge-mask  */}
      {/* <QRCodeScanner
        onRead={data => Alert.alert(data.data)}
        reactivate={true}
        reactivateTimeout={500}
        cameraContainerStyle={{backgroundColor: 'blue'}}
        cameraStyle={{height: '100%'}}
        containerStyle={{backgroundColor: 'red', flex: 1}}>
        <CameraMask />
        <View style={styles.maskOutter}>
          <View
            style={[{flex: maskRowHeight}, styles.maskRow, styles.maskFrame]}
          />
          <View style={[{flex: 30}, styles.maskCenter]}>
            <View style={[{width: maskColWidth}, styles.maskFrame]} />
            <View style={styles.maskInner} />
            <View style={[{width: maskColWidth}, styles.maskFrame]} />
          </View>
          <View
            style={[{flex: maskRowHeight}, styles.maskRow, styles.maskFrame]}
          />
        </View>
      </QRCodeScanner> */}
      {/* </View> */}

      <RNCamera
        ref={cameraRef}
        captureAudio={false}
        style={styles.camera}
        onBarCodeRead={data => handleDetectedBarcode(data)}
        type={RNCamera.Constants.Type.back}>
        <CameraMask />
      </RNCamera>

      <View style={[styles.snapWrapper, gStyles.padding(10)]}>
        <View style={styles.scanDesc}>
          <Text style={gStyles.text(14, '400', '#ffffff')}>
            Arahkan kode QR ke dalam bingkai
          </Text>
        </View>
        <Button
          title="Input Nomor Penawaran"
          onPress={() => setIsBottomPanelShowed(true)}
          icon={
            <IconReceipt
              fill="#2E3192"
              width={20}
              height={20}
              style={gStyles.marginRight(8)}
            />
          }
          style={styles.buttonInputManual}
          textStyle={styles.textInputManual}
        />
      </View>
      {isBottomPanelShowed ? (
        <BottomPanel
          closePanel={() => {
            setModalPosition(0);
            setIsBottomPanelShowed(false);
          }}
          height="auto"
          radius={12}
          withHeader
          clickOutsideToClosePanel
          showCloseBtn
          title={'Input Nomor Penawaran'}
          position={modalPosition}
          setModalPosition={setModalPosition}
          content={
            <ModalInputManual
              handleSubmit={handleSubmitNomorPenawaran}
              setModalPosition={setModalPosition}
            />
          }
        />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  snapWrapper: {
    display: 'flex',

    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  scanDesc: {
    backgroundColor: '#313447CC',
    // opacity: 0.8,
    marginBottom: 102,
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 4,
  },
  buttonInputManual: {
    backgroundColor: '#fff',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textInputManual: {fontWeight: '400', fontSize: 14},
});

export default ScanBarcode;
