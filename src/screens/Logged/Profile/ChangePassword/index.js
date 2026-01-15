import {
  ScrollView,
  Text,
  TouchableOpacity,
  BackHandler,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  AppBar,
  Button,
  Input,
  Loading,
  CustomAlert,
  OTPScreen,
} from '../../../../components';
import {EyeClosed, EyeOpen, IconLeftArrow} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import {useTogglePasswordVisibility} from '../../../../utils/hooks';
import {
  setAlert,
  setAlertType,
  setLoading,
  setMessage,
  setMessageType,
} from '../../../../services';
import styles from './styles';
import API, {getErrorResponse} from '../../../../services/api';

const PasswordVisibilityToggle = ({isPasswordVisible, onToggleVisibility}) => (
  <TouchableOpacity
    onPress={onToggleVisibility}
    style={styles.hideShowPassword}>
    {isPasswordVisible ? (
      <EyeOpen fill="#9AA2B1" width={22} height={22} />
    ) : (
      <EyeClosed fill="#9AA2B1" width={22} height={22} />
    )}
  </TouchableOpacity>
);

const ChangePassword = ({navigation}) => {
  const [data, setData] = useState({
    password: '',
    confirmation_password: '',
  });
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
  const togglePasswordVisibility = () => {
    setNewPasswordVisibility(!newPasswordVisibility);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  const [validation, setValidation] = useState({
    password: true,
    confirmation_password: true,
  });
  const handleChange = (forField, value) => {
    setData({
      ...data,
      [forField]: value,
    });

    if (forField === 'password') {
      if (value.trim().length >= 6) {
        //jika
        if (data.confirmation_password.trim().length >= 6) {
          if (value === data.confirmation_password) {
            setValidation({
              ...validation,
              password: true,
            });
          } else {
            setValidation({
              ...validation,
              password: 'Konfirmasi password tidak sama',
            });
          }
        } else {
          setValidation({
            ...validation,
            password: true,
          });
        }
      } else {
        setValidation({
          ...validation,
          password: 'Password tidak boleh kurang dari 6 karakter',
        });
      }
    }
    if (forField === 'confirmation_password') {
      if (value.trim().length >= 6 && value === data.password) {
        setValidation({
          ...validation,
          confirmation_password: true,
        });
      } else {
        setValidation({
          ...validation,
          confirmation_password: 'Konfirmasi password tidak sama',
        });
      }
    }
  };
  const dispatch = useDispatch();
  const {userInfo, loading, alert, alertType, message, messageType, theme} =
    useSelector(reducer => reducer.global);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const valid = Object.values(validation).every(item => item === true); //semua property bernilai true
    // console.log('valid', valid);
    if (valid) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [validation]);
  const showError = (errMessage, topOrBottom) => {
    dispatch(setMessage(errMessage));
    dispatch(setMessageType('error'));
    dispatch(setAlert(true));
    dispatch(setAlertType(topOrBottom));
    dispatch(setLoading(false));
  };

  const handleSave = () => {
    API.post('auth/change-password', data)
      .then(res => {
        console.log('res change password', res);
        if (res?.meta?.http_status === 200) {
          dispatch(setMessage('Kata Sandi Berhasil Diganti'));
          dispatch(setMessageType('success'));
          dispatch(setAlert(true));
          setIsSubmitted(false);
          dispatch(setLoading(false));
          navigation.goBack();
        } else {
          const errMessage = getErrorResponse(res?.response?.data?.errors);
          showError(errMessage, 'top');
        }
      })
      .catch(err => {
        console.log('err change password', err);
        const errMessage = getErrorResponse(err?.response?.data?.errors);
        showError(errMessage, 'top');
      });
  };
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsSubmitted(false);
  }, []);

  const [verificationId, setVerificationId] = useState(0);

  const verifWithOTP = () => {
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
        } else {
          console.log('error', res?.response?.data?.errors);

          const errMessage = getErrorResponse(res?.response?.data?.errors);

          dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
          dispatch(setAlertType('top'));
          setOtpCode('');
        }
      })
      .catch(err => {
        const errMessage = getErrorResponse(err?.response?.data?.errors);

        dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
        dispatch(setMessageType('error'));
        dispatch(setAlertType('top'));
        dispatch(setAlert(true));
        dispatch(setLoading(false));
      });
  };
  const [otpCode, setOtpCode] = useState('');

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
            handleSave();
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
          dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
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

  const backHandle = () => {
    navigation.goBack();
  };
  useEffect(() => {
    const backAction = () => {
      backHandle();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, []);

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

  if (isSubmitted) {
    return (
      <OTPScreen
        column={4}
        phoneNumber={userInfo?.email}
        setOtpCode={setOtpCode}
        goBack={() => setIsSubmitted(false)}
        resendOTP={resendOTP}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <AppBar
          appBarColor={theme.backgroundColor}
          navigation={navigation}
          headerTextColor={theme.textColor}
          hideRightContent
          iconLeft={
            <IconLeftArrow width={20} height={20} fill={theme.textColor} />
          }
          title="Ubah Kata Sandi"
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
            <View style={styles.fieldWrapper}>
              <View style={[gStyles.formInput]}>
                <Text
                  style={[
                    gStyles.label('#6B6D7A', 13, '400'),
                    gStyles.weight('400'),
                  ]}>
                  Kata Sandi Baru
                </Text>
                <View style={styles.fieldContainer}>
                  <Input
                    placeholder={'Minimal 6 karakter'}
                    name="password"
                    placeholderTextColor={'#687083'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!newPasswordVisibility}
                    enablesReturnKeyAutomatically
                    onChangeText={value => handleChange('password', value)}
                    style={gStyles.field}
                  />

                  <PasswordVisibilityToggle
                    isPasswordVisible={newPasswordVisibility}
                    onToggleVisibility={togglePasswordVisibility}
                  />
                </View>
                {validation.password !== true && (
                  <Animatable.View animation="fadeInLeft" duration={150}>
                    <Text style={gStyles.errorMsg}>{validation.password}</Text>
                  </Animatable.View>
                )}
              </View>
              <View style={[gStyles.formInput]}>
                <Text
                  style={[
                    gStyles.label('#6B6D7A', 13, '400'),
                    gStyles.weight('400'),
                  ]}>
                  Konfirmasi Kata Sandi Baru
                </Text>
                <View style={styles.fieldContainer}>
                  <Input
                    placeholder={'Minimal 6 karakter'}
                    name="confirmation_password"
                    placeholderTextColor={'#687083'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!confirmPasswordVisibility}
                    enablesReturnKeyAutomatically
                    onChangeText={value =>
                      handleChange('confirmation_password', value)
                    }
                    style={gStyles.field}
                  />

                  <PasswordVisibilityToggle
                    isPasswordVisible={confirmPasswordVisibility}
                    onToggleVisibility={toggleConfirmPasswordVisibility}
                  />
                </View>
                {validation.confirmation_password !== true && (
                  <Animatable.View animation="fadeInLeft" duration={150}>
                    <Text style={gStyles.errorMsg}>
                      {validation.confirmation_password}
                    </Text>
                  </Animatable.View>
                )}
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
              onPress={() => verifWithOTP()}
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
        {loading && <Loading />}
        {alert ? (
          <CustomAlert
            text={message}
            handleClose={() => dispatch(setAlert(false))}
            type={messageType}
            alertType={alertType}
          />
        ) : null}
      </View>
    );
  }
};

export default ChangePassword;
