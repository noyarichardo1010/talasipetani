import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppBar,
  BottomPanelModal,
  Button,
  CustomAlert,
  LoadingAnimated,
  OTPScreen,
  RadioButtons,
} from '../../../../components';
import {
  IconAdd,
  IconBuilding,
  IconEdit,
  IconLeftArrow,
  IconTrash,
  IconWarning,
} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import {
  setAlert,
  setLoading,
  setMessage,
  setMessageType,
} from '../../../../services';
import ModalAddRekeningBank from './ModalAddRekeningBank';
import ModalDeleteRekeningBank from './ModalDeleteRekeningBank';
import API, {getErrorResponse} from '../../../../services/api';
import {
  SET_BANK_LIST,
  SET_EMPTY_BANK,
  SET_MASTER_BANK,
  SET_BANK_PRIMARY,
} from '../../../../services/redux/action/list';
const {height} = Dimensions.get('window');
const RekeningBank = ({navigation, asPopUp = false, closePanel}) => {
  const dispatch = useDispatch();
  const {theme, alert, message, messageType, userInfo} = useSelector(
    reducer => reducer.global,
  );
  const {bankList, emptyBank} = useSelector(reducer => reducer.profile);

  const [isBottomPanelShowed, setIsBottomPanelShowed] = useState(false);
  const [isLoading, setIsLoading] = useState(!asPopUp);
  const [refreshing, setRefreshing] = useState(false);
  const [modalPosition, setModalPosition] = useState(0);
  const [clickedData, setClickedData] = useState(null);
  const [whichButton, setWhichButton] = useState('field');
  const [alertType, setAlertType] = useState('bottom');
  const [verificationId, setVerificationId] = useState(0);
  const [newBank, setNewBank] = useState({
    bank_id: '',
    bank_account_number: '',
    bank_account_name: '',
  });

  useEffect(() => {
    // console.log('bankList', bankList);

    _handleCleanPop();
    dispatch(setAlert(false));
  }, [navigation]);

  // =========== Component Did Mount START =========== //
  useEffect(() => {
    setIsSubmitted(false);
    console.log('asPopUp', asPopUp);
    // if (!asPopUp) {
    getMasterBank();
    getListBank();
    // }
  }, []);

  function _handleAlertMessage(res, type = 'error', msg = null) {
    // console.log('_handleAlertMessage', type, res.message);
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

  const getMasterBank = () =>
    API.get('bank')
      .then(res => {
        // console.log('API res getMasterBank', res);
        if (res?.meta?.http_status === 200) {
          const result = res.data.map(bank => ({
            value: bank.id,
            label: bank.name,
            code: bank.code,
          }));
          dispatch({type: SET_MASTER_BANK, value: result});
        }
        // else _handleAlertMessage(res);
      })
      .catch(err => console.log(err));

  const getListBank = () => {
    setIsLoading(true);
    API.get('farmer/account-bank')
      .then(res => {
        // console.log('API res getListBank', res);
        if (res?.meta?.http_status === 200) {
          const result = res.data ? res.data : [];
          // console.log('API res getListBank 2', result);
          if (result.length > 0) {
            dispatch({type: SET_EMPTY_BANK, value: false});
            let findPrimary = result.find(rest => rest.is_default === true);
            // console.log('findPrimary', findPrimary.bank);
            dispatch({type: SET_BANK_PRIMARY, value: findPrimary});
          }
          dispatch({type: SET_BANK_LIST, value: result});

          _handleCleanPop();
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  const addRekening = passData => {
    setIsLoading(true);
    API.post('farmer/account-bank', passData, true)
      .then(res => {
        // console.log('API res addRekening', res);
        if (res?.meta?.http_status === 200) {
          getListBank();
          // const result = res.data ? res.data : null;
          // dispatch({type: SET_BANK_LIST, value: [...bankList, result]});
          // dispatch({type: SET_EMPTY_BANK, value: false});
          _handleAlertMessage(res, 'success', 'Rekening Berhasil Ditambahkan');
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  const editRekening = () => {
    setIsLoading(true);
    // console.log('newBank', newBank);
    API.put(`farmer/account-bank/${clickedData.id}`, newBank)
      .then(async res => {
        // console.log('API res editRekening', res);
        if (res?.meta?.http_status === 200) {
          await getListBank();
          _handleAlertMessage(res, 'success', 'Rekening Berhasil Diubah');
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  const deleteRekeningBank = id => {
    setIsLoading(true);
    API.delete(`farmer/account-bank/${id}`)
      .then(async res => {
        // console.log('API res deleteRekeningBank', res);
        if (res?.meta?.http_status === 200) {
          await getListBank();
          _handleAlertMessage(res, 'success', 'Rekening Berhasil Dihapus');
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  const primaryRekeningBank = id => {
    setIsLoading(true);
    API.post('farmer/active-account-bank', {bank_account_id: id}, true)
      .then(async res => {
        // console.log('API res primaryRekeningBank', res);
        if (res?.meta?.http_status === 200) {
          await getListBank();
          if (asPopUp) {
            return closePanel();
          }
          _handleAlertMessage(res, 'success', 'Rekening Utama Dirubah');
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  const handleAddOrEdit = (
    bank_id,
    bank_account_number,
    bank_account_name,
    actionType = 'edit',
  ) => {
    setIsLoading(true);
    API.get('farmer/send-otp-farmer?type_otp=email')
      .then(res => {
        // console.log('res send otp', res);
        setIsLoading(false);

        if (res?.meta?.http_status === 200) {
          setVerificationId(res.data.verification_id);
          Keyboard.dismiss();
          setNewBank({
            bank_id,
            bank_account_number,
            bank_account_name,
          });
          if (actionType === 'delete') {
            setWhichButton('delete');
          } else if (actionType === 'setActive') {
            setWhichButton('setActive');
          } else {
            setWhichButton('field');
          }

          setIsSubmitted(true);
          setOtpCode('');
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
        setIsLoading(false);
      });
  };

  // ======================================================== //

  const [otpCode, setOtpCode] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // consume api verif otp
    if (otpCode !== '') {
      setIsLoading(true);
      API.post('farmer/send-otp-farmer/check', {
        verification_id: verificationId,
        otp: otpCode,
      })
        .then(res => {
          // console.log('res check otp', res);
          setIsLoading(false);

          if (res?.meta?.http_status === 200) {
            if (clickedData === null) {
              addRekening(newBank);
            } else if (whichButton === 'delete') {
              deleteRekeningBank(clickedData.id);
            } else if (whichButton === 'primary') {
              primaryRekeningBank(clickedData.id);
            } else {
              editRekening();
            }
          } else {
            console.log('error', res?.response?.data?.errors);

            const errMessage = getErrorResponse(res?.response?.data?.errors);
            dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
            dispatch(setMessageType('error'));
            dispatch(setAlertType('top'));
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
          dispatch(setAlertType('top'));
          setIsLoading(false);
        });
    }
  }, [otpCode]);

  const handleSetOtp = otp => {
    // console.log('otp', otp);
    // setIsBottomPanelShowed(false);
    setOtpCode(otp);
  };

  const handleBuatPenawaran = async () => {
    setIsLoading(true);
    await asPopUp.handleSubmitOffer();
    setTimeout(() => {
      setIsLoading(false);
    }, 1700);
    return;
  };

  const handleActionClick = async (
    btn = 'field',
    data = null,
    popShow = true,
  ) => {
    // console.log('btn', btn, data);

    setIsBottomPanelShowed(popShow);
    setClickedData(data);
    setWhichButton(btn);
    if (!popShow) {
      //consume api send otp
      await API.get('farmer/send-otp-farmer?type_otp=email')
        .then(res => {
          // console.log('res send otp', res);
          setIsLoading(false);

          if (res?.meta?.http_status === 200) {
            setVerificationId(res.data.verification_id);

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
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getListBank();
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
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

  return (
    <View style={[styles.container, {paddingBottom: asPopUp ? 30 : 0}]}>
      <LoadingAnimated
        visible={isLoading}
        handleBack={() => setIsLoading(false)}
      />
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        hideRightContent
        customBack={asPopUp ? closePanel : null}
        iconLeft={
          <IconLeftArrow width={20} height={20} fill={theme.textColor} />
        }
        title={asPopUp ? 'Rekening Penerima Pembayaran' : 'Rekening Bank'}
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
        {emptyBank ? (
          <View style={{display: 'flex', flex: 1}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF6EB',
                paddingVertical: 12,
                paddingHorizontal: 16,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FF9100',
                  borderRadius: 40,
                  height: 32,
                  width: 32,
                  marginRight: 16,
                }}>
                <IconWarning fill="#FFF6EB" width={20} height={20} />
              </View>
              <Text
                style={[gStyles.text(14, '500', '#313447'), gStyles.flex(1)]}>
                Lengkapi informasi rekening bank Anda untuk dapat melakukan
                penawaran.
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                height: height - 200,
              }}>
              <View
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  padding: 16,
                }}>
                <IconBuilding fill="#CBCCD1" width={80} height={80} />
                <Text
                  style={[
                    gStyles.text(16, '700', '#313447'),
                    gStyles.textCenter,
                    gStyles.marginTop(16),
                  ]}>
                  Belum Ada Rekening Bank
                </Text>
                <Text
                  style={[
                    gStyles.text(14, '400', '#797B8A'),
                    gStyles.textCenter,
                    gStyles.marginTop(8),
                  ]}>
                  Tambahkan rekening bank untuk bisa melakukan penawaran.
                </Text>
                <Button
                  title={'Tambah Rekening Bank'}
                  onPress={() => handleActionClick('field')}
                  type="full"
                  style={[
                    gStyles.marginTop(16),

                    gStyles.paddingVertical(10),
                    gStyles.paddingHorizontal(20),
                  ]}
                  left={<IconAdd fill="#fff" width={12} height={12} />}
                />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.wrapper,
              {
                backgroundColor: theme.backgroundColor,
              },
            ]}>
            {bankList &&
              bankList.map((dt, i) => (
                <View key={i} style={styles.rekeningList.container}>
                  <View style={styles.rekeningList.wrapper}>
                    <View style={styles.rekeningList.header}>
                      <View style={{width: 63, height: 45, marginRight: 10}}>
                        <Image
                          source={{uri: dt.bank.bank_image}}
                          style={{
                            flex: 1,
                            resizeMode: 'contain',
                          }}
                        />
                      </View>

                      {/* {_renderBankImage(dt.bank_id)} */}
                      <View style={gStyles.marginLeft(8)}>
                        <Text style={gStyles.text(14, '400', theme.textColor)}>
                          {dt?.bank_account_name}
                        </Text>
                        <Text style={gStyles.text(14, '500', theme.textColor)}>
                          {dt?.bank_account_number}
                        </Text>
                      </View>
                    </View>
                    {asPopUp ? (
                      <RadioButtons
                        option={{option: dt.id}}
                        setOption={val => {
                          console.log({id: val}, dt);
                          asPopUp?.setSelectedBank({id: val}, dt);
                        }}
                        selected={asPopUp?.SelectedBank?.id || dt.is_default}
                        radioButtonBorderColor="#BEBFC2"
                        radioButtonSize={22}
                        selectedRadioButtonColor={'#fff'}
                        showOption={false}
                        selectedRadioButtonBorderColor={colors.primary}
                        optionTextStyling={{
                          fontSize: 14,
                          color: '#1E1E1F',
                          fontWeight: '600',
                        }}
                        type="row-reverse"
                        key={i}
                      />
                    ) : dt.is_default ? (
                      <Text
                        style={[
                          gStyles.text(12, '500', '#149617'),
                          styles.rekeningList.primary,
                        ]}>
                        Rekening Utama
                      </Text>
                    ) : null}
                  </View>
                  {!asPopUp && (
                    <View style={styles.rekeningList.button}>
                      {dt.is_default ? (
                        <Button
                          title="Rekening Utama"
                          isDisabled={dt.is_default}
                          type="full"
                          paddingVertical={8}
                          textStyle={[gStyles.text(12, '400', 'gray')]}
                          style={gStyles.flex(1)}
                        />
                      ) : (
                        <Button
                          title="Jadikan Rekening Utama"
                          onPress={() =>
                            handleActionClick('primary', dt, false)
                          }
                          isDisabled={dt.is_default}
                          type="outline"
                          paddingVertical={8}
                          style={gStyles.flex(1)}
                          textStyle={gStyles.text(
                            12,
                            '400',
                            theme.primaryBackgroundColor,
                          )}
                        />
                      )}
                      <TouchableOpacity
                        style={styles.rekeningList.buttonEdit}
                        onPress={() => handleActionClick('field', dt)}>
                        <IconEdit
                          fill={theme.textColor}
                          width={16}
                          height={16}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.rekeningList.buttonDelete,
                          {
                            backgroundColor: dt.is_default
                              ? colors.neutral
                              : '#F5F6F7',
                          },
                        ]}
                        onPress={() => handleActionClick('delete', dt, false)}
                        disabled={dt.is_default} //tidak bisa hapus jika Rekening Utama
                      >
                        <IconTrash
                          fill={dt.is_default ? 'gray' : theme.textColor}
                          width={16}
                          height={16}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
          </View>
        )}
      </ScrollView>
      {emptyBank ? null : (
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
              title={asPopUp ? 'Kirim Penawaran' : 'Tambah Rekening Bank'}
              isDisabled={isLoading}
              onPress={() =>
                asPopUp ? handleBuatPenawaran() : handleActionClick('field')
              }
              type="full"
            />
          </View>
        </>
      )}
      {alert && (
        <CustomAlert
          text={message}
          handleClose={() => dispatch(setAlert(false))}
          type={messageType}
          alertType={alertType}
        />
      )}
      {isBottomPanelShowed ? (
        <BottomPanelModal
          closePanel={() => {
            setModalPosition(0);
            setIsBottomPanelShowed(false);
          }}
          height={whichButton === 'field' ? '100%' : 'auto'}
          radius={12}
          withHeader={whichButton === 'field' ? true : false}
          clickOutsideToClosePanel
          showCloseBtn
          // position={modalPosition}
          title={
            clickedData === null ? 'Tambah Rekening Bank' : 'Ubah Rekening Bank'
          }
          content={
            whichButton === 'field' ? (
              <ModalAddRekeningBank
                handleSubmit={handleAddOrEdit}
                setModalPosition={setModalPosition}
                clickedData={clickedData}
              />
            ) : (
              <ModalDeleteRekeningBank
                handleSubmit={handleAddOrEdit}
                clickedData={clickedData}
                title={whichButton === 'field'}
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
              phoneNumber={userInfo.email}
              setOtpCode={v => handleSetOtp(v)}
              isLoading={isLoading}
              goBack={() => {
                setIsBottomPanelShowed(false);
                setIsSubmitted(false);
              }}
              resendOTP={resendOTP}
            />
          }
        />
      )}
    </View>
  );
};

export default RekeningBank;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
    elevation: 1,
  },
  wrapper: {
    padding: 16,
  },
  rekeningList: {
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
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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
      borderTopColor: '#E3E3E5',
      borderTopWidth: 1,
      marginTop: 12,
      paddingTop: 12,
    },
    buttonEdit: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      borderRadius: 4,
      backgroundColor: '#F5F6F7',
      marginLeft: 8,
    },
    buttonDelete: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      borderRadius: 4,
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
