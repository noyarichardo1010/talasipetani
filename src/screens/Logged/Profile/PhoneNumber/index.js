import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppBar,
  BottomPanel,
  BottomPanelModal,
  Button,
  CustomAlert,
  LoadingAnimated,
  OTPScreen,
} from '../../../../components';
import {
  IconCallBold,
  IconEdit,
  IconLeftArrow,
  IconTrash,
} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import {
  setAlert,
  setAlertType,
  setLoading,
  setMessage,
  setMessageType,
} from '../../../../services';
import ModalAddPhoneNumber from './ModalAddPhoneNumber';
import ModalDeletePhoneNumber from './ModalDeletePhoneNumber';
import {Switch} from 'react-native-switch';
import API, {getErrorResponse} from '../../../../services/api';
import {SET_PHONE_LIST} from '../../../../services/redux/action/list';
import {useBackHandler} from '@react-native-community/hooks';

const PhoneNumber = ({navigation, asPopUp = false}) => {
  const dispatch = useDispatch();
  const {userInfo, theme, alert, message, messageType} = useSelector(
    reducer => reducer.global,
  );
  const {phoneList} = useSelector(reducer => reducer.profile);

  const [isBottomPanelShowed, setIsBottomPanelShowed] = useState(false);
  const [modalPosition, setModalPosition] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [clickedData, setClickedData] = useState(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [whichButton, setWhichButton] = useState('field');
  const [verificationId, setVerificationId] = useState(0);

  useEffect(() => {
    _handleCleanPop();
    dispatch(setAlert(false));
  }, [navigation]);

  // =========== Component Did Mount START =========== //
  useEffect(() => {
    setIsSubmitted(false);
    console.log('asPopUp', asPopUp);
    if (!asPopUp) {
      getListPhones();
    }
  }, []);

  function _handleAlertMessage(res, type = 'error', msg = null) {
    console.log('_handleAlertMessage', type, res.message);
    if (type === 'error') {
      const errMessage = msg
        ? msg
        : res?.response?.data?.errors
        ? getErrorResponse(res?.response?.data?.errors)
        : res.message;
      dispatch(setMessage(errMessage));
    } else {
      dispatch(setMessage(msg ? msg : res?.message));
    }
    dispatch(setMessageType(type));
    dispatch(setAlert(true));
    _handleCleanPop();
  }

  function _handleCleanPop() {
    console.log('------------------------ _handleCleanPop');
    setIsBottomPanelShowed(false);
    setIsSubmitted(false);
    setIsLoading(false);
  }

  // =========== Action API =========== //

  const getListPhones = () => {
    setIsLoading(true);
    API.get('farmer/phones', null, true)
      .then(res => {
        console.log('API res getListPhones', res);
        if (res?.meta?.http_status === 200) {
          const result = res.data
            ? res.data.map(dt => ({
                ...dt,
                is_default: dt.is_active_flag === 'Y',
              }))
            : [];

          dispatch({type: SET_PHONE_LIST, value: result});
          _handleCleanPop();
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  const addPhoneNumber = phone => {
    setIsLoading(true);
    API.post('farmer/add-phone', {phone}, true)
      .then(res => {
        console.log('API res addPhoneNumber', {phone}, '===', res);
        if (res?.meta?.http_status === 200) {
          const result = res.data ? res.data : null;
          dispatch({type: SET_PHONE_LIST, value: [...phoneList, result]});
          _handleAlertMessage(res, 'success', 'Nomor Berhasil Ditambahkan');
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  const editPhoneNumber = () => {
    setIsLoading(true);
    const body = {phone: newPhoneNumber};
    API.put(`farmer/phone/${clickedData.id}`, body, true)
      .then(async res => {
        console.log('API res editPhoneNumber', res);
        if (res?.meta?.http_status === 200) {
          await getListPhones();
          _handleAlertMessage(res, 'success', 'Nomor Berhasil Diubah');
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  const deletePhoneNumber = id => {
    setIsLoading(true);
    API.delete(`farmer/phone/${id}`)
      .then(async res => {
        // console.log('API res deletePhoneNumber', res);
        if (res?.meta?.http_status === 200) {
          await getListPhones();
          _handleAlertMessage(res, 'success', 'Nomor Berhasil Dihapus');
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  const primaryPhoneNumber = (id, status) => {
    setIsLoading(true);
    console.log('phone', id, status);
    // setIsLoading(false);
    // return;
    API.post('farmer/active-phones', {phone_id: id}, true)
      .then(async res => {
        // console.log('API res primaryPhoneNumber', res);
        if (res?.meta?.http_status === 200) {
          await getListPhones();
          _handleAlertMessage(res, 'success', 'Rekening Utama Dirubah');
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  const verifWithOTP = (phoneNumber, dt = null, actionType = 'edit') => {
    Keyboard.dismiss();

    //consume api send otp
    API.get(`farmer/send-otp-farmer?type_otp=phone&phone=${phoneNumber}`)
      .then(res => {
        console.log('res send otp', res);
        setIsLoading(false);

        if (res?.meta?.http_status === 200) {
          setVerificationId(res.data.verification_id);

          setNewPhoneNumber(phoneNumber);
          if (dt) {
            setClickedData(dt);
            if (actionType === 'delete') {
              setWhichButton('delete');
            } else if (actionType === 'primary') {
              setWhichButton('primary');
            } else {
              setWhichButton('field');
            }
          }
          setIsSubmitted(true);
          setOtpCode('');
        } else {
          console.log('error', res?.response?.data?.errors);

          const errMessage = getErrorResponse(res?.response?.data?.errors);
          Alert.alert('Gagal', errMessage[0]);
          dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
          dispatch(setAlertType('top'));
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
        setIsLoading(false);
      });
  };

  const [otpCode, setOtpCode] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsSubmitted(false);
  }, []);

  useEffect(() => {
    console.log('otpCode', otpCode);
    console.log('clickedData', clickedData);
    // consume api verif otp
    if (otpCode !== '') {
      if (clickedData === null) {
        addPhoneNumber(newPhoneNumber);
      } else if (whichButton === 'delete') {
        deletePhoneNumber(clickedData.id);
      } else if (whichButton === 'primary') {
        // primaryPhoneNumber();
        // if (newPhoneNumber === false) {
        //   dispatch(setMessage('Nomor Handphone Berhasil Dinonaktifkan'));
        // } else {
        //   dispatch(setMessage('Nomor Handphone Berhasil Diaktifkan'));
        // }
      } else {
        editPhoneNumber();
        // showEditPanel();
      }
    }
  }, [otpCode]);

  const handleSetOtp = otp => {
    // console.log('otp', otp);
    // setIsBottomPanelShowed(false);
    setOtpCode(otp);
  };

  const handleActionClick = (btn = 'field', data = null, popShow = true) => {
    console.log('btn', btn, data, popShow);
    setIsBottomPanelShowed(popShow);
    setClickedData(data);
    setWhichButton(btn);
    if (!popShow) {
      setIsSubmitted(true);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getListPhones();
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }, []);

  // useBackHandler(() => handleBack());
  const handleBack = () => navigation.goBack();

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

  return (
    <View style={styles.container}>
      <LoadingAnimated visible={isLoading} handleBack={() => handleBack()} />
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        hideRightContent
        iconLeft={
          <IconLeftArrow width={22} height={22} fill={theme.textColor} />
        }
        title="Nomor Handphone"
        borderBottom
        borderBottomColor={theme.textColor}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
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
          {phoneList?.map((dt, i) => (
            <View key={i} style={styles.numberList.container}>
              <View style={styles.numberList.wrapper}>
                <View style={gStyles.row}>
                  <IconCallBold
                    fill="#5C73BD"
                    width={24}
                    height={24}
                    style={gStyles.marginRight(4)}
                  />
                  <Text style={gStyles.text(14, '500', theme.textColor)}>
                    {dt.phone_number}
                  </Text>
                </View>
                <View style={gStyles.row}>
                  <Text
                    style={[
                      gStyles.text(14, '400', '#313447'),
                      gStyles.marginRight(8),
                    ]}>
                    {dt.is_default === true ? 'Aktif' : 'Nonaktif'}
                  </Text>
                  <Switch
                    onValueChange={newVal => {
                      if (newVal) {
                        primaryPhoneNumber(dt.id, newVal);
                      }
                    }}
                    value={dt.is_default}
                    activeText={''}
                    inActiveText={''}
                    circleSize={20}
                    backgroundInactive="#CBCCD1"
                    backgroundActive={theme.activeIconColor}
                    innerCircleStyle={{
                      borderWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 8,
                      marginRight: 8,
                    }}
                  />
                </View>
              </View>
              <View style={styles.numberList.button}>
                <TouchableOpacity
                  style={styles.numberList.buttonEdit}
                  // onPress={() => handleClickEditPhoneNumber(i, dt)}>
                  onPress={() => {
                    handleActionClick('field', dt);
                    // verifWithOTP(dt.phone_number, i, dt)
                  }}>
                  <IconEdit
                    fill="#313447"
                    width={16}
                    height={16}
                    style={gStyles.marginRight(4)}
                  />
                  <Text style={gStyles.text(12, '500', '#313447')}>Ubah</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.numberList.buttonDelete,
                    {
                      backgroundColor: dt.is_default
                        ? colors.neutral
                        : '#F5F6F7',
                    },
                  ]}
                  // onPress={() => verifWithOTP(dt.phone_number, i, dt)}
                  onPress={() => handleActionClick('delete', dt)}
                  disabled={dt.is_default} //tidak bisa hapus jika nomor utama
                >
                  <IconTrash
                    // fill="#313447"
                    fill={dt.is_default ? 'gray' : '#313447'}
                    width={16}
                    height={16}
                    style={gStyles.marginRight(4)}
                  />
                  <Text
                    style={gStyles.text(
                      12,
                      '500',
                      dt.is_default ? 'gray' : '#313447',
                    )}>
                    Hapus
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
            title="Tambah Nomor Handphone"
            onPress={() => handleActionClick()}
            type="full"
          />
        </View>
      </>
      {alert && (
        <View style={styles.alert}>
          <CustomAlert
            text={message}
            handleClose={() => dispatch(setAlert(false))}
            type={messageType}
            alertType="bottom"
          />
        </View>
      )}
      {isBottomPanelShowed ? (
        <BottomPanel
          closePanel={() => {
            setModalPosition(0);
            setIsBottomPanelShowed(false);
          }}
          height="auto"
          radius={12}
          withHeader={whichButton === 'field' ? true : false}
          clickOutsideToClosePanel
          showCloseBtn
          title={
            clickedData === null
              ? 'Tambah Nomor Handphone'
              : 'Ubah Nomor Handphone'
          }
          position={modalPosition}
          backgroundPanel={'#fff'}
          // setModalPosition={setModalPosition}
          content={
            whichButton === 'field' ? (
              <ModalAddPhoneNumber
                handleSubmit={verifWithOTP}
                setModalPosition={setModalPosition}
                clickedData={clickedData}
              />
            ) : (
              <ModalDeletePhoneNumber
                // handleSubmit={deletePhoneNumber}
                handleSubmit={verifWithOTP}
                clickedData={clickedData}
                cancel={() => setIsBottomPanelShowed(false)}
              />
            )
          }
        />
      ) : null}
      {isSubmitted && (
        <BottomPanelModal
          closePanel={() => {
            Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin keluar?', [
              {
                text: 'Tidak',
                onPress: () => null, // Tidak melakukan apa-apa
                style: 'cancel',
              },
              {
                text: 'Ya',
                onPress: () => {
                  setIsBottomPanelShowed(false);
                  setIsSubmitted(false);
                }, // Keluar dari aplikasi
              },
            ]);
          }}
          height={'100%'}
          content={
            <OTPScreen
              column={4}
              // phoneNumber={
              //   clickedData === null ? newPhoneNumber : clickedData.phone_number
              // }
              phoneNumber={
                clickedData === null ? newPhoneNumber : clickedData.phone_number
              }
              setOtpCode={v => handleSetOtp(v)}
              isLoading={isLoading}
              resendOTP={resendOTP}
              goBack={() => setIsSubmitted(false)}
            />
          }
        />
      )}
    </View>
  );
};

export default PhoneNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  wrapper: {
    padding: 16,
  },
  numberList: {
    container: {
      borderWidth: 1,
      borderColor: '#E3E3E5',
      borderRadius: 8,
      padding: 12,
      backgroundColor: '#ffffff',
      marginBottom: 12,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: '#E3E3E5',
      borderBottomWidth: 1,
      paddingBottom: 12,
      marginBottom: 12,
    },
    primary: {
      backgroundColor: '#EBFFEB',
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    button: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonEdit: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 8,
      flex: 1,
      borderRadius: 4,
      backgroundColor: '#F5F6F7',
      marginLeft: 8,
    },
    buttonDelete: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 8,
      flex: 1,
      borderRadius: 4,
      backgroundColor: '#F5F6F7',
      marginLeft: 8,
    },
  },
  alert: {position: 'relative', bottom: 65},
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
  btnSubmit: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#2A378E',
  },
  btnSubmitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});
