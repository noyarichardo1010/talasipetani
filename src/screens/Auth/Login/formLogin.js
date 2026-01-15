import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FieldInput from '../../../components/molecules/FieldInput';
import {IconBiometrik, BGLogin, Logo, IconHelpCenter} from '../../../assets';
import styles from './styles';
import {gStyles} from '../../../utils/styles';
import {Button, Container} from '../../../components';
import {useSelector} from 'react-redux';

const FormLogin = ({
  handleSubmit,
  data,
  setData,
  navigation,
  AlertField,
  onBiometricShow,
}) => {
  const {theme} = useSelector(reducer => reducer.global);

  const handleChange = (forField, value) => {
    setData({
      ...data,
      [forField]: value,
    });
  };
  const checkIsEmpty = field => {
    if (AlertField.length > 0) {
      let check = AlertField.find(alt => alt.field === field);
      return check ? check.empty : false;
    } else {
      return false;
    }
  };
  const checkLengthMore4 = field => {
    if (AlertField.length > 0) {
      let check = AlertField.find(alt => alt.field === field);
      return check ? check.empty : false;
    } else {
      return false;
    }
  };

  const [loginWithEmailOrPhone, setLoginWithEmailOrPhone] = useState(false);

  useEffect(() => {
    if (loginWithEmailOrPhone) {
      setData({
        email_or_phone: '',
        password: '',
      });
    } else {
      setData({login_id: '', password: ''});
    }
  }, [loginWithEmailOrPhone]);

  return (
    <Container style={[{backgroundColor: theme.backgroundColor}]}>
      <ImageBackground
        source={BGLogin}
        resizeMode="cover"
        style={[styles.backgroundImage, {paddingVertical: 50}]}>
        <View style={{position: 'absolute', top: -8, right: 10}}>
          <TouchableOpacity
            style={[styles.biometrikBtn, styles.btnBantuan]}
            onPress={() => navigation.navigate('PusatBantuan')}>
            <IconHelpCenter />
            <Text style={{color: '#2E3192', paddingLeft: 5, paddingBottom: 2}}>
              Bantuan
            </Text>
          </TouchableOpacity>
        </View>

        <Image source={Logo} style={styles.logo} />
        <Text style={styles.screenTitle}>Masuk ke Akun</Text>

        <FieldInput
          field={loginWithEmailOrPhone ? 'email_or_phone' : 'login_id'}
          label={
            loginWithEmailOrPhone ? 'Email / Nomor Handphone' : 'Nomor Akun'
          }
          placeholder={' '}
          data={data}
          checkIsEmpty={checkIsEmpty}
          handleChange={handleChange}
        />

        <FieldInput
          field={'password'}
          label={'Kata Sandi'}
          data={data}
          placeholder={' '}
          checkIsEmpty={checkIsEmpty}
          handleChange={handleChange}
          passwordContent
        />

        <View style={styles.forgotPasswordWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Lupa Kata Sandi?</Text>
          </TouchableOpacity>
        </View>
        <View style={gStyles.space(24)} />
        <Button
          title="Masuk"
          onPress={() => handleSubmit()}
          type="full"
          style={[styles.btnLogin, {width: '100%'}]}
          textStyle={styles.btnLoginText}
        />
        <TouchableOpacity
          style={styles.loginWithWrapper}
          onPress={() => setLoginWithEmailOrPhone(!loginWithEmailOrPhone)}>
          <Text
            style={[
              styles.forgotPasswordText,
              {fontWeight: '800', fontSize: 18},
            ]}>
            Login dengan{' '}
            {loginWithEmailOrPhone ? 'Nomor Akun' : 'Email / No. Hp'}
          </Text>
        </TouchableOpacity>
        <View style={gStyles.marginTop(24)}>
          <Text style={gStyles.text(14, '400', theme.secondaryTextColor)}>
            Atau masuk dengan biometrik
          </Text>
          <TouchableOpacity
            style={styles.biometrikBtn}
            onPress={() => onBiometricShow()}>
            <IconBiometrik fill={'#5866BB'} width={25} height={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.dontHaveAccountWrapper}>
          <Text style={styles.dontHaveAccountText}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.dontHaveAccountTextBtn}>Daftar di sini</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Container>
  );
};

export default FormLogin;
