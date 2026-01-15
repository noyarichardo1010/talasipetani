import React, {forwardRef, useEffect, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Svg, Rect, Defs, Mask} from 'react-native-svg';
// import {RNCamera} from 'react-native-camera';
import { RNCamera, useCameraDevices } from 'react-native-camera-kit';
import {AppBar, Button} from '../../components';
import {gStyles} from '../../utils/styles';
import {IconLeftArrow} from '../../assets';
import {Image} from 'react-native-compressor';
/**
 * ------------------------------------------------------------------------------------------------ *
 * @component CameraDocument
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
          <Rect rx={8} height="80%" width="80%" x="10%" y="5%" fill="black" />
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

const CameraDocument = forwardRef(({onCapture, navigation, route}) => {
  const {setChooseFromWhere, setImage} = route.params;

  const cameraRef = useRef();

  useEffect(() => {
    setChooseFromWhere('');

    console.log('');
  }, []);

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
        setImage(image);
        navigation.goBack();

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
        iconLeft={<IconLeftArrow width={15} height={15} fill={'#313447'} />}
        title="Foto Document"
        titleStyle={{fontSize: 16}}
        borderBottom
        borderBottomColor={'#313447'}
      />
      <RNCamera
        ref={cameraRef}
        captureAudio={false}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}>
        <CameraMask />
      </RNCamera>

      <View style={[styles.snapWrapper, gStyles.padding(20)]}>
        <Button title="Capture" onPress={onCapture} type="full" />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignSelf: 'center',
    width: '92%',
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  snapWrapper: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
});

export default CameraDocument;
