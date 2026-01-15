import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
  BackHandler,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppBar,
  BottomPanelModal,
  Button,
  CustomAlert,
  LoadingAnimated,
  QRCodeComponent,
  _renderBankImage,
  statusList,
} from '../../../../components';
import {
  IconLeftArrow,
  IconLocation,
  RouteSquare,
  BankMandiri,
  IconChat,
  WarningHexagon,
  ErrorWarningFill,
  DocumentDownload,
  IconScanBarcode,
  IconWA,
  IconLoading,
  IconCouponInvert,
  IconSuccess,
} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import styles from '../styles';

import Detail from './component/detail';
import Komoditi from './component/komoditi';
import Pengiriman from './component/pengiriman';
import Surveyor from './component/Surveyor';
import Konfirmasi from './component/Konfirmasi';
import AturPengiriman from '../AturPengiriman';
import CatatanPopup from '../AturPengiriman/component/catatanPopup';
import PopPersiapanBarang from './component/popPersiapanBarang';
import {
  setAlert,
  setMessage,
  setMessageType,
  setSelectedKupon,
} from '../../../../services';
import API, {getErrorResponse} from '../../../../services/api';
import {
  convertDayToWeek,
  findMonthName,
  format_tanggal_indo,
} from '../../../../utils/helpers/date';
import {
  NumberFormatter,
  delimiterFormat,
} from '../../../../utils/helpers/number';
import RNFetchBlob from 'rn-fetch-blob';
import PermintaanSample from './component/PermintaanSample';
import SampleKomoditi from './component/SampleKomoditi';

