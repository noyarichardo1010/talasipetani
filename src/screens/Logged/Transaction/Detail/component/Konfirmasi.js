import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BottomPanelModal,
  Button,
  RadioButtons,
} from '../../../../../components';
import {colors, gStyles} from '../../../../../utils/styles';
import styles from '../../styles';
import API from '../../../../../services/api';
// import {_handleAlertMessage} from '../../../../../services';
import {useDispatch} from 'react-redux';

const OptionPenolakan = [
  {
    option: 'Harga penawaran terlalu rendah',
  },
  {
    option: 'Harga penawaran tidak sesuai',
  },
  {
    option: 'Alasan lainnya',
  },
];

const dummyReason = [
  {
    id: 2,
    reject_reason: 'T-001',
    reason: 'Harga Terlalu Rendah',
    option: 'Harga Terlalu Rendah',
  },
  {
    id: 3,
    reject_reason: 'Test',
    reason: 'Harga Tidak Oke',
    option: 'Harga Tidak Oke',
  },
];

const Konfirmasi = ({handleRefresh, data, _handleAlertMessage, Status}) => {
  const [isBottomPanelTolak, setIsBottomPanelTolak] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBottomPanelTolakSurvey, setIsBottomPanelTolakSurvey] =
    useState(false);
  const [AlasanTolak, setAlasanTolak] = useState('');
  const [DeskripsiAlasanTolak, setDeskripsiAlasanTolak] = useState('');
  const [isBottomPanelSetuju, setIsBottomPanelSetuju] = useState(false);
  const [KomoditiListId, setKomoditiListId] = useState('');
  const [RejectReasonList, setRejectReasonList] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('data Konfirmasi', data);
    if (data?.offer_commodities?.length > 0) {
      let ids = '';
      data.offer_commodities.map(komoditi => {
        if (ids === '') {
          ids = komoditi.commoditie_id;
        } else {
          ids = ids + ',' + komoditi.commoditie_id;
        }
      });
      console.log('ids', ids);
      setKomoditiListId(ids);
    }
  }, [data]);

  const handleTolak = (show = false) => {
    if (isLoading) {
      return;
    }
    if (show) {
      setIsBottomPanelTolak(true);
      setIsBottomPanelSetuju(false);
    } else {
      setIsBottomPanelTolak(false);
    }
  };

  const handleTolakSurvey = async (show = false) => {
    if (isLoading) {
      return;
    }
    console.log('handleTolakSurvey');
    if (show) {
      setIsLoading(true);
      await API.get(`reject-reason?commoditie=${KomoditiListId}`)
        .then(res => {
          console.log('res', res);

          if (res?.meta?.http_status === 200) {
            if (res.data.length > 0) {
              let data = res.data.map(dt => ({...dt, option: dt?.reason}));
              console.log('res handleTolakSurvey data', data);

              setRejectReasonList(data);
              setIsBottomPanelTolakSurvey(true);
              setTimeout(() => {
                setIsBottomPanelTolak(false);
              }, 200);
            }
          }

          setIsLoading(false);
        })
        .catch(err => {
          console.log('err', err);
          setIsLoading(false);
        });
    } else {
      console.log('close');
      setIsBottomPanelTolak(false);
      setIsBottomPanelTolakSurvey(false);
    }
  };

  const handleSubmitTolakSurvey = async () => {
    if (isLoading) {
      return;
    }
    console.log('RejecteasonList', RejectReasonList);
    if (AlasanTolak !== '' || DeskripsiAlasanTolak !== '') {
      setIsLoading(true);
      const id = RejectReasonList.find(dt => dt.reason === AlasanTolak);
      console.log('id', id);

      const formData = {
        reject_reason: DeskripsiAlasanTolak,
        offer_number: data.offer_number,
        cancel_reason_id: id ? id?.id : 0,
      };
      console.log('formData', formData);
      // setIsLoading(false);
      // return;
      await API.post('farmer/offer/reject', formData, true)
        .then(res => {
          console.log('res handleSubmitTolakSurvey === ', res);
          if (res?.meta?.http_status === 200) {
            // Alert.alert('');
            handleRefresh();
            _handleAlertMessage(res, 'success', res.message);
          } else {
            _handleAlertMessage(res, 'failed', res.message);
            setIsBottomPanelTolak(false);
            setIsBottomPanelTolakSurvey(false);
          }
        })
        .catch(err => {
          _handleAlertMessage(err);
        });
      setIsLoading(false);
    }
  };

  const handleSetuju = async (show = false) => {
    if (isLoading) {
      return;
    }
    if (show) {
      setIsBottomPanelSetuju(true);
      setIsBottomPanelTolak(false);
    } else {
      setIsBottomPanelSetuju(false);
    }
  };

  const handleSubmitSetujuiHarga = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    await API.get(`/farmer/offer/accept/${data.id}`)
      .then(res => {
        console.log('res handleSetuju === ', data.id, res.message);
        if (res?.meta?.http_status === 200) {
          // Alert.alert('');
          handleRefresh();
          _handleAlertMessage(res, 'success', res.message);
        } else {
          _handleAlertMessage(res, 'error', res.message);
        }
      })
      .catch(err => {
        console.log('err submit', err);
        _handleAlertMessage(err);
      });
    setIsLoading(false);
    setIsBottomPanelSetuju(false);
  };

  return (
    <>
      <View
        style={[styles.cardNoBorder, gStyles.row_center, {marginBottom: 0}]}>
        {Status < 4 ? (
          <TouchableOpacity
            style={[
              styles.btnCancel,
              {backgroundColor: '#F5F6F7', width: '100%'},
            ]}
            onPress={handleTolak}>
            <Text style={[gStyles.text(14, '500', '#313447'), {margin: 0}]}>
              Batalkan
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <Button
              title="Tolak Harga"
              type="outline"
              style={gStyles.btnSecondaryOutline}
              textStyle={gStyles.btnSecondaryOutlineText}
              onPress={handleTolak}
            />
            <Button
              title="Setujui"
              type="full"
              style={gStyles.btnSecondary}
              textStyle={gStyles.btnSecondaryText}
              onPress={handleSetuju}
            />
          </>
        )}
      </View>

      {isBottomPanelTolak ? (
        <BottomPanelModal
          height="auto"
          animate
          clickOutsideToClosePanel
          closePanel={handleTolak}
          radius={12}
          content={
            <View
              style={[styles.cardNoBorder, {padding: 16, marginBottom: 20}]}>
              <Text style={gStyles.text(16, '700', '#313447')}>
                {Status < 4 ? 'Batalkan' : 'Tolak Harga ?'}
              </Text>
              <Text
                style={[
                  gStyles.text(14, '400', '#797B8A'),
                  {paddingVertical: 12},
                ]}>
                {Status < 4
                  ? 'Anda bisa melakukan penawaran ulang nantinya'
                  : 'Menolak Harga akan membatalkan transaksi'}
              </Text>
              <View style={[gStyles.row_center, {marginBottom: 0}]}>
                <Button
                  title="Tidak"
                  type="outline"
                  style={gStyles.btnSecondaryOutline}
                  textStyle={gStyles.btnSecondaryOutlineText}
                  onPress={() => handleTolak()}
                />
                <Button
                  title="Iya"
                  type="full"
                  style={gStyles.btnSecondary}
                  textStyle={gStyles.btnSecondaryText}
                  onPress={() => handleTolakSurvey(true)}
                />
              </View>
            </View>
          }
        />
      ) : null}

      {isBottomPanelSetuju ? (
        <BottomPanelModal
          height="auto"
          radius={12}
          clickOutsideToClosePanel
          animate
          closePanel={handleSetuju}
          content={
            <View
              style={[styles.cardNoBorder, {padding: 16, marginBottom: 20}]}>
              <Text style={gStyles.text(16, '700', '#313447')}>Setujui ?</Text>
              <Text
                style={[
                  gStyles.text(14, '400', '#797B8A'),
                  {paddingVertical: 12},
                ]}>
                Anda akan menyetujui harga yang diberikan oleh Talasi.
              </Text>
              <View style={[gStyles.row_center, {marginBottom: 0}]}>
                <Button
                  title="Tidak"
                  type="outline"
                  style={gStyles.btnSecondaryOutline}
                  textStyle={gStyles.btnSecondaryOutlineText}
                  onPress={() => handleSetuju()}
                />
                <Button
                  title="Iya"
                  type="full"
                  style={gStyles.btnSecondary}
                  textStyle={gStyles.btnSecondaryText}
                  onPress={() => handleSubmitSetujuiHarga()}
                />
              </View>
            </View>
          }
        />
      ) : null}

      {isBottomPanelTolakSurvey ? (
        <BottomPanelModal
          height="auto"
          animate
          clickOutsideToClosePanel
          closePanel={handleTolakSurvey}
          radius={12}
          withHeader
          title={'Alasan Penolakan / Pembatalan'}
          showCloseBtn
          titleStyle={gStyles.text(16, '700', '#313447')}
          content={
            <View
              style={[styles.cardNoBorder, {marginBottom: 20, paddingTop: 0}]}>
              {RejectReasonList.map((option, index) => (
                <View key={index} style={[]}>
                  <RadioButtons
                    styleTouchButton={[
                      gStyles.row_center3,
                      {
                        width: '100%',
                        borderWidth: 1,
                        paddingHorizontal: 5,
                        marginVertical: 5,
                        borderRadius: 5,
                        borderColor:
                          AlasanTolak === option.option ? '#2E3192' : '#CBCCD1',
                      },
                    ]}
                    option={option}
                    setOption={val => setAlasanTolak(val)}
                    selected={AlasanTolak}
                    radioButtonBorderColor="#BEBFC2"
                    selectedRadioButtonColor="#fff"
                    selectedRadioButtonBorderColor="#2E3192"
                    radioButtonSize={22}
                    key={option}
                    optionTextStyling={gStyles.text(14, '400', '#313447')}
                  />
                </View>
              ))}
              <View style={[gStyles.formInput]}>
                <Text
                  style={[
                    gStyles.label('#6B6D7A', 13, '400'),
                    gStyles.weight('500'),
                    gStyles.marginBottom(4),
                    gStyles.marginTop(20),
                  ]}>
                  Deskripsi
                </Text>
                <View
                  style={[
                    gStyles.textareaWrapper(
                      156,
                      '#D1D5DC',
                      // messageLength >= maxMessageLength ? 'red' : '#D1D5DC',
                    ),
                  ]}>
                  <TextInput
                    placeholder="Tulis deskripsi Anda"
                    name="pesan"
                    placeholderTextColor={'#687083'}
                    autoCorrect={false}
                    onChangeText={value => setDeskripsiAlasanTolak(value)}
                    textAlignVertical="top"
                    multiline={true}
                    style={[gStyles.textarea(156), {color: 'black'}]}
                  />
                </View>
                {/* <Text
              style={[
                gStyles.text(12, '400', '#93959E'),
                gStyles.marginTop(4),
              ]}>
              {messageLength} / {maxMessageLength}
            </Text> */}
              </View>
              {/* <TouchableOpacity
                style={[gStyles.btnSecondary, {marginTop: 20}]}
                isDisabled={true}>
                <Text style={gStyles.btnSecondaryText}>Submit</Text>
              </TouchableOpacity> */}

              <Button
                title="Submit"
                type="full"
                isDisabled={
                  AlasanTolak !== '' || DeskripsiAlasanTolak !== ''
                    ? false
                    : true
                }
                style={[
                  gStyles.btnSecondary,
                  {
                    marginTop: 20,
                    backgroundColor:
                      AlasanTolak === '' ? colors.neutral : colors.primary,
                  },
                ]}
                textStyle={[
                  gStyles.btnSecondaryText,
                  {
                    color: AlasanTolak === '' ? colors.grey2 : colors.light,
                  },
                ]}
                onPress={() => handleSubmitTolakSurvey()}
              />
            </View>
          }
        />
      ) : null}
    </>
  );
};

export default Konfirmasi;
