import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {colors, gStyles, Mixins} from '../../../utils/styles';
import {CustomAlert, Loading, LoadingAnimated, OTPInput} from '../../atoms';
import {replaceAt} from '../../../utils/helpers/text';
import {useDispatch, useSelector} from 'react-redux';
import {setAlert} from '../../../services';
import {IconRightArrow} from '../../../assets';
import {useBackHandler} from '@react-native-community/hooks';

const OTPScreen = ({
  column,
  phoneNumber,
  setOtpCode,
  navigation,
  isLoading = false,
  resendOTP = () => Alert.alert('resend otp'),
  goBack = () => Alert.alert('goback'),
  otpVia,
  handlePressChangeOTPVia,
}) => {
  const otpRef = useRef();
  const {loading, theme, message, messageType, alert} = useSelector(
    reducer => reducer.global,
  );
  const [seconds, setSeconds] = useState(10); // Waktu awal dalam detik
  const handlePressResendOTP = () => {
    resendOTP();
    setSeconds(120);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1); // Mengurangi satu detik setiap kali interval berjalan
      } else {
        clearInterval(timer); // Hentikan interval ketika waktu habis
        // Tambahkan kode di sini untuk menangani ketika waktu habis
      }
    }, 1000); // Interval setiap 1 detik

    return () => {
      clearInterval(timer); // Membersihkan interval saat komponen unmount
    };
  }, [seconds]);

  // Format waktu dalam format menit:detik
  const formattedTime = `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  const dispatch = useDispatch();

  useBackHandler(() => backAction());

  const backAction = () => {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin keluar?', [
      {
        text: 'Tidak',
        onPress: () => null, // Tidak melakukan apa-apa
        style: 'cancel',
      },
      {
        text: 'Ya',
        onPress: () => goBack(), // Keluar dari aplikasi
      },
    ]);

    return true; // Kembalikan 'true' agar tindakan default tombol "Back" tidak terjadi
  };
  return (
    <View style={styles.wrapper}>
      <LoadingAnimated visible={isLoading} handleBack={() => backAction()} />

      <View style={styles.screenTitle}>
        <Text style={styles.screenTitleText}>Verifikasi OTP</Text>
      </View>
      <View style={styles.desc}>
        <Text style={styles.descText}>
          Masukkan kode verifikasi yang telah dikirimkan ke{' '}
          <Text style={gStyles.weight('500')}>
            {replaceAt(phoneNumber, 4, 'xxxxxx')}
          </Text>
        </Text>
      </View>
      <View style={gStyles.marginTop(24)}>
        <OTPInput
          column={column}
          onSubmit={value => setOtpCode(value)}
          ref={otpRef}
          navigation={navigation}
        />
      </View>
      {seconds <= 0 ? (
        <TouchableOpacity onPress={handlePressResendOTP}>
          <Text
            style={[
              gStyles.marginTop(24),
              gStyles.text(Mixins.scaleFont(14), 'normal', colors.grey),
            ]}>
            Klik <Text style={gStyles.weight('500')}>di sini</Text> untuk kirim
            ulang kode
          </Text>
        </TouchableOpacity>
      ) : (
        <Text
          style={[
            gStyles.marginTop(24),
            gStyles.text(Mixins.scaleFont(14), 'normal', colors.grey),
          ]}>
          Kirim ulang kode setelah{' '}
          <Text style={gStyles.weight('500')}>{formattedTime}</Text>
        </Text>
      )}
      {otpVia === 'email' ? (
        <TouchableOpacity
          onPress={() => handlePressChangeOTPVia('phone')}
          style={[gStyles.row_center3, gStyles.marginTop(24)]}>
          <Text
            style={[gStyles.text(Mixins.scaleFont(14), '500', colors.primary)]}>
            Kirim OTP Lewat Nomor Handphone{' '}
          </Text>
          <IconRightArrow fill={colors.primary} width={12} height={12} />
        </TouchableOpacity>
      ) : otpVia === 'phone' ? (
        <TouchableOpacity
          onPress={() => handlePressChangeOTPVia('email')}
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Text
            style={[
              gStyles.marginTop(24),
              gStyles.text(Mixins.scaleFont(14), '500', colors.primary),
            ]}>
            Kirim OTP Lewat Email{' '}
            <IconRightArrow fill={colors.primary} width={12} height={12} />
          </Text>
        </TouchableOpacity>
      ) : null}
      {alert ? (
        <CustomAlert
          text={message}
          handleClose={() => dispatch(setAlert(false))}
          type={messageType}
          alertType={'bottom'}
        />
      ) : null}
      {loading ? <Loading /> : null}
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    zIndex: 15,
  },
  desc: {
    display: 'flex',
  },
  descText: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 8,
    color: '#313447',
  },
  screenTitle: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#313447',
  },
});