const DetailTransaksi = ({route, navigation}) => {
  const layout = useWindowDimensions();
  const {theme, alert, message, messageType} = useSelector(
    reducer => reducer.global,
  );
  const dispatch = useDispatch();
  const [Status, setStatus] = useState(9);
  const [Refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [BottomPanelPopup, setBottomPanelPopup] = useState({
    show: false,
    data: null,
    title: '',
    type: '',
  });
  const [CatatanPengirimanShow, setCatatanPengirimanShow] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [DataOffer, setDataOffer] = useState(null);
  const [DataListKomoditi, setDataListKomoditi] = useState([]);
  const [DataWarehouse, setDataWarehouse] = useState(null);
  const [DataBank, setDataBank] = useState(null);
  const [DataLog, setDataLog] = useState(null);
  const [DataSurvey, setDataSurvey] = useState(null);
  const [DataPembayaran, setDataPembayaran] = useState(null);
  const [DataPayment, setDataPayment] = useState(null);
  const [TotalPembayaran, setTotalPembayaran] = useState(0);

  const [DataShipping, setDataShipping] = useState(null);
  const [DataCoupon, setDataCoupon] = useState(null);
  const [SummaryShipping, setSummaryShipping] = useState(null);
  const [Toleransi, setToleransi] = useState(null);
  const [FinishedShipping, setFinishedShipping] = useState(false);
  const [RequestSample, setRequestSample] = useState(false);
  const [RequestSampleHistory, setRequestSampleHistory] = useState(false);

  useEffect(() => {
    let offerNumber = route?.params?.offer_number;
    let offerID = route?.params?.content_id ?? route?.params?.offer_id;
    // console.log('========== route?.params', route?.params?.id);
    console.log('offerID', offerID);
    if (offerNumber) {
      getDetailOffer(offerNumber);
    } else if (offerID) {
      getDetailOffer('', offerID);
    } else {
      Alert.alert('', 'Nomor penawaran tidak ditemukan');
      setIsLoading(false);
    }
  }, [Refresh]);

  // list_komoditi.map shipped_sample_quantity
  // offer.sample_notes // jika status di tolak
  // log_status_offer.status = Request Sample // pembeda ada request sample atau tidak

  const getDetailOffer = async (offerNumber, id = false) => {
    setIsLoading(true);
    const url = id
      ? 'farmer/offer/detail/id/' + id
      : 'farmer/offer/detail/' + offerNumber;
    console.log('url getDetailOffer', url);

    return await API.get(url)
      .then(res => {
        console.log('API res getDetailOffer', res);
        const dataOffer = res.data.offer;
        if (res?.meta?.http_status === 200) {
          const offer = {
            ...res.data.offer,
            total_penawaran: res.data.total_penawaran,
            total_harga_setujui: res.data.total_harga_setujui,
            total_akhir: res.data.total_akhir,
          };
          setDataOffer(offer); //
          // console.log('res.data.list_commoditie', res.data.list_commoditie);

          setDataListKomoditi(res.data.list_commoditie);
          setDataWarehouse(res.data.warehouse);
          setDataBank(res.data.bank);
          setDataLog(res.data.log_status_offer);
          setDataSurvey(res.data.surveyor);
          setDataCoupon(res.data.coupon);

          const mappingBank = {
            bank: dataOffer?.bank,
            farmer_bank_name: dataOffer.farmer_bank_name,
            farmer_bank_account_number: dataOffer.farmer_bank_account_number,
            farmer_bank_account_name: dataOffer.farmer_bank_account_name,
          };
          setDataPayment(mappingBank);
          // setDataPayment(res.data.bank_account);
          // console.log('Toleransi', res.data.message_toleransi);
          setToleransi(res.data.message_toleransi);
          if (res.data.data_pengiriman) {
            setDataShipping(res.data.data_pengiriman.list_pengiriman);
            setSummaryShipping(res.data.data_pengiriman.summary_pengiriman);
            console.log('summary', res.data.data_pengiriman.summary_pengiriman);
            setFinishedShipping(res.data.data_pengiriman.finish_quantity_send);
            // loadShippingData(offer.id);
          }

          // if (res.data.informasi_pembayaran) {
          //   let data = res.data.informasi_pembayaran;
          //   let total = 0;
          //   data.map(dt => (total = total + dt.price));
          //   // console.log('total', total);
          //   setDataPembayaran(data);
          //   setTotalPembayaran(total);
          //   //total akan diterima itu total_akhir juga
          //   // total tiap komoditi di atasnya itu pake ngelooping final calculation -> total_price
          // }
          if (res.data.final_calculation) {
            let data = res.data.final_calculation;
            let total = 0;
            // console.log('totalPembayaran', data);
            data.map(dt => (total = total + dt.total_price));
            // console.log('total', total);
            setDataPembayaran(data);
            setTotalPembayaran(total);
            //total akan diterima itu total_akhir juga
            // total tiap komoditi di atasnya itu pake ngelooping final calculation -> total_price
          }

          const findStatus = statusList.find(
            status => status.status === offer.status,
          );
          // console.log('findStatus', findStatus);
          if (findStatus) {
            setStatus(findStatus.id);
          }
          let findRequestSampleHistory = res?.data?.log_status_offer.find(
            log => log.status === 'Request Sample',
          );
          if (findRequestSampleHistory) {
            if (res?.data?.log_status_offer[0].status === 'Request Sample') {
              setRequestSample(true);
            } else {
              setRequestSampleHistory(res?.data?.log_status_offer);
              setRequestSample(false);
            }
          } else {
            setRequestSampleHistory(false);
          }
          setIsLoading(false);
          return true;
        } else {
          _handleAlertMessage(res);
          setIsLoading(false);
          return false;
        }
      })
      .catch(err => {
        setIsLoading(false);
        _handleAlertMessage(err);
        return false;
      });
  };

  const loadShippingData = async () => {
    setIsLoadingShipping(true);
    await API.get('/farmer/offer/pengiriman/72')
      .then(res => {
        console.log('res loadShippingData', res);
        if (res?.meta?.http_status === 200) {
          setDataShipping(res.data.offer_commoditie_shipping);
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => console.log(err));
    setIsLoadingShipping(false);
  };
  // ==============================================================

  const handleRefresh = () => {
    setIsLoading(true);
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
      setIsLoading(false);
    }, 500);
  };

  function _handleAlertMessage(res, type = 'error', msg = null) {
    console.log('_handleAlertMessage', type, res?.message, msg);
    let errMessage = '';
    if (type === 'error') {
      errMessage = msg
        ? msg
        : res?.response?.data?.errors
        ? getErrorResponse(res?.response?.data?.errors)[0]
        : res.message;
      console.log('errMessage', errMessage);
      dispatch(setMessage(errMessage));
    } else {
      errMessage = msg ? msg : res?.message;
      dispatch(setMessage(errMessage));
    }
    dispatch(setMessageType(type));
    dispatch(setAlert(true));
    return errMessage;
    // _handleCleanPop();
  }

  // ==============================================================
  //

  const handleDownloadDocument = async () => {
    const url = DataOffer.payment_attachment;
    console.log('url', url);
    if (!url || url === '') {
      Alert.alert('', 'Document Not Found');
      return;
    }
    setIsLoadingDownload(true);
    let contentType = '';
    let fileType = '';
    let downloadLoc = '';
    await RNFetchBlob.fetch('GET', url)
      .then(async res => {
        // console.log('res RNFetchBlob', res);
        let status = res.info();
        // console.log('status', status);
        if (status?.headers) {
          contentType = status?.headers['Content-Type'];
          if (!contentType) {
            return;
          }
          fileType = contentType.split('/');

          console.log('contentType', contentType);
          console.log('fileType', fileType);
          let fileName = 'Bukti Pembayaran TALASI ' + DataOffer.offer_number;
          downloadLoc =
            RNFetchBlob.fs.dirs.DownloadDir +
            '/' +
            fileName +
            '.' +
            fileType[1];

          await RNFetchBlob.config({
            fileCache: true,
            appendExt: contentType,
            addAndroidDownloads: {
              useDownloadManager: true, // <-- this is the only thing required
              // Optional, override notification setting (default to true)
              notification: true,
              // Optional, but recommended since android DownloadManager will fail when
              // the url does not contains a file extension, by default the mime type will be text/plain
              path: downloadLoc,
              mime: contentType,
              title: fileName,
              description:
                'Bukti Bayar Penawaran ' +
                DataOffer.offer_number +
                ' TALASI Petani',
            },
          })
            .fetch('GET', url)
            .then(res => {
              _handleAlertMessage('', 'success', 'File berhasil tersimpan');
            });
        } else {
          _handleAlertMessage('', 'error', 'File gagal tersimpan');
        }
      })
      .catch((errorMessage, statusCode) => {
        Alert.alert('', errorMessage.message);
        _handleAlertMessage('', 'error', 'File gagal tersimpan');
        setIsLoadingDownload(false);
      });

    setIsLoadingDownload(false);
  };

  const ButtonShowQRCode = () => {
    return (
      <TouchableOpacity
        onPress={() => setShowQRCode(true)}
        style={styles.btnQRCode}>
        <IconScanBarcode
          fill="#2E3192"
          width={20}
          height={20}
          style={gStyles.marginRight(4)}
        />
        <Text style={gStyles.text(14, '500', '#2E3192')}>QR Code</Text>
      </TouchableOpacity>
    );
  };

  const handleBack = () => {
    navigation.navigate('TransactionScreen');
  };

  // useBackHandler(() => handleBack());

  return (
    <>
      <LoadingAnimated visible={isLoading} />
      <View style={{flex: 1, position: 'relative'}}>
        <AppBar
          appBarColor={theme.backgroundColor}
          navigation={navigation}
          headerTextColor={theme.textColor}
          title="Detail Penawaran"
          titleStyle={gStyles.marginLeft(30)}
          borderBottom
          borderBottomColor={theme.textColor}
          borderBottomHeight={1.5}
          align="space-between"
          globalBackButton={() => handleBack()}
          iconLeft={
            <IconLeftArrow width={20} height={20} fill={theme.textColor} />
          }
          rightContent={<ButtonShowQRCode />}
        />
        {!isLoading && DataOffer && (
          <>
            {Status === 8 && (
              <View
                style={[
                  styles.headerFixed,
                  {
                    backgroundColor: '#FFF6EB',
                  },
                ]}>
                <WarningHexagon />
                <Text
                  style={[
                    {paddingLeft: 5},
                    gStyles.text(14, '400', '#313447'),
                  ]}>
                  Siapkan barang sebelum{' '}
                  <Text style={gStyles.text(14, '600', '#313447')}>
                    {findMonthName(DataOffer?.shipping_month)} (Minggu Ke-
                    {DataOffer?.shipping_week})
                  </Text>
                </Text>
              </View>
            )}
            {Status === 8 && DataOffer?.delay_shipping_tolerance > 0 && (
              <View
                style={[
                  styles.headerFixed,
                  {
                    backgroundColor: '#f8d7da',
                  },
                ]}>
                <WarningHexagon />
                <Text
                  style={[
                    {paddingLeft: 5},
                    gStyles.text(14, '400', '#313447'),
                  ]}>
                  Toleransi keterlambatan pengiriman sampai tanggal{' '}
                  <Text style={gStyles.text(14, '600', '#313447')}>
                    {format_tanggal_indo(new Date(Toleransi?.paling_lambat))}
                  </Text>
                </Text>
              </View>
            )}
            {Toleransi?.lewat > 0 && (
              <View
                style={[
                  styles.headerFixed,
                  {
                    backgroundColor: '#FFF6EB',
                    alignItems: 'flex-start',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  },
                ]}>
                <WarningHexagon />
                <Text
                  style={[
                    {paddingLeft: 8, lineHeight: 22},
                    gStyles.text(14, '400', '#313447'),
                  ]}>
                  Jadwal pengiriman telah lewat{' '}
                  <Text style={gStyles.text(14, '600', '#313447')}>
                    {convertDayToWeek(Toleransi.lewat)}{' '}
                    {convertDayToWeek(Toleransi.lewat, true)}
                  </Text>
                  , tapi Anda diberikan toleransi keterlambatan. Kirimkan barang
                  paling lambat{' '}
                  <Text style={gStyles.text(14, '600', '#313447')}>
                    {format_tanggal_indo(new Date(Toleransi.paling_lambat))}
                  </Text>
                  .
                </Text>
              </View>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={Refresh}
                  onRefresh={handleRefresh}
                />
              }
              style={{
                backgroundColor: '#F5F6F7',
              }}>
              <View style={[styles.cardNoBorder, styles.cardSpace]}>
                <Detail
                  DataOffer={DataOffer}
                  DataLog={DataLog}
                  Status={Status}
                />
              </View>
              {Status >= 10 &&
                (DataOffer?.pr_number !== ',' ||
                  DataOffer?.invoice_number !== '' ||
                  DataOffer?.payment_voucher_number !== '' ||
                  DataOffer?.payment_attachment !== '') && (
                  <View style={[styles.cardNoBorder, styles.cardSpace]}>
                    {DataOffer?.pr_number !== '' && (
                      <View style={[gStyles.row, {paddingVertical: 4}]}>
                        <Text
                          style={[
                            gStyles.text(14, '400', '#797B8A'),
                            gStyles.flex(1),
                          ]}>
                          No. PO
                        </Text>
                        <Text
                          style={[
                            gStyles.text(14, '400', '#313447'),
                            gStyles.flex(1),
                            {
                              textAlign: 'right',
                            },
                          ]}>
                          {DataOffer.pr_number.replace(',', '\n')}
                        </Text>
                      </View>
                    )}
                    {Status >= 11 && (
                      <>
                        {DataOffer?.invoice_number !== '' && (
                          <View style={[gStyles.row, {paddingVertical: 4}]}>
                            <Text style={gStyles.text(14, '400', '#797B8A')}>
                              No. Invoice
                            </Text>
                            <Text style={gStyles.text(14, '400', '#313447')}>
                              {DataOffer.invoice_number}
                            </Text>
                          </View>
                        )}
                        {DataOffer?.payment_voucher_number !== '' && (
                          <View style={[gStyles.row, {paddingVertical: 4}]}>
                            <Text style={gStyles.text(14, '400', '#797B8A')}>
                              Payment Voucher
                            </Text>
                            <Text style={gStyles.text(14, '400', '#313447')}>
                              {DataOffer.payment_voucher_number}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                    {Status === 12 && DataOffer?.payment_attachment !== '' && (
                      <Button
                        style={{
                          marginTop: 12,
                          backgroundColor: isLoadingDownload
                            ? colors.neutral
                            : '#fff',
                        }}
                        isDisabled={isLoadingDownload}
                        onPress={() => handleDownloadDocument()}
                        title={
                          <View
                            style={[
                              gStyles.row_center3,
                              {
                                // opacity: isLoadingDownload ? 0.5 : 1
                              },
                            ]}>
                            {isLoadingDownload ? (
                              <Image
                                style={{width: 20, height: 20}}
                                source={IconLoading}
                              />
                            ) : (
                              <DocumentDownload />
                            )}
                            <Text
                              style={[
                                {lineHeight: 20, marginLeft: 8},
                                gStyles.text(
                                  14,
                                  '500',
                                  isLoadingDownload ? 'gray' : '#2E3192',
                                ),
                              ]}>
                              Unduh Bukti Bayar
                            </Text>
                          </View>
                        }
                      />
                    )}
                  </View>
                )}

              {RequestSampleHistory && (
                <SampleKomoditi
                  data={DataListKomoditi}
                  offer={DataOffer}
                  log={RequestSampleHistory}
                />
              )}

              {DataSurvey && (
                <View style={[styles.cardNoBorder, styles.cardSpace]}>
                  <Surveyor DataSurvey={DataSurvey} />
                </View>
              )}

              {/* Komoditi */}
              <View style={[styles.cardNoBorder, styles.cardSpace]}>
                <Text style={gStyles.text(16, '700', '#313447')}>
                  Daftar Komoditi
                </Text>

                {/* Daftar Komoditi */}
                {DataListKomoditi?.map((komoditi, i) => (
                  <Komoditi
                    status={Status}
                    komoditi={komoditi}
                    key={i}
                    index={i}
                    theme={theme}
                  />
                ))}
                {/* <Komoditi status={Status} note={true} /> */}
              </View>

              {Status !== 5 && (
                <View style={[styles.cardNoBorder, styles.cardSpace]}>
                  <Text style={gStyles.text(16, '700', '#313447')}>
                    Informasi Pengiriman
                  </Text>
                  <Pengiriman
                    status={Status}
                    DataOffer={DataOffer}
                    DataShipping={DataShipping}
                    Toleransi={Toleransi}
                    isLoadingShipping={isLoadingShipping}
                    showCatatan={setCatatanPengirimanShow}
                  />
                </View>
              )}
              {DataCoupon && (
                <View style={[styles.cardNoBorder, styles.cardSpace]}>
                  <Text style={gStyles.text(16, '700', '#313447')}>Kupon</Text>
                  <View style={[gStyles.row_center2, {marginVertical: 10}]}>
                    <View style={gStyles.row_center2}>
                      <View style={styles.couponRound}>
                        <IconCouponInvert width={17} height={17} />
                      </View>
                      <Text style={gStyles.text(12, '400', '#313447')}>
                        {DataCoupon.coupon_code}
                      </Text>
                    </View>
                    {/* <IconCloseCircle width={20} height={20} /> */}
                  </View>
                </View>
              )}
              {DataWarehouse && (
                <View style={[styles.cardNoBorder, styles.cardSpace]}>
                  <Text style={gStyles.text(16, '700', '#313447')}>
                    Lokasi Warehouse Hub
                  </Text>
                  <View style={[gStyles.col, {marginVertical: 10}]}>
                    <Text style={gStyles.text(14, '500', '#313447')}>
                      {DataWarehouse.name}
                    </Text>
                    <View style={gStyles.row_center3}>
                      <View style={{paddingVertical: 5, paddingRight: 5}}>
                        <RouteSquare width={17} height={17} />
                      </View>
                      <Text style={gStyles.text(14, '400', '#797B8A')}>
                        {DataWarehouse.distance} km
                      </Text>
                    </View>
                    <View style={[gStyles.row_center3, gStyles.pRight(16)]}>
                      <View style={{paddingRight: 5}}>
                        <IconLocation width={17} height={17} />
                      </View>
                      <Text style={gStyles.text(14, '400', '#797B8A')}>
                        {DataWarehouse?.address_full?.address}{' '}
                        {DataWarehouse?.address_full?.village_name},{' '}
                        {DataWarehouse?.address_full?.district_name},{' '}
                        {DataWarehouse?.address_full?.city_name},{' '}
                        {DataWarehouse?.address_full?.province_name}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={[styles.cardNoBorder, styles.cardSpace]}>
                {DataPayment && (
                  <>
                    <Text
                      style={[
                        gStyles.text(16, '700', '#313447'),
                        {paddingVertical: 5},
                      ]}>
                      Informasi Pembayaran
                    </Text>
                    <Text style={gStyles.text(14, '500', '#797B8A')}>
                      Rekening Penerima
                    </Text>
                    <View style={[gStyles.row_2, styles.bankCard]}>
                      <View style={{width: 63, height: 45, marginRight: 10}}>
                        <Image
                          source={{uri: DataPayment?.bank?.bank_image}}
                          style={{
                            flex: 1,
                            resizeMode: 'contain',
                          }}
                        />
                      </View>

                      <View style={[styles.row, {marginLeft: 8}]}>
                        <Text style={gStyles.text(14, '500', '#313447')}>
                          {DataPayment?.farmer_bank_name}
                        </Text>
                        <Text style={gStyles.text(12, '400', '#797B8A')}>
                          {DataPayment?.farmer_bank_account_number} -{' '}
                          {DataPayment?.farmer_bank_account_name}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
                {Status >= 11 && DataPembayaran && (
                  <>
                    {DataPembayaran?.map(bayar => (
                      <View style={[gStyles.row, {paddingVertical: 4}]}>
                        <Text style={gStyles.text(12, '400', '#797B8A')}>
                          {bayar.commoditie_name}
                        </Text>
                        <Text style={gStyles.text(12, '400', '#313447')}>
                          Rp. {delimiterFormat(bayar.total_price)}
                        </Text>
                      </View>
                    ))}
                    {/* TOTAL */}
                    <View
                      style={[
                        gStyles.row,
                        {
                          marginTop: 8,
                          paddingVertical: 8,
                          borderTopWidth: 1,
                          borderBottomColor: '#797B8A',
                          borderStyle: 'dashed',
                        },
                      ]}>
                      <Text style={gStyles.text(14, '700', '#313447')}>
                        Total Akan Diterima
                      </Text>
                      <Text style={gStyles.text(14, '700', '#313447')}>
                        Rp {delimiterFormat(TotalPembayaran)}
                      </Text>
                    </View>
                  </>
                )}
              </View>
              {/* {Status !== 12 && (
                <View
                  style={[
                    styles.cardNoBorder,
                    styles.cardSpace,
                    {marginBottom: 0, paddingBottom: Status < 4 ? 0 : 20},
                  ]}>
                  <Button
                    onPress={() =>
                      navigation.navigate('RoomChat', {
                        type: 'chat',
                      })
                    }
                    title={
                      <View style={gStyles.row_center3}>
                        <IconChat />
                        <Text
                          style={[
                            {lineHeight: 20, marginLeft: 8},
                            gStyles.text(14, '500', '#2E3192'),
                          ]}>
                          Hubungi Admin Talasi
                        </Text>
                      </View>
                    }
                  />
                </View>
              )} */}
              {Status < 4 && (
                <Konfirmasi
                  handleRefresh={handleRefresh}
                  // data={route.params}
                  Status={Status}
                  data={{...DataOffer, offer_commodities: DataListKomoditi}}
                  setIsLoading={setIsLoading}
                  _handleAlertMessage={_handleAlertMessage}
                />
              )}
            </ScrollView>

            {Status === 4 && (
              <Konfirmasi
                handleRefresh={handleRefresh}
                // data={route.params}
                Status={Status}
                data={{...DataOffer, offer_commodities: DataListKomoditi}}
                setIsLoading={setIsLoading}
                _handleAlertMessage={_handleAlertMessage}
              />
            )}
            {RequestSample && (
              <PermintaanSample
                Status={Status}
                getDetailOffer={getDetailOffer}
                data={{...DataOffer, offer_commodities: DataListKomoditi}}
                setIsLoading={setIsLoading}
                _handleAlertMessage={_handleAlertMessage}
              />
            )}
            {alert && (
              <View style={{}}>
                <CustomAlert
                  text={message}
                  handleClose={() => dispatch(setAlert(false))}
                  type={messageType}
                  alertType="bottom"
                />
              </View>
            )}

            {Status === 5 && (
              <View
                style={[
                  styles.cardNoBorder,
                  gStyles.row_center,
                  {marginBottom: 0},
                ]}>
                <Button
                  title="Ajukan Ulang Penawaran"
                  type="full"
                  style={gStyles.btnSecondary}
                  textStyle={gStyles.btnSecondaryText}
                  onPress={() => {
                    setIsLoading(true);
                    dispatch(setSelectedKupon(null));
                    setTimeout(() => {
                      navigation.navigate('BuatPenawaran', {
                        DataOffer,
                        DataListKomoditi,
                        DataBank,
                        reApply: true,
                      });
                    }, 200);
                  }}
                />
              </View>
            )}

            {Status === 7 && (
              <View
                style={[styles.cardNoBorder, gStyles.col, {marginBottom: 0}]}>
                <Button
                  title="Siapkan Barang"
                  type="full"
                  textStyle={gStyles.btnSecondaryText}
                  onPress={() =>
                    setBottomPanelPopup({
                      show: true,
                      data: {},
                      title: 'Persiapan Barang',
                    })
                  }
                />
              </View>
            )}

            {(Status === 8 || Status === 9) && (
              <View
                style={[styles.cardNoBorder, gStyles.col, {marginBottom: 0}]}>
                {Status === 9 && SummaryShipping && (
                  <View style={{paddingBottom: 5}}>
                    {SummaryShipping?.map(sum => (
                      <View style={gStyles.row_center3}>
                        {sum.quantity_diff > 0 ? (
                          <ErrorWarningFill width={15} height={15} />
                        ) : (
                          <IconSuccess
                            width={15}
                            height={15}
                            fill={'#2AB95E'}
                          />
                        )}
                        <Text
                          style={[
                            gStyles.text(12, '400', '#313447'),
                            {paddingLeft: 5},
                          ]}>
                          {sum.commoditie_name}
                          {sum.variant_name !== ''
                            ? ` (${sum.variant_name})`
                            : null}{' '}
                          terkirim{' '}
                          <Text style={gStyles.weight('600')}>
                            {delimiterFormat(sum.shipped_quantity)}
                            {sum.unit}
                          </Text>
                          {' dari '}
                          <Text style={gStyles.weight('600')}>
                            {delimiterFormat(sum.quantity_offer)}
                            {sum.unit}
                          </Text>
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {!FinishedShipping && (
                  <Button
                    title={Status === 8 ? 'Atur Pengiriman' : 'Kirim Lagi'}
                    type="full"
                    textStyle={gStyles.btnSecondaryText}
                    onPress={() =>
                      setBottomPanelPopup({
                        show: true,
                        data: {},
                        title: 'Atur Pengiriman',
                        type: 'full',
                      })
                    }
                  />
                )}
              </View>
            )}
          </>
        )}
      </View>

      {BottomPanelPopup.show && (
        <BottomPanelModal
          radius={12}
          clickOutsideToClosePanel
          height={BottomPanelPopup.type === 'full' ? '100%' : 'auto'}
          withHeader
          showCloseBtn
          title={BottomPanelPopup.title}
          closePanel={() => setBottomPanelPopup({show: false})}
          content={
            Status === 7 ? (
              <PopPersiapanBarang
                setBottomPanelPopup={setBottomPanelPopup}
                handleRefresh={handleRefresh}
                _handleAlertMessage={_handleAlertMessage}
                data={DataOffer}
                setIsLoading={setIsLoading}
              />
            ) : Status === 8 || Status === 9 ? (
              <AturPengiriman
                closePanel={() => setBottomPanelPopup(false)}
                showCatatan={setCatatanPengirimanShow}
                status={Status}
                DataOffer={DataOffer}
                DataListKomoditi={DataListKomoditi}
                DataShipping={DataShipping}
                handleRefresh={handleRefresh}
                setIsLoading={setIsLoading}
                _handleAlertMessage={_handleAlertMessage}
              />
            ) : (
              ''
            )
          }
        />
      )}

      {CatatanPengirimanShow && (
        <BottomPanelModal
          height="auto"
          animate
          radius={12}
          clickOutsideToClosePanel
          withHeader
          showCloseBtn
          title={`Catatan Pengiriman ${CatatanPengirimanShow?.shipping_number}`}
          closePanel={() => setCatatanPengirimanShow(false)}
          content={<CatatanPopup data={CatatanPengirimanShow} />}
        />
      )}
      {showQRCode && (
        <BottomPanelModal
          height="auto"
          animate
          radius={12}
          clickOutsideToClosePanel
          withHeader
          showCloseBtn
          title={'QR Code'}
          closePanel={() => setShowQRCode(false)}
          content={
            <QRCodeComponent
              value={JSON.stringify({
                id: DataOffer?.id,
                status: DataOffer?.status,
                offer_number: DataOffer?.offer_number,
              })}
              message={`Penawaran No: ${DataOffer?.offer_number}`}
            />
          }
        />
      )}
    </>
  );
};

export default DetailTransaksi;
