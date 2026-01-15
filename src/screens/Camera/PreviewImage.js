/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Image, Text} from 'react-native';
import {setCapturedImage} from '../../services';
import {Button} from '../../components';

const PreviewImage = ({navigation, route}) => {
  const [image, setImage] = useState('');
  const {capturedImage} = useSelector(reducer => reducer.global);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('route', route.params?.image);

    if (route.params?.image) {
      setImage(route.params?.image);
    }
  }, [route.params?.image]);

  useEffect(() => {
    console.log('capturedImage', capturedImage);
  }, [capturedImage]);

  function addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
  const savePreviewImage = () => {
    const d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    let time = h + ':' + m + ':' + s;
    dispatch(
      setCapturedImage({
        uri: route?.params?.image,
        type: 'image/jpeg',
        name: `${time} - bpjp` + '.jpg',
      }),
    );

    //go back -2
  };
  return (
    <View style={styles.container}>
      <View style={styles.pictureContainer}>
        {image ? (
          <Image
            source={{
              uri: image,
            }}
            style={styles.picture}
          />
        ) : (
          <Text >tidak ada preview</Text>
        )}
      </View>
      {route.params?.image ? (
        <View style={styles.snapWrapper}>
          <Button
            title="Simpan"
            onPress={savePreviewImage}
            type="full"
            style={styles.button}
          />
        </View>
      ) : null}
    </View>
  );
};

export default PreviewImage;

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
    width: '80%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pictureContainer: {
    // backgroundColor: '#cacaca',
    borderColor: '#718CBF',
    borderWidth: 2,
    borderStyle: 'dashed',
    width: 335,
    borderRadius: 4,
    height: 335,
    marginTop: 41,
    marginBottom: 24,
    overflow: 'hidden',
  },
  picture: {
    width: '100%',
    height: '100%',
    transform: [{scaleX: -1}],
  },
  messageContainer: {
    width: '85%',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 26,
  },
  messageIcon: {marginLeft: 15},
  messageText: {marginLeft: 10, fontSize: 13},
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
