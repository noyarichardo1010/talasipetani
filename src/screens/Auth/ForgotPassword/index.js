import {Text, View, BackHandler, Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {IconHelp, IconHelpCenter} from '../../../assets';
import {Button, CustomAlert, Input, OTPScreen} from '../../../components';
import {colors, gStyles} from '../../../utils/styles';
import {getErrorResponse} from '../../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAlert,
  setLoading,
  setMessage,
  setMessageType,
} from '../../../services';
import API from '../../../services/api';

const ForgotPassword = ({navigation}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [value, setValue] = useState('');
  const dispatch = useDispatch();
  const {loading, theme, message, messageType, alert} = useSelector(
    reducer => reducer.global,
  );
  const isDisabled = value === '';
  const [resForgotPassword, setResForgotPassword] = useState({
    user_id: null,
    verification_id: null,
  });

  const goBack = () => {
    setIsSubmitted(false);
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin keluar?', [
        {
          text: 'Tidak',
          onPress: () => null, // Tidak melakukan apa-apa
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: () => navigation.navigate('Login'), // ke halaman login
        },
      ]);

      return true; // Kembalikan 'true' agar tindakan default tombol "Back" tidak terjadi
    };

    // Tambahkan listener untuk tombol "Back"
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Membersihkan listener saat komponen unmount
    return () => {
      backHandler.remove();
    };
  }, []);

  const handleSubmit = () => {
    dispatch(setLoading(true));
    //nanti ini di hapus, diganti dengan api
    API.post('auth/forgot-password-send-otp', {email_or_phone: value})
      .then(res => {
        console.log('res forgot password', res);
        if (res?.meta?.http_status === 200) {
          dispatch(setLoading(false));
          setIsSubmitted(true);
          setResForgotPassword(res.data);
        } else {
          const errMessage = getErrorResponse(res?.response?.data?.errors);
          dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
          setValue('');
          dispatch(setLoading(false));
        }
      })
      .catch(err => {
        // console.log('err forgot password', err);
        const errMessage = getErrorResponse(err?.response?.data?.errors);
        dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
        dispatch(setMessageType('error'));
        dispatch(setAlert(true));
        dispatch(setLoading(false));
      });
  };

  const resendOTP = () => {
    dispatch(setLoading(true));
    API.post('auth/forgot-password-resend-otp', {
      verification_id: resForgotPassword.verification_id,
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

  useEffect(() => {
    setIsSubmitted(false);
  }, []);

  const handleChange = val => {
    setValue(val);
  };

  const [otpCode, setOtpCode] = useState('');
  useEffect(() => {
    // console.log('otpCode', otpCode);
    // consume api verif otp
    if (otpCode !== '') {
      dispatch(setLoading(true));
      API.post('auth/forgot-password-check-otp', {
        verification_id: resForgotPassword.verification_id,
        otp_code: otpCode,
      })
        .then(res => {
          console.log('res check otp', res);
          if (res?.meta?.http_status === 200) {
            dispatch(setLoading(false));
            navigation.navigate('NewPassword', {
              ...resForgotPassword,
              otp_code: otpCode,
            });
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
    }
  }, [otpCode]);

  if (isSubmitted) {
    return (
      <OTPScreen
        column={4}
        phoneNumber={value}
        setOtpCode={setOtpCode}
        resendOTP={resendOTP}
        goBack={goBack}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.screenTitle}>
            <Text style={styles.screenTitleRight}>Lupa Kata Sandi</Text>

            <TouchableOpacity
              style={styles.screenTitleLeft}
              onPress={() => navigation.navigate('PusatBantuan')}>
              <IconHelp width={14} height={14} fill={'#2A378E'} />
              <Text style={styles.screenTitleLeftText}>Bantuan</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.screenDesc}>
            Masukkan email atau nomor handphone yang terhubung dengan akun Anda.
          </Text>
          <View style={[gStyles.formInput]}>
            <Text style={gStyles.label('#6B6D7A', 13, '400')}>
              Email / Nomor Handphone
            </Text>
            <Input
              // placeholder={'Sample: 082312345678'}
              name="value"
              placeholderTextColor={'#687083'}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={val => handleChange(val)}
              style={styles.inputField}
            />
          </View>

          <Button
            title="Atur Ulang Kata Sandi"
            onPress={() => handleSubmit()}
            type="full"
            isDisabled={isDisabled}
            loading={loading}
            style={[
              styles.btnForgotPassword,
              {
                backgroundColor: isDisabled ? colors.neutral : colors.primary,
              },
            ]}
            textStyle={[
              styles.btnForgotPasswordText,
              {
                color: isDisabled ? colors.grey2 : colors.light,
              },
            ]}
          />
        </View>
        <Button
          title="Kembali Ke Login"
          onPress={() => navigation.navigate('Login')}
          type="outline"
          style={styles.btnBackToLogin}
          textStyle={styles.btnBackToLoginText}
        />

        {/* {loading && <Loading />} */}
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
  }
};

export default ForgotPassword;
