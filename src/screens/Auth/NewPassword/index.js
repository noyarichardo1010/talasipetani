import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from './styles';
import {EyeClosed, EyeOpen, ProtectIMG} from '../../../assets';
import {
  BottomPanel,
  Button,
  CustomAlert,
  Input,
  Loading,
} from '../../../components';
import {colors, gStyles, Mixins} from '../../../utils/styles';
import {useDispatch, useSelector} from 'react-redux';

import AuthModal from '../AuthModal';
import API, {getErrorResponse} from '../../../services/api';
import {
  setAlert,
  setAlertType,
  setLoading,
  setMessage,
  setMessageType,
} from '../../../services';
import * as Animatable from 'react-native-animatable';

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
const NewPassword = ({navigation, route}) => {
  const [data, setData] = useState({
    otp_code: route.params?.otp_code,
    user_id: route.params?.user_id,
    password: '',
    confirm_password: '',
  });
  const [isBottomPanelShowed, setIsBottomPanelShowed] = useState(false);

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
    confirm_password: true,
  });

  const handleChange = (forField, value) => {
    setData({
      ...data,
      [forField]: value,
    });

    if (forField === 'password') {
      if (value.trim().length >= 6) {
        //jika
        if (data.confirm_password.trim().length >= 6) {
          if (value === data.confirm_password) {
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
    if (forField === 'confirm_password') {
      if (value.trim().length >= 6 && value === data.password) {
        setValidation({
          ...validation,
          confirm_password: true,
        });
      } else {
        setValidation({
          ...validation,
          confirm_password: 'Konfirmasi password tidak sama',
        });
      }
    }
  };

  const dispatch = useDispatch();
  const {userInfo, loading, alert, alertType, message, messageType, theme} =
    useSelector(reducer => reducer.global);

  const showError = (errMessage, topOrBottom) => {
    dispatch(setMessage(errMessage));
    dispatch(setMessageType('error'));
    dispatch(setAlert(true));
    dispatch(setAlertType(topOrBottom));
    dispatch(setLoading(false));
  };

  const handleSubmit = async () => {
    console.log('data yang disubmit:', data);
    dispatch(setLoading(true));
    API.post('auth/forgot-password-change-password', data)
      .then(res => {
        console.log('res change password', res);

        if (res?.meta?.http_status === 200) {
          dispatch(setMessage('Kata Sandi Berhasil Diganti'));
          dispatch(setMessageType('success'));
          dispatch(setAlert(true));
          setIsSubmitted(false);
          dispatch(setLoading(false));
          setIsBottomPanelShowed(true);
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

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.screenTitle}>
          <Text style={styles.screenTitleRight}>Kata Sandi Baru</Text>
        </View>
        <Text style={styles.screenDesc}>
          Buat kata sandi baru untuk akun Anda.
        </Text>
        <View style={gStyles.formInput}>
          <Text style={gStyles.label}>Kata Sandi</Text>
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
              style={[
                gStyles.field,
                validation.password === true ? null : {borderColor: 'red'},
              ]}
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
        <View style={gStyles.formInput}>
          <Text style={gStyles.label}>Kata Sandi Baru</Text>
          <View style={styles.fieldContainer}>
            <Input
              placeholder={'Minimal 6 karakter'}
              name="confirm_password"
              placeholderTextColor={'#687083'}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!confirmPasswordVisibility}
              enablesReturnKeyAutomatically
              onChangeText={value => handleChange('confirm_password', value)}
              style={[
                gStyles.field,
                validation.confirm_password !== true
                  ? {borderColor: 'red'}
                  : null,
              ]}
            />

            <PasswordVisibilityToggle
              isPasswordVisible={confirmPasswordVisibility}
              onToggleVisibility={toggleConfirmPasswordVisibility}
            />
          </View>
          {validation.confirm_password !== true && (
            <Animatable.View animation="fadeInLeft" duration={150}>
              <Text style={gStyles.errorMsg}>
                {validation.confirm_password}
              </Text>
            </Animatable.View>
          )}
        </View>

        <Button
          title="Simpan"
          isDisabled={isDisabled}
          onPress={() => handleSubmit()}
          type="full"
          style={styles.btnSubmit}
          textStyle={styles.btnSubmitText}
          loading={loading}
        />
      </View>

      {/* {loading && <Loading />} */}
      {isBottomPanelShowed ? (
        <BottomPanel
          showPanel={setIsBottomPanelShowed}
          height="auto"
          content={
            <AuthModal
              img={ProtectIMG}
              title="Kata Sandi Berhasil Dibuat"
              desc="Silahkan masuk ke akun Anda menggunakan kata sandi yang telah dibuat."
              textBtn="Masuk Ke Akun"
              navigation={navigation}
            />
          }
        />
      ) : null}
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
};

export default NewPassword;
