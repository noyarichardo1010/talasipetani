import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppBar,
  BottomPanel,
  Button,
  CustomAlert,
  Input,
  Loading,
  PickAttachment,
} from '../../../../components';
import {DefaultProfile, IconLeftArrow} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import {
  setAlert,
  setLoading,
  setMessage,
  setMessageType,
  setOnUpdateImage,
} from '../../../../services';
import ImageCropPicker from 'react-native-image-crop-picker';
import {editProfilePetani, getErrorResponse} from '../../../../services/api';
import {BASE_URL} from '../../../../services/api/url';
import axios from 'axios';
import {Image as CompressImage} from 'react-native-compressor';
import {useBackHandler} from '@react-native-community/hooks';
import {removeNonNumeric} from '../../../../utils/helpers/number';
import * as Animatable from 'react-native-animatable';
const EditProfile = ({navigation}) => {
  const {
    theme,
    userInfo,
    token,
    loading,
    message,
    messageType,
    onUpdateImage,
    alert,
    alertType,
  } = useSelector(reducer => reducer.global);
  const dispatch = useDispatch();
  const [BottomPanelPopup, setBottomPanelPopup] = useState({
    show: false,
    data: null,
    title: '',
    type: '',
  });

  const [chooseFromWhere, setChooseFromWhere] = useState(null);

  const [image, setImage] = useState('');
  const [data, setData] = useState({
    name: userInfo?.name,
    first_name: userInfo?.first_name,
    last_name: userInfo?.last_name,
    email: userInfo?.email,
    npwp: userInfo?.farmer_profile?.npwp,
    no_ktp: userInfo?.farmer_profile?.nik,
  });
  const [validation, setValidation] = useState({
    no_ktp: true,
  });
  const handleChange = useCallback(
    (forField, value) => {
      if (forField === 'no_ktp') {
        if (value.length < 16) {
          setValidation({
            ...validation,
            no_ktp: 'No. KTP tidak boleh kurang dari 16 karakter',
          });
        } else if (value.length > 16) {
          setValidation({
            ...validation,
            no_ktp: 'No. KTP tidak boleh lebih dari 16 karakter',
          });
        } else {
          setValidation({
            ...validation,
            no_ktp: true,
          });
        }
      }

      setData({
        ...data,
        [forField]: value,
      });
    },
    [data],
  );
  const isDisabled =
    data.name === '' ||
    data.email === '' ||
    data.no_ktp === '' ||
    data.npwp === '';

  useEffect(() => {
    // console.log('image', image);
    setBottomPanelPopup({
      ...BottomPanelPopup,
      show: false,
    });
  }, [image]);

  const handleSave = () => {
    //consume api update profile
    console.log('data update', data);
    dispatch(setLoading(true));

    if (image !== '') {
      const field = new FormData();
      field.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: 'foto.jpg',
      });
      field.append('category', 'farmer');
      axios
        .post(`${BASE_URL}/utility/upload-file`, field, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(resUpload => {
          // console.log('resUpload', resUpload);
          data.photo = resUpload?.data?.data ?? '';
          if (resUpload.status === 200) {
            dispatch(setOnUpdateImage());

            //consume api update profile
            editProfilePetani(token, data)
              .then(res => {
                console.log('res edit petani profile', res);
                dispatch(setMessage('Profil Berhasil Diperbarui'));
                dispatch(setMessageType('success'));
                dispatch(setAlert(true));
                dispatch(setLoading(false));
                navigation.goBack();
              })
              .catch(err => {
                console.log('err edit petani profile', err);

                const errMessage = getErrorResponse(
                  err?.response?.data?.errors,
                );
                dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
                dispatch(setMessageType('error'));
                dispatch(setAlert(true));
                dispatch(setLoading(false));
              });
          } else {
            const errMessage = getErrorResponse(
              resUpload?.response?.data?.errors,
            );
            dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
            dispatch(setMessageType('error'));
            dispatch(setAlert(true));
            dispatch(setLoading(false));
          }
        })
        .catch(err => {
          console.log('err', err);
          const errMessage = getErrorResponse(err?.response?.data?.errors);
          dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
          dispatch(setLoading(false));
        });
    } else {
      //consume api update profile tanpa merubah gambar

      editProfilePetani(token, data)
        .then(res => {
          console.log('res edit petani profile', res);
          dispatch(setMessage('Profil Berhasil Diperbarui'));
          dispatch(setMessageType('success'));
          dispatch(setAlert(true));
          dispatch(setLoading(false));
          navigation.goBack();
        })
        .catch(err => {
          console.log('err edit petani profile', err);

          const errMessage = getErrorResponse(err?.response?.data?.errors);
          dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
          dispatch(setLoading(false));
        });
    }
  };

  useEffect(() => {
    // console.log('chooseFromWhere document : ', chooseFromWhere);
    setChooseFromWhere(false);

    if (chooseFromWhere === 'gallery') {
      ImageCropPicker.openPicker({
        options: {
          waitAnimationEnd: false,
          includeExif: true,
          includeBase64: true,
          forceJpg: true,
          compressImageMaxWidth: 640,
          compressImageMaxHeight: 480,
          compressImageQuality: 0.75,
          mediaType: 'any',
        },
      })
        .then(async response => {
          // console.log('response: ', response);
          const uri = response.sourceURL || response.path;
          // const newImageUri = 'file:///' + uri.split('file:/').join('');
          const newImageUri =
            Platform.OS === 'ios' ? uri : 'file://' + response.path;
          // uri: Platform.OS === 'ios' ? uri.replace('file:///', '') : uri,
          const uriParts = uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
          let img = {
            name: response.filename || newImageUri.split('/').pop(),
            path: response.path,
            data: response.data,

            uri: newImageUri,
            type: `image/${fileType}`,
          };
          // const compressImage = await CompressImage.compress(img.uri, {
          //   //compress image
          //   compressionMethod: 'manual',
          //   quality: 0.5,
          // });
          // setImage(compressImage);
          setImage(img.uri);
          setChooseFromWhere(null);
        })
        .catch(e => console.log('Error : ', e.message));
    } else if (chooseFromWhere === 'document') {
      // Opening Document Picker to select one file
      // selectFile();
    } else if (chooseFromWhere === 'camera') {
      navigation.navigate('CameraDocument', {
        setChooseFromWhere,
        setImage,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chooseFromWhere]);

  // useBackHandler(() => handleBack());
  const handleBack = () => navigation.navigate('ProfileScreen');

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
  //         onPress: () => handleBack(), // Keluar dari aplikasi
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
  return (
    <>
      <View style={styles.container}>
        <AppBar
          appBarColor={theme.backgroundColor}
          navigation={navigation}
          headerTextColor={theme.textColor}
          hideRightContent
          globalBackButton={() => handleBack()}
          iconLeft={
            <IconLeftArrow width={20} height={20} fill={theme.textColor} />
          }
          title="Profil"
          borderBottom
          borderBottomColor={theme.textColor}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: theme.backgroundColor,
          }}>
          <View
            style={[
              styles.wrapper,
              {
                backgroundColor: theme.backgroundColor,
              },
            ]}>
            <View style={styles.imageWrapper}>
              <Image
                source={
                  image !== ''
                    ? {uri: image}
                    : userInfo?.farmer_profile?.photo_url
                    ? {
                        uri:
                          userInfo?.farmer_profile?.photo_url +
                          '?' +
                          onUpdateImage,
                      }
                    : DefaultProfile
                }
                style={styles.previewImage}
              />

              <Button
                type="outline"
                title="Ganti"
                color={colors.primary}
                style={styles.changeImageBtn}
                onPress={() =>
                  setBottomPanelPopup({
                    show: true,
                    data: {},
                    title: 'Pilih Foto Dari',
                  })
                }
              />
            </View>
            <View style={[gStyles.formInput]}>
              <Text
                style={[
                  gStyles.label('#6B6D7A', 13, '400'),
                  gStyles.weight('400'),
                ]}>
                Nama Depan
              </Text>
              <View style={styles.fieldContainer}>
                <Input
                  // placeholder={'Sample: 082312345678'}
                  name="first_name"
                  placeholderTextColor={'#687083'}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={value => handleChange('first_name', value)}
                  style={gStyles.field}
                  defaultValue={data?.first_name}
                />
              </View>
            </View>
            <View style={[gStyles.formInput]}>
              <Text
                style={[
                  gStyles.label('#6B6D7A', 13, '400'),
                  gStyles.weight('400'),
                ]}>
                Nama Belakang
              </Text>
              <View style={styles.fieldContainer}>
                <Input
                  // placeholder={'Sample: 082312345678'}
                  name="last_name"
                  placeholderTextColor={'#687083'}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={value => handleChange('last_name', value)}
                  style={gStyles.field}
                  defaultValue={data?.last_name}
                />
              </View>
            </View>
            <View style={[gStyles.formInput]}>
              <Text
                style={[
                  gStyles.label('#6B6D7A', 13, '400'),
                  gStyles.weight('400'),
                ]}>
                Email
              </Text>
              <View style={styles.fieldContainer}>
                <Input
                  name="email"
                  placeholderTextColor={'#687083'}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={value => handleChange('email', value)}
                  style={gStyles.field}
                  defaultValue={data?.email}
                />
              </View>
            </View>
            <View style={[gStyles.formInput]}>
              <Text
                style={[
                  gStyles.label('#6B6D7A', 13, '400'),
                  gStyles.weight('400'),
                ]}>
                Nomor KTP
              </Text>
              <View style={styles.fieldContainer}>
                <Input
                  name="no_ktp"
                  placeholderTextColor={'#687083'}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={value =>
                    handleChange('no_ktp', removeNonNumeric(value))
                  }
                  value={data?.no_ktp}
                  style={gStyles.field}
                  defaultValue={data?.no_ktp}
                />
                {validation.no_ktp !== true && (
                  <Animatable.View animation="fadeInLeft">
                    <Text style={gStyles.errorMsg}>{validation.no_ktp}</Text>
                  </Animatable.View>
                )}
              </View>
            </View>
            <View style={[gStyles.formInput]}>
              <Text
                style={[
                  gStyles.label('#6B6D7A', 13, '400'),
                  gStyles.weight('400'),
                ]}>
                NPWP
              </Text>
              <View style={styles.fieldContainer}>
                <Input
                  name="npwp"
                  placeholderTextColor={'#687083'}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={value => handleChange('npwp', value)}
                  style={gStyles.field}
                  defaultValue={data?.npwp}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <>
          <View style={[styles.borderTop, {boxShadow: theme.textColor}]} />
          <View
            style={[
              gStyles.paddingHorizontal(16),
              gStyles.paddingVertical(8),
              {
                backgroundColor: theme.backgroundColor,
              },
            ]}>
            <Button
              title="Simpan Perubahan"
              onPress={() => handleSave()}
              loading={loading}
              isDisabled={isDisabled}
              type="full"
              style={[
                styles.btnAgree,
                {
                  backgroundColor: isDisabled ? colors.neutral : colors.primary,
                },
              ]}
              textStyle={[
                styles.btnAgreeText,
                {
                  color: isDisabled ? colors.grey2 : colors.light,
                },
              ]}
            />
          </View>
        </>
      </View>
      {loading ? <Loading /> : null}
      {alert ? (
        <CustomAlert
          text={message}
          handleClose={() => dispatch(setAlert(false))}
          type={messageType}
          alertType={alertType}
        />
      ) : null}
      {BottomPanelPopup.show && (
        <BottomPanel
          radius={12}
          clickOutsideToClosePanel
          height={BottomPanelPopup.type === 'full' ? '100%' : 'auto'}
          withHeader
          showCloseBtn
          animate
          positionAnimatePop={BottomPanelPopup.type === 'full' ? -1000 : -200}
          durationPop={BottomPanelPopup.type === 'full' ? 800 : 300}
          title={BottomPanelPopup.title}
          closePanel={() => setBottomPanelPopup({show: false})}
          content={
            <PickAttachment
              closePanel={() => setBottomPanelPopup({show: false})}
              setChooseFromWhere={setChooseFromWhere}
              camera
              document={false}
            />
          }
        />
      )}
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 16,
  },
  imageWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  previewImage: {
    display: 'flex',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    marginRight: 16,
  },
  changeImageBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  borderTop: {
    height: 3.5,
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  btnAgree: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#2A378E',
  },
  btnAgreeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});
