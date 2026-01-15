import {View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {
  CustomAlert,
  Loading,
  OTPScreen,
  LoadingAnimated,
  BottomPanelModal,
} from '../../../components';
import {
  loginUser,
  setAlert,
  setLoading,
  setMessage,
  setMessageType,
  setToken,
  setUser,
} from '../../../services';

import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginBiometrik from './LoginBiometrik';
import FormLogin from './formLogin';
import {useBiometrics} from '../../../utils/hooks';
import {getErrorResponse, loginBiometrics} from '../../../services/api';
import API from '../../../services/api';
import useNotif from '../../../utils/hooks/useNotif';
import ModalNotVerified from './ModalNotVerified';
import {
  SET_BANK_LIST,
  SET_BANK_PRIMARY,
  SET_EMPTY_BANK,
} from '../../../services/redux/action/list';
// import {useBackHandler} from '@react-native-community/hooks';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const {promptBiometrics, BiometryTypes, checkSensorAvailable} =
    useBiometrics();
  const {getFCMToken} = useNotif();
  const {theme, loading, message, messageType, alert, email} = useSelector(
    reducer => reducer.global,
  );
  const [alertType, setAlertType] = useState('top');

  const [BottomPanelPopup, setBottomPanelPopup] = useState({
    show: false,
    shadow: true,
    data: null,
    title: null,
    type: '',
    content: '',
  });
  const [AlertField, setAlertField] = useState([]);

  const [IsLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verificationId, setVerificationId] = useState(0);

  // ini untuk menggunakan state lokal
  const [data, setData] = useState({
    password: '',
  });
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const resendOTP = () => {
    setIsLoading(true);
    API.post('auth/resend-otp-login-farmer', {
      verification_id: verificationId,
    })
      .then(res => {
        // console.log('res resend otp', res);
        if (res?.meta?.http_status === 200) {
          dispatch(setMessage('Berhasil mengirim ulang OTP'));
          dispatch(setMessageType('success'));
          dispatch(setAlert(true));
          setOtpCode('');
          setIsLoading(false);
        } else {
          // console.log('error', res?.response?.data?.errors);

          const errMessage = getErrorResponse(res?.response?.data?.errors);
          dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
          setOtpCode('');
          setIsLoading(false);
        }
      })
      .catch(err => {
        const errMessage = getErrorResponse(err?.response?.data?.errors);
        dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
        dispatch(setMessageType('error'));
        dispatch(setAlert(true));
        setIsLoading(false);
      });
  };

  const handleValidation = () => {
    if (data.password.length < 6) {
      Alert.alert(
        'Kata sandi terlalu pendek',
        'Pastikan kata sandi lebih dari 6 karakter',
      );
      return;
    }
    let noEmptyField =
      Object.entries(data)
        .map(dat => dat.find(dt => (dt === '' ? true : false)))
        .filter(d => d === '').length === 0;

    if (!noEmptyField) {
      let findEmpty = Object.entries(data).map(dat => ({
        field: dat[0],
        empty: dat[1] === '' ? true : false,
      }));

      Alert.alert(
        'Kolom Tidak Boleh Kosong',
        'Pastikan semua kolom sudah terisi dengan benar',
      );
      setAlertField(findEmpty);
      return;
    } else {
      setAlertField([]);
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await dispatch(loginUser(data))
      .then(res => {
        console.log('resss', res);
        setVerificationId(res?.data?.verificationId);
        // console.log('data', data)
        if (res.success) {
          if (res?.data?.login_id !== '') {
            setEmailOrPhone(
              data?.email_or_phone ?? res.data?.user_phone?.phone_number,
            );
            // setEmailOrPhone(res.data.user_phone.phone_number);
          } else {
            setEmailOrPhone(data?.email_or_phone);
          }
          if (
            res?.data?.farmer_profile?.verified_at === null ||
            res?.data?.role?.is_active_flag !== 'Y'
          ) {
            // console.log('harusnya tidak kesini');
            setBottomPanelPopup({
              ...BottomPanelPopup,
              show: true,
              content: 'not verified',
            });
          } else {
            setBottomPanelPopup({
              show: true,
              content: 'otp',
              type: 'full',
            });
          }
        } else {
          Alert.alert('Login Gagal', res?.message || res.message);
        }
      })
      .catch(err => {
        console.log('err 2', err);
        Alert.alert('Login Gagal', message || err, [
          {
            text: 'Ok',
          },
        ]);
      });
    setIsLoading(false);
  };

  const getListBank = () => {
    setIsLoading(true);
    API.get('farmer/account-bank')
      .then(res => {
        // console.log('API res getListBank', res);
        if (res?.meta?.http_status === 200) {
          const result = res.data ? res.data : [];
          console.log('API res getListBank 2', result);
          if (result.length > 0) {
            dispatch({type: SET_EMPTY_BANK, value: false});
            let findPrimary = result.find(rest => rest.is_default === true);
            console.log('findPrimary', findPrimary.bank);
            dispatch({type: SET_BANK_PRIMARY, value: findPrimary});
          }
          dispatch({type: SET_BANK_LIST, value: result});
        }
      })
      .catch(err => console.log('err getlist bank', err));
  };

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
              email: res.data.farmer_profile.email,
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

  const handleLogin = async (otp = '') => {
    console.log('otp', otp);
    // dispatch({
    //   type: 'SET_TOKEN',
    //   value: '82ab49432-0a0c-4d2c-91e6-78583e6551c7',
    // });
    // dispatch({type: 'SET_ISLOGIN', value: true});
    // await AsyncStorage.setItem(
    //   'token',
    //   '82ab49432-0a0c-4d2c-91e6-78583e6551c7',
    // );
    // return;
    if (otp !== '') {
      setIsLoading(true);
      //login pake otp
      API.post('auth/check-otp-login', {
        email_or_phone: emailOrPhone,
        otp: otp,
        verification_id: verificationId,
      })
        .then(async res => {
          console.log('res check otp', res);
          if (res?.meta?.http_status === 200) {
            dispatch(setToken(res.data.token));

            // await AsyncStorage.setItem('token', res?.data?.token);
            const fcmToken = await getFCMToken();
            console.log('fcmToken', fcmToken);
            API.post('register-fcm-token', {token: fcmToken})
              .then(resRegisterFCM => {
                if (res?.meta?.http_status === 200) {
                  console.log('resRegisterFCM', resRegisterFCM);
                  getListBank();
                  getUserProfile();
                  // dispatch(setUser(res.data));
                  setIsLoading(false);
                  navigation.navigate('Splash');
                } else {
                  const errMessage =
                    getErrorResponse(resRegisterFCM?.response?.data?.errors) ||
                    resRegisterFCM?.response?.data?.message;
                  console.log('errMessage', errMessage);

                  dispatch(setMessage(errMessage));
                  dispatch(setMessageType('error'));
                  setAlertType('top');
                  setIsLoading(false);
                  dispatch(setAlert(true));
                }
              })
              .catch(err => {
                console.log('err register fcm token', err);
                const errMessage =
                  getErrorResponse(err?.response?.data?.errors) ||
                  err?.response?.data?.message;
                console.log('errMessage', errMessage);

                dispatch(setMessage(errMessage));
                dispatch(setMessageType('error'));
                setAlertType('top');
                setIsLoading(false);
                dispatch(setAlert(true));
              });
          } else {
            const errMessage =
              getErrorResponse(res?.response?.data?.errors) ||
              res?.response?.data?.message;
            console.log('errMessage', errMessage);

            dispatch(setMessage(errMessage));
            dispatch(setMessageType('error'));
            setAlertType('top');
            setIsLoading(false);
            dispatch(setAlert(true));
          }
        })
        .catch(err => {
          console.log('err check otp', err);
          const errMessage =
            getErrorResponse(err?.response?.data?.errors) ||
            err?.response?.data?.message;
          console.log('errMessage', errMessage);

          dispatch(setMessage(errMessage));
          dispatch(setMessageType('error'));
          setAlertType('top');
          setIsLoading(false);
          dispatch(setAlert(true));
        });
    } else {
      //login pake biometrik
      // if (isBiometricsSupported) {
      //   console.log('biometrics Types', biometricsType);
      // }
      // rnBiometrics.isSensorAvailable().then(resultObject => {
      //   const {available, biometryType} = resultObject;
      //   console.log('available', available);
      //   console.log('biometryType', biometryType);
      //   if (available && biometryType === BiometryTypes.TouchID) {
      //     console.log('TouchID is supported');
      //   } else if (available && biometryType === BiometryTypes.FaceID) {
      //     console.log('FaceID is supported');
      //   } else if (available && biometryType === BiometryTypes.Biometrics) {
      //     console.log('Biometrics is supported');
      //   } else {
      //     console.log('Biometrics not supported');
      //   }
      // });
      // dispatch({
      //   type: 'SET_TOKEN',
      //   value: '82ab49432-0a0c-4d2c-91e6-78583e6551c7',
      // });
      // dispatch({type: 'SET_ISLOGIN', value: true});
      // await AsyncStorage.setItem(
      //   'token',
      //   '82ab49432-0a0c-4d2c-91e6-78583e6551c7',
      // );
      // navigation.navigate('Splash');
    }
  };

  const onPressBiometrics = async () => {
    // console.log('email', email);
    if (email !== '') {
      const {available, biometryType} = await checkSensorAvailable();
      if (available) {
        if (
          biometryType === BiometryTypes.Biometrics ||
          biometryType === BiometryTypes.TouchID ||
          biometryType === BiometryTypes.FaceID
        ) {
          // console.log('Biometrics is supported');
          // console.log('biometryType',biometryType)
          //
          // dispatch({
          //   type: 'SET_TOKEN',
          //   value: '82ab49432-0a0c-4d2c-91e6-78583e6551c7',
          // });
          // dispatch({type: 'SET_ISLOGIN', value: true});
          // await AsyncStorage.setItem(
          //   'token',
          //   '82ab49432-0a0c-4d2c-91e6-78583e6551c7',
          // );
          // setIsLoading(false);
          // navigation.navigate('Splash');
          setIsLoading(true);

          promptBiometrics()
            .then(resBiometrics => {
              console.log('resBiometricssss', resBiometrics);
              //consume api login with biometrics
              loginBiometrics({
                signature: resBiometrics?.signature,
                email: email,
              })
                .then(async resLogin => {
                  console.log('res login with biometrics', resLogin);
                  dispatch({
                    type: 'SET_TOKEN',
                    value: resLogin?.data?.data?.token,
                  });
                  dispatch({type: 'SET_ISLOGIN', value: true});
                  await AsyncStorage.setItem(
                    'token',
                    resLogin?.data?.data?.token,
                  );
                  setIsLoading(false);
                  navigation.navigate('Splash');
                })
                .catch(err => {
                  console.log('err biometrics login', err);
                  const errMessage =
                    getErrorResponse(err?.response?.data?.errors) ||
                    err?.response?.data?.message;
                  console.log('errMessage', errMessage);

                  dispatch(setMessage(errMessage));
                  dispatch(setMessageType('error'));
                  setAlertType('top');
                  setIsLoading(false);
                  dispatch(setAlert(true));
                });
            })
            .catch(errBiometrics => {
              console.error('errBiometricsss', errBiometrics);
            });
        }
      } else {
        console.log('Biometrics not supported');
        // setIsBiometricsSupported(false);
        showAlertBiometricsNotSupport();
      }
    } else {
      Alert.alert('Gagal', 'Aktifkan biometrik di profile terlebih dahulu');
    }
  };

  const showAlertBiometricsNotSupport = () => {
    dispatch(setAlert(true));
    dispatch(setMessage('Perangkat tidak support biometrik'));
    dispatch(setMessageType('error'));
    setAlertType('top');
  };

  useEffect(() => {
    // consume api verif otp
    if (otpCode !== '') {
      handleLogin(otpCode);
    }
  }, [otpCode]);

  // useBackHandler(() => handleBack());
  // const handleBack = () => navigation.goBack();

  return (
    <View style={{flex: 1, zIndex: 1, elevation: 1}}>
      <LoadingAnimated visible={IsLoading} />

      <FormLogin
        handleSubmit={handleValidation}
        data={data}
        setData={setData}
        AlertField={AlertField}
        navigation={navigation}
        onBiometricShow={() => {
          onPressBiometrics();
          // isBiometricsSupported
          //   ? setBottomPanelPopup({show: true, type: '', content: 'biometric'})
          //   : onPressBiometrics();
        }}
      />

      {/* {loading && <Loading />} */}
      {alert && (
        <CustomAlert
          text={message}
          handleClose={() => dispatch(setAlert(false))}
          type={messageType}
          alertType={alertType}
        />
      )}
      {BottomPanelPopup.show ? (
        <BottomPanelModal
          showPanel={setBottomPanelPopup}
          closePanel={() => setBottomPanelPopup({show: false})}
          clickOutsideToClosePanel
          radius={12}
          title={BottomPanelPopup.title}
          withHeader={BottomPanelPopup.title}
          showCloseBtn={BottomPanelPopup.title}
          height={BottomPanelPopup.type === 'full' ? '100%' : 'auto'}
          animate
          animateType={BottomPanelPopup.type}
          backgroundPanel={'#fff'}
          closePanel={() =>
            BottomPanelPopup.content === 'otp'
              ? Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin keluar?', [
                  {
                    text: 'Tidak',
                    onPress: () => null, // Tidak melakukan apa-apa
                    style: 'cancel',
                  },
                  {
                    text: 'Ya',
                    onPress: () => {
                      setBottomPanelPopup({show: false});
                    },
                  },
                ])
              : setBottomPanelPopup({show: false})
          }
          content={
            BottomPanelPopup.content === 'otp' ? (
              <OTPScreen
                column={4}
                phoneNumber={emailOrPhone}
                setOtpCode={otp => {
                  setLoading(true);
                  setOtpCode(otp);
                }}
                isLoading={IsLoading}
                goBack={() =>
                  setBottomPanelPopup({...BottomPanelPopup, show: false})
                }
                resendOTP={resendOTP}
              />
            ) : BottomPanelPopup.content === 'not verified' ? (
              <ModalNotVerified
                title="Akun Berhasil Dibuat Dan Sedang Diverifikasi"
                desc="Kami akan segera menghubungi anda jika akun telah selesai diverifikasi."
                btnText="Kembali ke Login"
                onPressBtn={() =>
                  setBottomPanelPopup({...BottomPanelPopup, show: false})
                }
              />
            ) : (
              <LoginBiometrik handleSubmit={handleLogin} />
            )
          }
        />
      ) : null}
    </View>
  );
};

export default Login;
