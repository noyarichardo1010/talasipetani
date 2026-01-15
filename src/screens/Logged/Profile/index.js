import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Switch} from 'react-native-switch';
import {
  BGProfile,
  DefaultProfile,
  IconBank,
  IconCall,
  IconFingerCircle,
  IconLock,
  IconLogout,
  IconMobile,
  IconProfileCircle,
  IconQuestion,
  IconRightArrow,
  IconRouting,
} from '../../../assets';
import styles from './style';
import {useDispatch, useSelector} from 'react-redux';
import {colors, gStyles} from '../../../utils/styles';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomPanelModal, CustomAlert, OTPScreen} from '../../../components';
import {
  getVersion,
  setAlert,
  setBiometrikStatus,
  setEmail,
  setLoading,
  setMessage,
  setMessageType,
  setUser,
} from '../../../services';
import ModalLogout from './ModalLogout';
import API, {getErrorResponse, setBiometricValue} from '../../../services/api';
import {useBiometrics} from '../../../utils/hooks';
import {delimiterFormat} from '../../../utils/helpers/number';
import LinearGradient from 'react-native-linear-gradient';
import {useBackHandler} from '@react-native-community/hooks';
import NewUpdate from '../Home/component/NewUpdate';

const Profile = ({navigation, route}) => {
  const dispatch = useDispatch();
  let deviceId = DeviceInfo.getDeviceId();
  const {deleteKeys, createKeys} = useBiometrics();
  const {
    theme,
    alert,
    message,
    messageType,
    biometrikStatus,
    userInfo,
    token,
    onUpdateImage,
    loading,
    email,
  } = useSelector(reducer => reducer.global);
  const {emptyBank, emptyAddress} = useSelector(reducer => reducer.profile);

  const [isBottomPanelShowed, setIsBottomPanelShowed] = useState(false);
  const [emptyAddressState, setEmptyAddressState] = useState(false);
  const [emptyBankState, setEmptyBankState] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(false);

  useEffect(() => {
    // console.log('route params', route.params);
    console.log('emptyBank redux', emptyBank);
    console.log('emptyAddress redux', emptyAddress);

    // Dari Redux
    setEmptyAddressState(emptyAddress);
    setEmptyBankState(emptyBank);

    // Dari Route params
    // setEmptyAddressState(route?.params?.emptyAddress);
    // setEmptyBankState(route?.params?.emptyBank);
  }, [route, emptyBank, emptyAddress]);

  const handleClickLogout = () => {
    navigation.setOptions({
      tabBarStyle: {display: 'none'},
    });
    setIsBottomPanelShowed(true);
  };

  const cancelLogout = () => {
    navigation.setOptions({
      tabBarStyle: {display: 'flex'},
    });
    setIsBottomPanelShowed(false);
  };
  const handleLogout = async () => {
    // dispatch(removeUserToken());
    await AsyncStorage.removeItem('token');
    // const accessToken = await AsyncStorage.getItem('token');

    // console.log('handle logout', token);
    // const res = dispatch(logoutUser(accessToken)).catch(err =>
    //   console.log('err logout', err),
    // );

    // console.log('res', res);
    //auto ke halaman auth bila berhasil logout
    // if (!res) {
    //   alert('Logout Gagal');
    dispatch({type: 'SET_TOKEN', value: null});
    dispatch({type: 'SET_ISLOGIN', value: false});
    navigation.navigate('Login');
    // } else {
    //   navigation.navigate('Home');
    // }
  };

  useEffect(() => {
    console.log('biometrikStatus', biometrikStatus);
  }, [biometrikStatus]);

  // useBackHandler(() => navigation.navigate('ProfileScreen'));

  const profileMenu = [
    {
      name: 'profil',
      title: 'Profil',
      subtitle: 'Atur informasi profil Anda',
      icon: <IconProfileCircle fill={colors.primary} width={24} height={24} />,
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      name: 'phone',
      title: 'Nomor Handphone',
      subtitle: 'Atur nomor handphone yang terdaftar',
      icon: <IconCall fill={colors.primary} width={24} height={24} />,
      onPress: () => navigation.navigate('PhoneNumber'),
    },
    {
      name: 'alamat',
      title: 'Alamat',
      subtitle: emptyAddressState ? 'Belum Lengkap' : 'Atur alamat Anda',
      icon: <IconRouting fill={colors.primary} width={24} height={24} />,
      onPress: () => navigation.navigate('ChangeAddress'),
      empty: emptyAddressState,
    },
    {
      name: 'bank',
      title: 'Rekening Bank',
      subtitle: emptyBankState
        ? 'Belum Lengkap'
        : 'Atur rekening bank di aplikasi',
      icon: <IconBank fill={colors.primary} width={24} height={24} />,
      onPress: () => navigation.navigate('RekeningBank'),
      empty: emptyBankState,
    },
    {
      name: 'sandi',
      title: 'Ubah Kata Sandi',
      subtitle: 'Ganti kata sandi lama dengan yang baru',
      icon: <IconLock fill={colors.primary} width={24} height={24} />,
      onPress: () => navigation.navigate('ChangePassword'),
    },
    {
      name: 'biometrik',
      title: 'Masuk Dengan Biometrik',
      subtitle: 'Aktifkan untuk login dengan sidik jari',
      icon: <IconFingerCircle fill={colors.primary} width={24} height={24} />,
      onPress: () => verifWithOTP(!biometrikStatus),
      rightIcon: (
        <Switch
          onValueChange={val => {
            verifWithOTP(val);
          }}
          changeValueImmediately={true}
          value={biometrikStatus}
          activeText={''}
          inActiveText={''}
          circleSize={20}
          backgroundActive={theme.activeIconColor}
          innerCircleStyle={{
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10,
            marginRight: 10,
          }}
        />
      ),
    },
    {
      name: 'help',
      title: 'Pusat Bantuan',
      subtitle: 'Temukan bantuan tentang aplikasi',
      icon: <IconQuestion fill={colors.primary} width={24} height={24} />,
      onPress: () => navigation.navigate('PusatBantuan'),
    },
    {
      name: 'about',
      title: 'Tentang Aplikasi',
      subtitle: 'Versi ' + DeviceInfo.getVersion(),
      icon: <IconMobile fill={colors.primary} width={24} height={24} />,
      // onPress: () => navigation.navigate('TentangAplikasi'),
      onPress: () => getver(),
    },
  ];

  const [newVal, setNewVal] = useState(null);
  const [verificationId, setVerificationId] = useState(0);
  const verifWithOTP = val => {
    dispatch(setLoading(true));
    API.get('farmer/send-otp-farmer?type_otp=email')
      .then(res => {
        console.log('res send otp', res);
        dispatch(setLoading(false));

        if (res?.meta?.http_status === 200) {
          setVerificationId(res.data.verification_id);
          navigation.setOptions({
            tabBarStyle: {display: 'none'},
          });
          setIsSubmitted(true);
          setNewVal(val);
        } else {
          console.log('error', res?.response?.data?.errors);

          const errMessage = getErrorResponse(res?.response?.data?.errors);
          Alert.alert('Gagal', errMessage[0]);
          // dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          // dispatch(setMessageType('error'));
          // dispatch(setAlert(true));
          // dispatch(setAlertType('top'));
          setOtpCode('');
        }
      })
      .catch(err => {
        const errMessage = getErrorResponse(err?.response?.data?.errors);
        Alert.alert('Gagal', errMessage[0]);
        // dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
        // dispatch(setMessageType('error'));
        // dispatch(setAlertType('top'));
        // dispatch(setAlert(true));
        dispatch(setLoading(false));
      });
  };

  const [otpCode, setOtpCode] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const resendOTP = () => {
    dispatch(setLoading(true));
    API.post('farmer/send-otp-farmer/resend', {
      verification_id: verificationId,
    })
      .then(res => {
        // console.log('res resend otp', res);
        if (res?.meta?.http_status === 200) {
          dispatch(setMessage('Berhasil mengirim ulang OTP'));
          dispatch(setMessageType('success'));
          dispatch(setAlert(true));
          setOtpCode('');
          dispatch(setLoading(false));
        } else {
          // console.log('error', res?.response?.data?.errors);

          const errMessage = getErrorResponse(res?.response?.data?.errors);
          dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
          setOtpCode('');
          dispatch(setLoading(false));
        }
      })
      .catch(err => {
        const errMessage = getErrorResponse(err?.response?.data?.errors);
        dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
        dispatch(setMessageType('error'));
        dispatch(setAlert(true));
        dispatch(setLoading(false));
      });
  };
  // useEffect(() => {
  //   setIsSubmitted(false);
  // }, []);

  useEffect(() => {
    // console.log('userInfo', userInfo);
    if (userInfo?.user?.login_with_biometric_flag === 'Y' && email) {
      dispatch(setBiometrikStatus(true));
    } else {
      dispatch(setBiometrikStatus(false));
    }
  }, [userInfo]);

  const getUserProfile = () => {
    API.get('farmer/profile')
      .then(res => {
        console.log('res get profile petani', res);
        // setData(res.data);
        if (res?.meta?.http_status === 200) {
          //gaperlu notif kalo berhasil mgeget
          // dispatch(setMessage(res?.message ?? 'Berhasil mendapatkan profil'));
          // dispatch(setMessageType('success'));
          // dispatch(setAlert(true));

          dispatch(
            setUser({
              id: res.data.farmer_profile.id,
              name: res.data.farmer_profile.name,
              first_name: res.data.user.first_name,
              last_name: res.data.user.last_name,
              email: res.data.farmer_profile.email,
              farmer_number: res.data.user.farmer_number ?? '-',
              phone: res.data.phone_number.phone_number,
              ...res.data,
            }),
          );
        } else {
          console.log(
            'res?.response?.data?.errors',
            res?.response?.data?.errors,
          );
          const errMessage = getErrorResponse(res?.response?.data?.errors);
          // console.log('err response', errMessage);
          dispatch(setMessage(errMessage));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
        }
      })
      .catch(err => {
        console.log(err);
        const response = getErrorResponse(err?.response?.data?.errors);
        console.log('err response', response);
      });
  };
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    getUserProfile();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    setNeedUpdate(false);
    const unsubscribe = navigation.addListener('focus', () => {
      handleRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const disableBiometrics = async val => {
    const {keysDeleted} = await deleteKeys();
    // console.log('keysDeleted', keysDeleted);

    if (keysDeleted) {
      // console.log('Successful deletion');
      const data = {
        flag_biometrict: 'N',
        public_key: '',
        device_id: deviceId,
      };
      setBiometricValue(token, data)
        .then(res => {
          console.log('res disable biometrics', res);
          dispatch(setBiometrikStatus(val));
          // setNewVal(false);
          dispatch(setMessage('Biometrik Berhasil Dinonakifkan'));
          getUserProfile();
          dispatch(setEmail(''));
        })
        .catch(err => {
          console.log('err disable biometrics', err);

          // setNewVal(true);

          dispatch(
            setMessage(
              err?.response?.data?.message ?? 'Biometrik Gagal Dinonakifkan',
            ),
          );
        });
    } else {
      dispatch(
        setMessage(
          'Unsuccessful deletion because there were no keys to delete',
        ),
      );
      dispatch(setMessageType('error'));

      console.log('Unsuccessful deletion because there were no keys to delete');
    }
  };

  const enableBiometrics = async val => {
    const {publicKey} = await createKeys();
    console.log('publicKey', publicKey);
    if (publicKey) {
      // console.log('Successful create public key', publicKey);
      // console.log('Successful create public key');
      const data = {
        flag_biometrict: 'Y',
        public_key: publicKey,
        device_id: deviceId,
      };
      setBiometricValue(token, data)
        .then(res => {
          console.log('res set biometrics', res);
          dispatch(setEmail(userInfo?.user?.email));
          dispatch(setBiometrikStatus(val));
          // setNewVal(true);
          dispatch(setMessage('Biometrik Berhasil Diaktifkan'));
          getUserProfile();
        })
        .catch(err => {
          console.log('err set biometrics', err);
          // const errMessage = getErrorResponse(err?.response?.data?.errors);
          // setNewVal(false);
          dispatch(
            setMessage(
              err?.response?.data?.message ?? 'Biometrik Gagal Diaktifkan',
            ),
          );
        });
    } else {
      console.log('Unsuccessful create');
      return false;
    }
  };

  useEffect(() => {
    // console.log('otpCode', otpCode);
    if (otpCode !== '') {
      dispatch(setLoading(true));
      // consume api verif otp
      API.post('farmer/send-otp-farmer/check', {
        verification_id: verificationId,
        otp: otpCode,
      })
        .then(async res => {
          if (res?.meta?.http_status === 200) {
            console.log('res check otp', res);
            if (newVal === true) {
              await enableBiometrics(newVal);
            } else {
              await disableBiometrics(newVal);
            }

            dispatch(setAlert(true));
            dispatch(setLoading(false));
            navigation.setOptions({
              tabBarStyle: {display: 'flex', height: 60},
            });
            setOtpCode('');

            setIsSubmitted(false);
          } else {
            console.log('res error', res?.response?.data?.errors);

            const errMessage = getErrorResponse(res?.response?.data?.errors);
            dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
            dispatch(setMessageType('error'));
            dispatch(setAlert(true));
            setOtpCode('');
            setIsSubmitted(false);

            dispatch(setLoading(false));
          }
        })
        .catch(err => {
          console.log(err);
          console.log('error', err);

          const errMessage = getErrorResponse(
            err?.response?.data?.errors || err?.response,
          );
          dispatch(
            setMessage(errMessage ?? 'Device tidak mendukung biometrik'),
          );
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
          dispatch(setLoading(false));
          navigation.setOptions({
            tabBarStyle: {display: 'flex', height: 60},
          });
          setIsSubmitted(false);
        });
    }
  }, [otpCode]);

  const getver = async () => {
    await dispatch(getVersion())
      .then(res => {
        if (res.success) {
          if (res.data?.version === DeviceInfo.getVersion()) {
            console.log(
              '=== Versi sama === ',
              res.data?.version,
              DeviceInfo.getVersion(),
            );
            setNeedUpdate(false);
          } else {
            setNeedUpdate({is_force_update_flag: 'N'});
          }
        } else {
          setNeedUpdate(false);
          // setNeedUpdate({is_force_update_flag: 'N'});
        }
      })
      .catch(err => {
        console.log('err getver', err);
      });
    dispatch(setLoading(false));
  };

  const _renderProfileAlert = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            emptyAddress
              ? 'ChangeAddress'
              : emptyBank
              ? 'RekeningBank'
              : 'ChangeAddress',
          )
        }
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flex: 1,

          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#829BDE',
          width: '100%',

          marginTop: 30,
        }}>
        <LinearGradient
          colors={['#FFFFFF', '#EBEBFF']}
          style={{
            paddingLeft: 15,
            paddingRight: 15,
            paddingVertical: 16,
            paddingHorizontal: 12,
            borderRadius: 8,
          }}>
          <Text style={gStyles.text(14, '700', '#2E3192')}>
            {emptyAddress
              ? 'Pertama, lengkapi alamat & titik kordinat'
              : emptyBank
              ? 'Terakhir, lengkapi rekening bank'
              : 'Lengkap'}
          </Text>
          <View
            style={{
              display: 'flex',
              flex: 1,
              width: '100%',
              marginVertical: 8,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <View
                style={{
                  display: 'flex',
                  flex: 1,
                  backgroundColor: !emptyAddress
                    ? '#2E3192'
                    : !emptyBank
                    ? '#2E3192'
                    : 'transparent',

                  borderColor: '#829BDE',
                  borderRadius: 20,
                  height: 8,
                  marginRight: 8,
                  borderWidth: 1,
                }}
              />
              <View
                style={{
                  display: 'flex',
                  flex: 1,
                  backgroundColor: emptyAddress
                    ? 'transparent'
                    : emptyBank
                    ? 'transparent'
                    : '#2E3192',
                  borderRadius: 20,
                  height: 8,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: '#829BDE',
                }}
              />
            </View>
            <Text
              style={[
                gStyles.text(12, '400', '#797B8A'),
                gStyles.marginHorizontal(8),
              ]}>
              {!emptyAddress && !emptyBank
                ? '2/2'
                : !emptyAddress && emptyBank
                ? '1/2'
                : '0/2'}
            </Text>
            <IconRightArrow fill="#797B8A" width={16} height={16} />
          </View>
          <Text style={gStyles.text(12, '400', '#313447')}>
            Lengkapi profil untuk bisa melakukan penawaran.
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (isSubmitted) {
    return (
      <OTPScreen
        isLoading={loading}
        column={4}
        goBack={() => setIsSubmitted(false)}
        phoneNumber={userInfo?.email}
        setOtpCode={otp => {
          dispatch(setLoading(true));
          setOtpCode(otp);
        }}
        resendOTP={resendOTP}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <NewUpdate needUpdate={needUpdate} setNeedUpdate={setNeedUpdate} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          <ImageBackground
            source={BGProfile}
            resizeMode="cover"
            style={styles.topWrapper}>
            <View style={gStyles.col_2}>
              {userInfo?.farmer_profile?.photo_url ? (
                <Image
                  source={{
                    uri:
                      userInfo.farmer_profile.photo_url + '?' + onUpdateImage,
                  }}
                  style={[
                    styles.profileImage,
                    {
                      backgroundColor: theme.backgroundColor,
                    },
                  ]}
                />
              ) : (
                <Image
                  source={DefaultProfile}
                  style={[
                    styles.profileImage,
                    {
                      backgroundColor: theme.backgroundColor,
                    },
                  ]}
                />
              )}
              <Text
                style={[
                  gStyles.text(20, '700', theme.textColor),
                  gStyles.capitalize,
                  gStyles.textCenter,
                ]}>
                {userInfo?.name ?? 'Nama Petani'}
              </Text>
              <Text
                style={[
                  gStyles.text(14, '400', theme.secondaryTextColor),
                  gStyles.textCenter,
                ]}>
                {userInfo?.phone ?? '08XX8918231XX'} |{' '}
                {userInfo?.farmer_number ?? '-'}
              </Text>
            </View>
          </ImageBackground>
          <View style={styles.bottomWrapper}>
            <View
              style={[
                styles.bottomWrapper.infoTransaction,
                {
                  backgroundColor: theme.backgroundColor,
                  borderColor: colors.neutral,
                },
              ]}>
              <View style={styles.bottomWrapper.infoTransactionLeft}>
                <Text style={gStyles.text(12, '400', theme.secondaryTextColor)}>
                  Saldo Piutang
                </Text>
                <Text style={gStyles.text(14, '700', theme.textColor)}>
                  Rp {delimiterFormat(userInfo?.saldo_piutang?.saldo) ?? '-'}
                </Text>
                <Text style={gStyles.text(12, '400', colors.primary)}>
                  {userInfo?.saldo_piutang?.count_transaksi ?? '-'} Transaksi
                </Text>
              </View>

              <View
                style={[
                  styles.bottomWrapper.infoTransactionRight,
                  {
                    borderLeftColor: colors.neutral,
                  },
                ]}>
                <Text style={gStyles.text(12, '400', theme.secondaryTextColor)}>
                  Transaksi Saat Ini
                </Text>
                <Text style={gStyles.text(14, '700', theme.textColor)}>
                  Rp {delimiterFormat(userInfo?.saldo_transaksi?.saldo) ?? '-'}
                </Text>
                <Text style={gStyles.text(12, '400', colors.primary)}>
                  {userInfo?.saldo_transaksi?.count_transaksi ?? '-'} Transaksi
                </Text>
              </View>
            </View>
            {emptyAddress || emptyBank ? _renderProfileAlert() : null}
            {/* looping profile menu */}
            <View style={gStyles.marginTop(25)} />
            {profileMenu.map(menu => (
              <TouchableOpacity
                key={menu.title}
                onPress={menu.onPress}
                style={[
                  styles.bottomWrapper.menu,
                  {
                    borderColor: colors.neutral,
                  },
                ]}>
                <View style={styles.bottomWrapper.menuLeft}>
                  {menu.icon}
                  <View>
                    <Text
                      style={[
                        gStyles.text(14, '500', theme.textColor),
                        gStyles.marginLeft(12),
                      ]}>
                      {menu.title}
                    </Text>
                    <Text
                      style={[
                        gStyles.text(
                          12,
                          '400',
                          menu.empty ? '#D80909' : theme.secondaryTextColor,
                        ),
                        gStyles.marginLeft(12),
                      ]}>
                      {menu.subtitle}
                    </Text>
                  </View>
                </View>
                {menu?.rightIcon ? (
                  menu.rightIcon
                ) : (
                  <IconRightArrow
                    fill={theme.iconColor}
                    width={16}
                    height={16}
                  />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={handleClickLogout}
              style={[
                styles.btnLogout,
                {
                  backgroundColor: theme.backgroundColor,
                  borderColor: colors.neutral,
                },
              ]}>
              <IconLogout fill={colors.primary} width={20} height={20} />
              <Text
                style={[
                  gStyles.text(14, '500', theme.textColor),
                  gStyles.marginLeft(8),
                ]}>
                Keluar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {alert && (
          <CustomAlert
            text={message}
            handleClose={() => dispatch(setAlert(false))}
            type={messageType}
            alertType="bottom"
          />
        )}
        {isBottomPanelShowed ? (
          <BottomPanelModal
            showPanel={setIsBottomPanelShowed}
            height="auto"
            radius={12}
            animate
            backgroundPanel={'white'}
            content={
              <ModalLogout handleSubmit={handleLogout} cancel={cancelLogout} />
            }
          />
        ) : null}
      </View>
    );
  }
};

export default Profile;
