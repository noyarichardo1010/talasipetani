import {View, Alert, Text, Image, BackHandler} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  BottomPanelModal,
  Button,
  LoadingAnimated,
  OTPScreen,
  OTPVia,
  CustomAlert,
} from '../../../components';
import {
  setAlert,
  setMessage,
  setMessageType,
  registerUser,
  setPickedAddress,
} from '../../../services';
import {useDispatch, useSelector} from 'react-redux';
import TermsAndConditions from '../TermsAndConditions';
import FormRegister from './formRegister';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import BottomPanelAnimated from '../../../components/molecules/BottomPanel/BottomPanelAnimated';
import {gStyles} from '../../../utils/styles';
import {AlertProfile} from '../../../assets';
import styles from './styles';
import API from '../../../services/api';
import {getErrorResponse} from '../../../services/api';
import useGetLocation from '../../../utils/hooks/useGetLocation';

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    // location,
    // mylocation,
    getLocation,
  } = useGetLocation();
  const {pickedAddress} = useSelector(reducer => reducer.location);
  const {token, message, messageType, alert} = useSelector(
    reducer => reducer.global,
  );

  const [IsLoading, setIsLoading] = useState(false);
  const [ShowTerms, setShowTerms] = useState(false);
  const [ChoiceOTP, setChoiceOTP] = useState(null);
  const [sendOTPVia, setSendOTPVia] = useState('');
  const [ShowOTP, setShowOTP] = useState(false);
  const [RegisterComplete, setRegisterComplete] = useState(false);
  const [OtpCode, setOtpCode] = useState('');
  const [verificationId, setVerificationId] = useState(0);

  const [AlertField, setAlertField] = useState([]);
  const [tokenNDA, setTokenNDA] = useState('');

  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    city_id: '',
    province_id: '',
  });

  useEffect(() => {
    dispatch(
      setPickedAddress({
        latitude: null,
        longitude: null,
        name: '',
      }),
    );
    checkGPS();
    async function checkGPS() {
      await getLocation();
    }
  }, []);

  useEffect(() => {
    if (OtpCode !== '') {
      handleSubmitOTP(OtpCode);
    }
  }, [OtpCode]);

  const handleValidation = () => {
    // setShowTerms(true);
    // return;
    let noEmptyField =
      Object.entries(data)
        .map(dat => dat.find(dt => (dt === '' || dt === null ? true : false)))
        .filter(d => d === '' || d === null).length === 0;

    // setShowTerms(true);
    // console.log('data', data);
    // console.log('noEmptyField', noEmptyField);

    if (!noEmptyField) {
      let findEmpty = Object.entries(data).map(dat => ({
        field: dat[0],
        empty: dat[1] === '' || dat[1] === null ? true : false,
      }));
      // console.log('findEmpty', findEmpty);

      Alert.alert(
        'Kolom Data Tidak Boleh Kosong',
        'Pastikan semua kolom data sudah terisi dengan benar',
      );
      setAlertField([
        ...findEmpty,
        {field: 'lokasi', empty: pickedAddress.name === ''},
      ]);
      return;
    } else {
      setAlertField([]);
    }

    // if (data.phone.length < 11) {
    //   Alert.alert(
    //     'Nomor handphone terlalu pendek',
    //     'Pastikan nomor handphone sudah terisi dengan benar.',
    //   );

    //   setAlertField([{field: 'phone', empty: true}]);
    //   return;
    // }

    if (isNaN(data.phone)) {
      Alert.alert(
        'Format Nomor handphone Salah',
        'Pastikan nomor handphone hanya menggunakan angka.',
      );
      // setAlertField([
      //   {field: 'phone', empty: true, msg: 'Pastikan hanya menggunakan angka'},
      // ]);

      return;
    }

    const filter =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!filter.test(data.email)) {
      Alert.alert(
        'Format Email Salah',
        'Pastikan format email terisi dengan benar.',
      );
      return false;
    }

    if (data.province_id === null || data.province_id === '') {
      Alert.alert(
        'Provinsi belum di pilih',
        'Mohon pilih lokasi provinsi terlebih dahulu.',
      );
      return;
    }

    if (data.city_id === null || data.city_id === '') {
      Alert.alert(
        'Kabupaten/Kota belum di pilih',
        'Mohon pilih lokasi Kabupaten/Kota terlebih dahulu.',
      );
      return;
    }

    if (data.password !== data.confirm_password) {
      Alert.alert(
        'Kata sandi tidak sesuai',
        'Pastikan Konfirmasi kata sandi benar',
      );
      return;
    }

    if (data.password.length < 6) {
      Alert.alert(
        'Kata sandi terlalu pendek',
        'Pastikan panjang kata sandi minimal 6 karakter',
      );
      return;
    }

    if (pickedAddress.name === '') {
      Alert.alert('Lokasi belum terpilih', 'Mohon pilih lokasi anda');
      return;
    }

    // return;

    // setShowTerms(true);
    agreeNDA();
  };

  const agreeNDA = () => {
    setIsLoading(true);

    API.post('auth/agree-nda', {
      email: data.email.toLowerCase(),
      phone: data.phone,
    })
      .then(res => {
        console.log('res agree nda', res);

        if (res?.meta?.http_status === 200) {
          //     dispatch(setMessage('Berhasil mengirim ulang OTP'));
          //     dispatch(setMessageType('success'));
          //     dispatch(setAlert(true));
          setShowTerms(true);
          setTokenNDA(res.data.token_nda);
          // setChoiceOTP(true);
          setIsLoading(false);
        } else {
          // console.log('error', res?.response?.data?.errors);

          const errMessage = getErrorResponse(res?.response?.data?.errors);
          dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
          setOtpCode('');
          setIsLoading(false);
          setShowTerms(false);
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

  const sendOTP = via => {
    setIsLoading(true);
    // console.log('sendOTPVia', sendOTPVia);
    // console.log('via', via);
    API.post('auth/send-otp-register', {
      email_or_phone: via === 'email' ? data.email : data.phone,
      token: tokenNDA,
    })
      .then(res => {
        setShowOTP(true);
        console.log('res send otp', res);
        if (res?.meta?.http_status === 200) {
          setVerificationId(res.data.verification_id);
          //     dispatch(setMessage('Berhasil mengirim ulang OTP'));
          //     dispatch(setMessageType('success'));
          //     dispatch(setAlert(true));
          //     setOtpCode('');
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

  const handleSubmitData = async () => {
    const formData = {
      ...data,
      // email: data.email.toLowerCase(),
      address: pickedAddress.name,
      address_map: pickedAddress.name,
      lat: pickedAddress.latitude?.toString(),
      long: pickedAddress.longitude?.toString(),
    };
    console.log('formData', formData);
    // setShowOTP(true);
    // return;
    setIsLoading(true);
    await dispatch(registerUser(formData))
      .then(res => {
        Alert.alert(
          `Registrasi ${res.success ? 'Berhasil' : 'Gagal'}`,
          res.message,
          [
            {
              text: 'Ok',
              onPress: () =>
                res.success ? setRegisterComplete(true) : setShowOTP(false),
            },
          ],
        );
      })
      .catch(err =>
        Alert.alert('Registrasi Gagal', err.message, [
          {
            text: 'Ok',
            onPress: () => setShowOTP(false),
          },
        ]),
      );
    setIsLoading(false);
  };

  const handleChoiceOtp = via => {
    console.log('handleChoiceOtp', via);
    setSendOTPVia(via);
    setOtpCode('');
    sendOTP(via);
  };

  const handleSubmitOTP = async otp => {
    console.log('handleSubmitOTP', otp);
    setIsLoading(true);
    API.post('auth/check-otp-register', {
      otp: otp,
      verification_id: verificationId,
    })
      .then(res => {
        // console.log('res resend otp', res);
        if (res?.meta?.http_status === 200) {
          handleSubmitData();
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
    // setRegisterComplete(true);
    // setIsLoading(false);

    // dispatch({type: 'SET_TOKEN', value: 'token'});
    // dispatch({type: 'SET_ISLOGIN', value: true});
    // await AsyncStorage.setItem('token', 'token');

    // navigation.navigate('Splash');
  };

  const resendOTP = () => {
    setIsLoading(true);
    API.post('auth/resend-otp-register', {
      email_or_phone: data.email,
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

  const backActionOTP = () => {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin keluar?', [
      {
        text: 'Tidak',
        onPress: () => null, // Tidak melakukan apa-apa
        style: 'cancel',
      },
      {
        text: 'Ya',
        onPress: () => {
          setShowOTP(false);
          setChoiceOTP(false);
          setShowTerms(false);
        }, // Keluar dari aplikasi
      },
    ]);

    return true; // Kembalikan 'true' agar tindakan default tombol "Back" tidak terjadi
  };

  return (
    <View style={{flex: 1}}>
      <LoadingAnimated visible={IsLoading} />
      <FormRegister
        handleSubmit={handleValidation}
        data={data}
        setData={setData}
        pickedAddress={pickedAddress}
        AlertField={AlertField}
        navigation={navigation}
      />
      {/* First Pop BottomPanel */}
      {ShowTerms && (
        <BottomPanelModal
          radius={12}
          height={'100%'}
          withHeader
          showCloseBtn
          title={'Baca Syarat & Kondisi'}
          closePanel={() => {
            setShowTerms(false);
            setShowOTP(false);
          }}
          backgroundPanel={'#fff'}
          shadowTitle
          content={
            <TermsAndConditions
              style={{marginBottom: 20}}
              loading={IsLoading}
              // confirm={() => handleSubmitData()}
              confirm={() => {
                setChoiceOTP(true);
                // agreeNDA()
              }}
            />
          }
        />
      )}
      {/* Second Pop BottomPanel */}
      {ChoiceOTP ? (
        <BottomPanelModal
          radius={12}
          height={'100%'}
          closePanel={() => {
            setShowTerms(false);
            setChoiceOTP(false);
          }}
          content={<OTPVia onPress={handleChoiceOtp} />}
        />
      ) : null}
      {ShowOTP && (
        <BottomPanelModal
          radius={12}
          height={'100%'}
          closePanel={() => backActionOTP()}
          content={
            <>
              <OTPScreen
                column={4}
                phoneNumber={sendOTPVia === 'email' ? data?.email : data.phone}
                setOtpCode={setOtpCode}
                isLoading={IsLoading}
                goBack={() => backActionOTP()}
                resendOTP={resendOTP}
                otpVia={sendOTPVia}
                handlePressChangeOTPVia={handleChoiceOtp}
              />
            </>
          }
        />
      )}
      {RegisterComplete && (
        <BottomPanelModal
          radius={12}
          height={'auto'}
          backgroundPanel={'#FFFFFF'}
          content={
            <>
              <View
                style={[
                  gStyles.col_2,
                  {marginBottom: 10, padding: 16, paddingTop: 0},
                ]}>
                <Image source={AlertProfile} style={{margin: 16}} />
                <Text
                  style={[
                    {textAlign: 'center'},
                    gStyles.text(20, '700', '#313447'),
                  ]}>
                  Akun Berhasil Dibuat Dan Sedang Diverifikasi
                </Text>
                <Text
                  style={[
                    gStyles.text(12, '400', '#313447'),
                    {marginTop: 8, marginBottom: 16, textAlign: 'center'},
                  ]}>
                  Kami akan segera menghubungi anda jika akun telah selesai
                  diverifikasi.
                </Text>
                <Button
                  title={'Kembali Ke Login'}
                  onPress={() => navigation.navigate('Login')}
                  type="full"
                  style={styles.button}
                  // textStyle={styles.buttonText}
                />
              </View>
            </>
          }
        />
      )}
      {alert ? (
        <CustomAlert
          text={message}
          handleClose={() => dispatch(setAlert(false))}
          type={messageType}
          alertType={'top'}
        />
      ) : null}
    </View>
  );
};

export default Register;
