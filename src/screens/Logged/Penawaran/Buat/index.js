import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// import {useBackHandler} from '@react-native-community/hooks';

import {
  AppBar,
  BottomPanelModal,
  Button,
  Container,
  CustomAlert,
  LoadingAnimated,
  Select,
  statusList,
} from '../../../../components';
import styles from '../styles';
import {useDispatch, useSelector} from 'react-redux';
import {IconLeftArrow} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import {
  dataBulanIndo,
  getWeekOfMonth,
  getWeekOfTheDay,
  listYearPengiriman,
} from '../../../../utils/helpers/date';
// import Detail from '../../Transaction/Detail/component/detail';
import Warehouse from './component/warehouse';
import WarehouseList from './component/warehouseList';
import Komoditi from './component/komoditi';
import KomoditiList from './component/komoditiList';
import CouponList from './component/couponList';
// import GantiBank from './component/gantiBank';
import RekeningBank from '../../Profile/RekeningBank';
import API, {getErrorResponse} from '../../../../services/api';
import {
  setAlert,
  setMessage,
  setMessageType,
  setSelectedKupon,
} from '../../../../services';
import {SET_WAREHOUSE_LIST} from '../../../../services/redux/action/list';
import AlertPopUp from './component/AlertPopup';
import Coupon from './component/coupon';
import Detail from '../../Transaction/Detail/component/detail';

const dummyWeeks = [
  {id: 1, value: 1, label: '1'},
  {id: 2, value: 2, label: '2'},
  {id: 3, value: 3, label: '3'},
  {id: 4, value: 4, label: '4'},
  {id: 5, value: 5, label: '5'},
  {id: 6, value: 6, label: '6'},
  {id: 7, value: 7, label: '7'},
];

const BuatPenawaran = ({route, navigation}) => {
  const {theme, alert, message, messageType} = useSelector(
    reducer => reducer.global,
  );
  const {SelectedKupon} = useSelector(reducer => reducer.penawaran);

  const {bankPrimary} = useSelector(reducer => reducer.profile);
  const dispatch = useDispatch();
  const [isDraft, setIsDraft] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [WarehouseListData, setWarehouseListData] = useState([]);
  const [SelectedWarehouse, setSelectedWarehouse] = useState(null);
  const [oldKomoditi, setOldKomoditi] = useState([]);

  const [KommoditiListData, setKommoditiListData] = useState([]);
  const [SelectedKomoditi, setSelectedKomoditi] = useState([]);
  const [ReCheckKomoditi, setReCheckKomoditi] = useState(false);
  const [IsDone, setIsDone] = useState(false);

  const [KuponListData, setKuponListData] = useState([]);
  function getUniqueValues(array1, array2) {
    // Combine both arrays into a single array
    const combinedArray = array1.concat(array2);

    // Use filter to get only the unique values
    const uniqueArray = combinedArray.filter((item, index, self) => {
      // Use the 'some' method to check if the item appears later in the array
      return (
        index ===
        self.findIndex(
          t =>
            t.grade_name === item.grade_name &&
            t.grade_id === item.grade_id &&
            t.commoditie_id === item.commoditie_id &&
            t.commoditie_variant_id === item.commoditie_variant_id, // Replace property1, property2, etc. with your actual object properties
        )
      );
    });

    return uniqueArray;
  }
  const [newKomoditi, setNewKomoditi] = useState([]);

  // const [SelectedKupon, setSelectedKupon] = useState(null); diganti pake redux
  useEffect(() => {
    // console.log('SelectedKupon', SelectedKupon);
    if (SelectedKupon) {
      //menambahkan property has_special_price
      let komoditiWithKupon = [];
      if (SelectedKomoditi?.length > 0) {
        SelectedKomoditi?.map((kmdt, i) => {
          //mapping komoditi yang ditambahkan
          // console.log('kmdt', kmdt);

          SelectedKupon?.commoditie_detail?.map((komoditiKupon, idx) => {
            //mapping komoditi yang ada di kupon harga khusus yang dipake
            if (komoditiKupon?.commoditie_id === kmdt?.commoditie_id) {
              // console.log('komoditiKupon', komoditiKupon);
              komoditiKupon?.variant?.map(vrnt =>
                vrnt?.data?.map(special_price => {
                  if (
                    special_price?.grade_name === kmdt?.grade_name &&
                    special_price?.grade_id === kmdt?.grade_id &&
                    komoditiKupon?.commoditie_id === kmdt?.commoditie_id &&
                    kmdt?.commoditie_variant_id === vrnt?.commoditie_variant_id
                  ) {
                    // console.log('special_price', special_price);
                    // komoditiWithKupon = {
                    //   ...kmdt,
                    //   has_special_price: true,
                    //   special_price: special_price?.price,
                    // };
                    komoditiWithKupon.push({
                      ...kmdt,
                      has_special_price: true,
                      special_price: special_price?.price,
                    });
                  }
                }),
              );
            }
          });
        });
        // Membuat array baru SelectedKomoditi dengan properti special_price
        const result = SelectedKomoditi.map(item => {
          const matchingKuponItem = komoditiWithKupon.find(
            kuponItem =>
              item.commoditie_id === kuponItem.commoditie_id &&
              item.commoditie_variant_id === kuponItem.commoditie_variant_id &&
              item.grade_id === kuponItem.grade_id,
          );

          // Jika ada kecocokan, tambahkan properti special_price
          if (matchingKuponItem) {
            return {
              ...item,
              has_special_price: true,
              special_price: matchingKuponItem.special_price,
            };
          }

          // Jika tidak ada kecocokan, kembalikan item tanpa perubahan
          return item;
        });

        // console.log('komoditiWithKupon', komoditiWithKupon);
        // const result = SelectedKomoditi.map(item =>
        //   komoditiWithKupon?.grade_name === item.grade_name &&
        //   komoditiWithKupon?.grade_id === item.grade_id &&
        //   komoditiWithKupon?.commoditie_id === item.commoditie_id &&
        //   komoditiWithKupon?.commoditie_variant_id === item.commoditie_variant_id
        //     ? komoditiWithKupon
        //     : item,
        // );

        // console.log('result', result);

        setNewKomoditi(result);
      }
    } else {
      setNewKomoditi([]);
    }
  }, [SelectedKupon, SelectedKomoditi]);

  const [SelectedBank, setSelectedBank] = useState(bankPrimary);

  const [reData, setReData] = useState(route.params);

  const [WeekOfMonth, setWeekOfMonth] = useState([]);
  const [JadwalPengiriman, setJadwalPengiriman] = useState({
    bulan: new Date().getMonth() + 1,
    minggu: parseInt(getWeekOfTheDay()),
    tahun: new Date().getFullYear(),
  });

  const [BottomPanelPopup, setBottomPanelPopup] = useState({
    show: false,
    shadow: true,
    data: null,
    title: null,
    type: '',
    content: '',
  });

  const countArrayWeek = () => {
    let week = getWeekOfMonth();
    let weekArray = [];
    for (let i = 0; i < week; i++) {
      let idx = i + 1;
      weekArray.push({id: idx, value: idx, label: idx.toString()});
    }

    // return weekArray;
    // console.log('weekArray', weekArray);
    setWeekOfMonth(weekArray);
    // setJadwalPengiriman(prev=>({...prev,minggu:week}));
  };

  // =========== Component Did Mount START =========== //

  useEffect(() => {
    countArrayWeek();
    // setIsLoading(true);

    // setIsSubmitted(false);
    console.log('route.params', route.params);
    if (route.params) {
      setReData(route.params);
      getListWarehouse(true);
    }
  }, [route.params]);

  useEffect(() => {
    // if (!route.params)
    setSelectedBank(bankPrimary);
  }, [bankPrimary]);

  useEffect(() => {
    if (
      // !reData &&
      SelectedWarehouse
    ) {
      getListKomoditi();
    }
  }, [SelectedWarehouse]);

  useEffect(() => {
    setIsDone(false);
    setSelectedWarehouse(null);
    if (!route.params) {
      console.log('_handleCleanPop 1');
      _handleCleanPop();
    }
    dispatch(setAlert(false));
  }, [navigation]);

  const getListWarehouse = async (firstLoad = false) => {
    setIsLoading(true);
    await API.get('farmer/offer/warehouse-list')
      .then(res => {
        // console.log('API res getListWarehouse', res);
        if (res?.meta?.http_status === 200) {
          const result = res.data
            ? res.data.map(data => {
                const address = data.address_full;
                return {
                  ...data,
                  option: data.id,
                  address: `${address.address} ${address.village_name}, ${address.district_name}, ${address.city_name}, ${address.province_name}`,
                };
              })
            : [];
          // console.log('API res getListWarehouse 2', result);
          dispatch({type: SET_WAREHOUSE_LIST, value: result});
          setWarehouseListData(result);
          if (route.params?.DataOffer) {
            handleResubmit(result);
          } else {
            console.log('_handleCleanPop 2');
            // _handleCleanPop();
          }
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));

    if (!firstLoad) {
      setIsLoading(false);
    }
  };

  const getListKomoditi = async () => {
    setIsLoading(true);
    await API.get(
      `farmer/offer/commoditie-list?page=1&limit=1000&sort=created_at&warehouse_id=${SelectedWarehouse?.id}`,
    )
      .then(res => {
        // console.log('res get list komoditi', res);
        // if (!isDraft) {
        //   setSelectedKomoditi([]);
        // }
        if (res?.meta?.http_status === 200) {
          setKommoditiListData(res.data.commodities);
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
    setIsLoading(false);
  };

  const handleSubmitOffer = (create = 'offer') => {
    // setBottomPanelPopup({show: true, content: 'submit'});
    if (isLoading) {
      return;
    }
    let formData = {
      shipping_year: JadwalPengiriman.tahun,
      shipping_month: JadwalPengiriman.bulan,
      shipping_week: JadwalPengiriman.minggu,
      warehouse_id: SelectedWarehouse.id,
      farmer_bank_account_id: create === 'offer' ? SelectedBank?.id : null,
      commoditie_offer: SelectedKomoditi,
      coupon_id: SelectedKupon?.id ?? null,
    };
    console.log('formData', formData);
    // return;
    let url =
      create === 'offer'
        ? 'farmer/offer/create'
        : create === 'draft'
        ? 'farmer/offer/create-draft'
        : `farmer/offer/update-draft/${DataOffer?.id}`;

    setIsLoading(true);
    if (create === 'offer') {
      API.post(url, formData, true)
        .then(res => {
          console.log('res handleSubmitOffer', create, res);
          if (res?.meta?.http_status === 200) {
            setKommoditiListData(res.data.commodities);
            setBottomPanelPopup({
              show: true,
              content: create === 'offer' ? 'submit' : 'draft',
            });
            setSelectedKomoditi([]);
            setSelectedWarehouse(null);
            setIsDone(true);
          } else {
            _handleAlertMessage(res);
          }
        })
        .catch(err => _handleAlertMessage(err));
    } else {
      if (url === 'farmer/offer/create-draft') {
        API.post(url, formData, true)
          .then(res => {
            console.log('res handleSubmitOffer', create, res);
            if (res?.meta?.http_status === 200) {
              setKommoditiListData(res.data.commodities);
              setBottomPanelPopup({
                show: true,
                content: create === 'offer' ? 'submit' : 'draft',
              });
              setSelectedKomoditi([]);
              setSelectedWarehouse(null);
              setIsDone(true);
            } else {
              _handleAlertMessage(res);
            }
          })
          .catch(err => _handleAlertMessage(err));
      } else {
        API.put(url, formData, true)
          .then(res => {
            console.log('res handleUpdateDraft', create, res);
            if (res?.meta?.http_status === 200) {
              // setKommoditiListData(res.data.commodities);
              setBottomPanelPopup({
                show: true,
                title: 'Data Berhasil Disimpan',
                content: create === 'offer' ? 'submit' : 'draft',
              });
              // setSelectedKomoditi([]);
              // setSelectedWarehouse('');
            } else {
              _handleAlertMessage(res);
            }
          })
          .catch(err => _handleAlertMessage(err));
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  };

  // ========================= RESUBMIT =========================

  const handleResubmit = warehouse => {
    // const params = route.params;
    // console.log('reData', reData);
    let findWarehouse = warehouse.find(
      ware => ware.id === reData.DataOffer.warehouse_id,
    );
    if (findWarehouse) {
      // console.log('selectedWarehouse', findWarehouse)
      setSelectedWarehouse(findWarehouse);
    }
    // setJadwalPengiriman({
    //   bulan: reData.DataOffer.shipping_month,
    //   minggu: reData.DataOffer.shipping_week,
    //   tahun: reData.DataOffer.shipping_year,
    // });
    // setSelectedBank({
    //   id: reData.DataBank.id,
    //   bank_id: reData.DataBank.id,
    //   bank_name: reData.DataOffer.farmer_bank_name,
    //   bank_account_number: reData.DataOffer.farmer_bank_account_number,
    //   bank_account_name: reData.DataOffer.farmer_bank_account_name,
    // });

    recheckDetailKomoditi();

    // setSelectedKupon({});
  };

  const draftDetailKomoditi = async dt => {
    let commoditie_ids = '';
    let mappedKomoditi = dt?.map(komoditi => {
      if (commoditie_ids === '') {
        commoditie_ids = komoditi.commoditie_id;
      } else {
        commoditie_ids = commoditie_ids + ',' + komoditi.commoditie_id;
      }

      return {
        _id: komoditi.id,
        commoditie_photo:
          komoditi?.commoditie_photos || komoditi?.commoditie_photo,
        commoditie_id: komoditi.commoditie_id,
        // commoditie_variant_id: 2, // assign dari API di bawah
        sku: komoditi.commoditie_or_variant_sku,
        grade_id: komoditi.grade_id,
        grade_name: komoditi.grade_name,
        name: komoditi.commoditie_name,
        note: komoditi.note,
        // parentId: 4,
        quantity: komoditi.quantity,
        // subtotal: komoditi.total_price,
        subtotal: komoditi.subtotal,
        unit: komoditi.unit,
        unit_price: komoditi.unit_price,
      };
    });
    // console.log('commoditie_ids', commoditie_ids);
    // console.log('mappedKomoditi', mappedKomoditi);
    setSelectedKomoditi(mappedKomoditi);
    // await getDetailKomoditi(commoditie_ids);
  };
  const recheckDetailKomoditi = async () => {
    let commoditie_ids = '';
    let mappedKomoditi = reData.DataListKomoditi.map(komoditi => {
      if (commoditie_ids === '') {
        commoditie_ids = komoditi.commoditie_id;
      } else {
        commoditie_ids = commoditie_ids + ',' + komoditi.commoditie_id;
      }

      return {
        _id: komoditi.id,
        commoditie_photo:
          komoditi?.commoditie_photos || komoditi?.commoditie_photo,
        commoditie_id: komoditi.commoditie_id,
        // commoditie_variant_id: 2, // assign dari API di bawah
        sku: komoditi.commoditie_or_variant_sku,
        grade_id: komoditi.grade_id,
        grade_name: komoditi.grade_name,
        name: komoditi.commoditie_name,
        note: komoditi.note,
        // parentId: 4,
        quantity: komoditi.quantity,
        // subtotal: komoditi.total_price,
        subtotal: komoditi.subtotal,
        unit: komoditi.unit,
        unit_price: komoditi.unit_price,
      };
    });
    // console.log('commoditie_ids', commoditie_ids);
    // console.log('mappedKomoditi', mappedKomoditi);
    setSelectedKomoditi(mappedKomoditi);
    await getDetailKomoditi(commoditie_ids);
    // setIsLoading(false);
  };

  const getDetailKomoditi = async commoditie_ids => {
    await API.get(
      `/farmer/offer/commoditie-detail-list?commoditie_list=${commoditie_ids}`,
    )
      .then(res => {
        // console.log('res getDetailKomoditi', res);
        if (res?.meta?.http_status === 200) {
          if (res.data) {
            let komoditiFound = true;
            // console.log('mappedKomoditi', mappedKomoditi);

            let mappedKomoditi = reData.DataListKomoditi.map(mapKomo => {
              let commoditie_variant_id = '';
              let find_commoditie_variant_id = res.data.find(resdata => {
                if (
                  resdata?.market_price?.commoditie_id === mapKomo.commoditie_id
                ) {
                  // console.log(
                  //   'found same id',
                  //   resdata?.market_price?.commoditie_id,
                  // );
                  if (resdata?.market_price?.list_market_price?.length > 0) {
                    let findMarket =
                      resdata?.market_price?.list_market_price.find(market => {
                        if (market.grade_id === mapKomo?.grade_id) {
                          return true;
                        }
                      });
                    // console.log('findMarket', findMarket);
                    if (findMarket) {
                      commoditie_variant_id = findMarket.commoditie_variant_id;
                      // return findMarket;
                    } else {
                      komoditiFound = false;
                    }
                  }
                } else {
                  komoditiFound = false;
                }
              });
              // console.log('find_commoditie_variant_id', find_commoditie_variant_id);
              // console.log('commoditie_variant_id', commoditie_variant_id);
              return {
                ...mapKomo,
                commoditie_variant_id,
              };
            });
            // console.log('mappedKomoditi', mappedKomoditi);

            if (komoditiFound) {
              // UPDATE untuk submit
              // console.log('komoditiFound', komoditiFound);
              setSelectedKomoditi(mappedKomoditi);
              setReCheckKomoditi(true);
            } else {
              setReCheckKomoditi(false);
            }
          } else {
            setReCheckKomoditi(res.data);
          }
          // setKommoditiListData(res.data.commodities);
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => _handleAlertMessage(err));
  };

  // ========================= CLEANING ==========================

  function _handleAlertMessage(res, type = 'error', msg = null) {
    // console.log('_handleAlertMessage', type, res);
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
    console.log('_handleCleanPop 3');
    _handleCleanPop();
  }

  function _handleCleanPop() {
    setBottomPanelPopup({show: false});
    // setIsSubmitted(false);
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 700);
  }

  const showAlert = () => {
    dispatch(setMessage('Pilih Komoditi Terlebih Dahulu'));
    dispatch(setMessageType('error'));
    dispatch(setAlert(true));
  };

  // ============================================================

  const isDisabled = SelectedWarehouse === '' || SelectedKomoditi?.length < 1;

  const handleBack = () => {
    if (route.params) {
      goBack();
    } else {
      setBottomPanelPopup({
        show: true,
        content: 'leave',
      });
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const backAction = () => {
      handleBack();
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

  const customBack = () => {
    if (BottomPanelPopup.content === 'submit') {
      navigation.navigate('TransactionScreen');
    } else {
      setBottomPanelPopup({show: false});
      goBack();
    }
  };

  const [draftData, setDraftData] = useState(route?.params?.dataOffer);
  const [Refresh, setRefresh] = useState(false);
  const [DataOffer, setDataOffer] = useState(null);
  const [DataLog, setDataLog] = useState(null);
  const [Status, setStatus] = useState(0);

  // console.log('route', route);
  useEffect(() => {
    let offerNumber = route?.params?.dataOffer?.offer_number;
    let offerID = route?.params?.dataOffer?.id;
    console.log('offerNumber', offerNumber);
    console.log('offerID', offerID);
    if (offerNumber) {
      getDetailCart(offerNumber);
    } else if (offerID) {
      getDetailCart('', offerID);
    } else {
      // setIsLoading(false);
    }
  }, [navigation, Refresh, route.params]);

  useEffect(() => {
    console.log('isDraft', isDraft);
  }, [isDraft]);

  const getDetailCart = async (offerNumber, id = false) => {
    setIsLoading(true);
    const url = id
      ? 'farmer/offer/detail/id/' + id
      : 'farmer/offer/detail/' + offerNumber;
    await API.get(url)
      .then(res => {
        console.log('API res getDetailCart', res);
        const dataOffer = res.data.offer;
        if (res?.meta?.http_status === 200) {
          const offer = {
            ...res.data.offer,
            total_penawaran: res.data.total_penawaran,
            total_harga_setujui: res.data.total_harga_setujui,
            total_akhir: res.data.total_akhir,
          };
          if (res.data.offer.status === 'Draft') {
            setIsDraft(true);
            setReData(false);
            draftDetailKomoditi(res.data.list_commoditie);
            getListWarehouse();
          } else {
            setIsDraft(false);
          }
          setDataOffer(offer);
          setSelectedWarehouse(res.data.warehouse);
          setJadwalPengiriman({
            bulan: res.data.offer.shipping_month,
            minggu: res.data.offer.shipping_week,
            tahun: res.data.offer.shipping_year,
          });
          setSelectedKupon(res.data.coupon_id);
          const findStatus = statusList.find(
            status => status.status === offer.status,
          );
          // console.log('findStatus', findStatus);
          setDataLog(res.data.log_status_offer);

          if (findStatus) {
            setStatus(findStatus.id);
          }

          //get detail warehouse
        } else {
          _handleAlertMessage(res);
        }
      })
      .catch(err => console.log(err));
    // setIsLoading(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
      // setIsLoading(false);
    }, 500);
  };

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <LoadingAnimated visible={isLoading} handleBack={() => handleBack()} />
      {/* {!isLoading && ( */}
      <>
        <AppBar
          appBarColor={theme.backgroundColor}
          // navigation={navigation}
          headerTextColor={theme.textColor}
          title={isLoading ? '' : isDraft ? 'Edit Penawaran' : 'Buat Penawaran'}
          borderBottom
          borderBottomColor={theme.textColor}
          borderBottomHeight={1.5}
          hideRightContent
          iconLeft={
            <TouchableOpacity onPress={() => handleBack()}>
              <IconLeftArrow width={20} height={20} fill={theme.textColor} />
            </TouchableOpacity>
          }
        />

        {/* {!reData && ( */}
        <>
          <ScrollView
            style={[
              styles.bodyContent,
              {
                backgroundColor: '#F5F6F7',
              },
            ]}
            contentContainerStyle={{flexGrow: 1}}
            refreshControl={
              <RefreshControl refreshing={Refresh} onRefresh={handleRefresh} />
            }
            showsVerticalScrollIndicator={false}>
            <Container backgroundColor={'#F5F6F7'}>
              {isDraft && (
                <View style={[styles.cardNoBorder, styles.cardSpace]}>
                  <Detail
                    DataOffer={DataOffer}
                    DataLog={DataLog}
                    Status={Status}
                  />
                </View>
              )}
              {!IsDone && (
                <View style={[styles.cardNoBorder, styles.cardSpace]}>
                  <Warehouse
                    setBottomPanelPopup={setBottomPanelPopup}
                    SelectedWarehouse={SelectedWarehouse}
                    reData={reData}
                  />
                </View>
              )}
              {SelectedWarehouse ? (
                <>
                  {/* Komoditi Form */}
                  <View style={[styles.cardNoBorder, styles.cardSpace]}>
                    <Komoditi
                      SelectedKupon={SelectedKupon}
                      setBottomPanelPopup={setBottomPanelPopup}
                      SelectedKomoditi={
                        newKomoditi?.length > 0 ? newKomoditi : SelectedKomoditi
                      }
                      // SelectedKomoditi={SelectedKomoditi}
                      setSelectedKomoditi={setSelectedKomoditi}
                      reData={reData}
                    />
                  </View>

                  <View
                    style={[
                      styles.cardNoBorder,
                      styles.cardSpace,
                      {paddingVertical: 0},
                    ]}>
                    <Coupon
                      SelectedKupon={SelectedKupon}
                      setBottomPanelPopup={setBottomPanelPopup}
                      SelectedKomoditi={SelectedKomoditi}
                      showAlert={showAlert}
                    />
                  </View>

                  <View
                    style={[
                      styles.cardNoBorder,
                      styles.cardSpace,
                      {
                        zIndex: 1,
                        elevation: 1,
                      },
                    ]}>
                    <Text style={gStyles.text(16, '500', '#313447')}>
                      Jadwal Pengiriman
                    </Text>
                    <View style={[gStyles.row, {marginTop: 8}]}>
                      <View style={[gStyles.col, {width: '35%'}]}>
                        <Select
                          value={JadwalPengiriman.bulan}
                          setValue={val =>
                            setJadwalPengiriman(prev => ({
                              ...prev,
                              bulan: val,
                            }))
                          }
                          data={dataBulanIndo}
                          placeholder="Bulan"
                          label="Bulan"
                          // disable={reData}
                        />
                      </View>
                      <View style={[gStyles.col, {width: '25%'}]}>
                        <Select
                          setValue={val =>
                            setJadwalPengiriman(prev => ({
                              ...prev,
                              minggu: val,
                            }))
                          }
                          data={dummyWeeks}
                          value={JadwalPengiriman.minggu}
                          defaultValue={JadwalPengiriman.minggu}
                          placeholder="Minggu Ke"
                          label="Minggu Ke"
                          // disable={reData}
                        />
                      </View>
                      <View style={[gStyles.col, {width: '35%'}]}>
                        <Select
                          value={JadwalPengiriman.tahun}
                          setValue={val =>
                            setJadwalPengiriman(prev => ({
                              ...prev,
                              tahun: val,
                            }))
                          }
                          data={listYearPengiriman()}
                          placeholder="Tahun"
                          label="Tahun"
                          // disable={reData}
                        />
                      </View>
                    </View>
                  </View>

                  {/* <View style={[styles.cardNoBorder, styles.cardSpace]}>
                  <Text style={gStyles.text(16, '500', '#313447')}>
                    Rekening Penerima Pembayaran
                  </Text>
                  <View style={[gStyles.row_2, styles.bankCard]}>
                    {SelectedBank && (
                      <View style={{width: 63, height: 45, marginRight: 10}}>
                        <Image
                          source={{uri: SelectedBank.bank.bank_image}}
                          style={{
                            flex: 1,
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                    )}
                    <View style={[gStyles.row_center2, {flex: 1}]}>
                      {SelectedBank ? (
                        <View style={[gStyles.col, {width: '85%'}]}>
                          <Text style={gStyles.text(14, '500', '#313447')}>
                            {SelectedBank?.bank?.name}
                          </Text>
                          <Text style={gStyles.text(12, '500', '#797B8A')}>
                            {SelectedBank.bank_account_name} -{' '}
                            {SelectedBank.bank_account_number}
                          </Text>
                        </View>
                      ) : (
                        <Text style={gStyles.text(12, '400', '#797B8A')}>
                          Mohon Pilih Rekening Bank Utama
                        </Text>
                      )}
                      <TouchableOpacity
                        style={{width: '15%', minWidth: 50}}
                        onPress={() => {
                          setIsLoading(true);
                          setBottomPanelPopup({
                            show: true,
                            shadow: false,
                            content: 'bank',
                            type: 'full',
                          });
                          setTimeout(() => {
                            setIsLoading(false);
                          }, 500);
                        }}>
                        <Text style={gStyles.text(14, '700', '#5C73BD')}>
                          {SelectedBank ? 'Ganti' : 'Pilih'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View> */}
                </>
              ) : null}
            </Container>
          </ScrollView>
          {SelectedWarehouse ? (
            <>
              <View style={[styles.borderTop, {boxShadow: theme.textColor}]} />
              <View
                style={[
                  gStyles.paddingHorizontal(16),
                  gStyles.row,
                  {
                    backgroundColor: theme.backgroundColor,
                    alignItems: 'center',
                  },
                ]}>
                {isDraft ? (
                  <Button
                    title={'Simpan'}
                    type="full"
                    isDisabled={isDisabled}
                    onPress={() => handleSubmitOffer('update')}
                    style={{
                      backgroundColor: isDisabled
                        ? colors.neutral
                        : colors.primary,
                      width: '100%',
                      marginTop: 10,
                      margin: 10,
                      marginLeft: 0,
                    }}
                    textStyle={{
                      color: isDisabled ? colors.grey2 : colors.light,
                    }}
                  />
                ) : (
                  <>
                    <Button
                      style={{
                        marginVertical: 10,
                        marginTop: 20,
                        width: '48%',
                      }}
                      isDisabled={isDisabled}
                      onPress={() => handleSubmitOffer('draft')}
                      title={
                        <View style={gStyles.row_center}>
                          <Text
                            style={[
                              {lineHeight: 20, marginLeft: 8},
                              gStyles.text(
                                16,
                                '500',
                                isDisabled ? colors.neutral : colors.primary,
                              ),
                            ]}>
                            + Keranjang
                          </Text>
                        </View>
                      }
                    />
                    <Button
                      title={'Selanjutnya'}
                      type="full"
                      isDisabled={isDisabled}
                      onPress={() => {
                        setIsLoading(true);
                        setBottomPanelPopup({
                          show: true,
                          shadow: false,
                          content: 'bank',
                        });
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 500);
                      }}
                      style={{
                        backgroundColor: isDisabled
                          ? colors.neutral
                          : colors.primary,
                        width: '48%',
                        marginTop: 10,
                      }}
                      textStyle={{
                        color: isDisabled ? colors.grey2 : colors.light,
                      }}
                    />
                  </>
                )}
              </View>
            </>
          ) : null}
        </>
        {/* )} */}
      </>
      {/* )} */}

      {alert && (
        <View style={styles.alert}>
          <CustomAlert
            text={message}
            handleClose={() => dispatch(setAlert(false))}
            type={messageType}
            alertType="bottom"
            timeClose={3000}
          />
        </View>
      )}

      {BottomPanelPopup.show && (
        <BottomPanelModal
          radius={12}
          clickOutsideToClosePanel
          closePanel={() => {
            if (IsDone) {
              navigation.navigate('TransactionScreen');
            } else {
              setBottomPanelPopup({show: false});
            }
          }}
          height={BottomPanelPopup.type === 'full' ? '100%' : 'auto'}
          withHeader={BottomPanelPopup.title}
          showCloseBtn={BottomPanelPopup.title}
          title={BottomPanelPopup.title}
          shadowTitle={BottomPanelPopup.shadow}
          backgroundPanel={'#fff'}
          content={
            BottomPanelPopup.content === 'warehouse' ? (
              <WarehouseList
                SelectedWarehouse={SelectedWarehouse}
                setSelectedWarehouse={setSelectedWarehouse}
                closePanel={() => setBottomPanelPopup({show: false})}
                WarehouseListData={WarehouseListData}
                getListWarehouse={getListWarehouse}
                BottomPanelPopup={BottomPanelPopup}
              />
            ) : BottomPanelPopup.content === 'leave' ? (
              <AlertPopUp
                navigation={navigation}
                setBottomPanelPopup={setBottomPanelPopup}
                BottomPanelPopup={BottomPanelPopup}
                reData={reData}
                goBack={goBack}
              />
            ) : BottomPanelPopup.content === 'kupon' ? (
              <CouponList
                setBottomPanelPopup={setBottomPanelPopup}
                setSelectedKupon={setSelectedKupon}
                SelectedKomoditi={SelectedKomoditi}
                SelectedKupon={SelectedKupon}
                navigation={navigation}
                dispatch={dispatch}
                customBack={customBack}
              />
            ) : BottomPanelPopup.content === 'bank' ? (
              <>
                <RekeningBank
                  closePanel={() => {
                    setIsLoading(true);
                    setBottomPanelPopup({show: false});
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 300);
                  }}
                  asPopUp={{
                    setSelectedBank: setSelectedBank,
                    SelectedBank: SelectedBank,
                    isLoading: isLoading,
                    handleSubmitOffer: handleSubmitOffer,
                  }}
                  navigation={navigation}
                  // bankState={{setSelectedBank, SelectedBank}}
                />
              </>
            ) : BottomPanelPopup.content === 'komoditiDelete' ? (
              <AlertPopUp
                navigation={navigation}
                setBottomPanelPopup={setBottomPanelPopup}
                BottomPanelPopup={BottomPanelPopup}
                onPress={() => {
                  let data = BottomPanelPopup.data;
                  let filterData = SelectedKomoditi.filter(
                    dataAll => dataAll._id !== data._id,
                  );
                  setSelectedKomoditi(filterData);
                  setBottomPanelPopup({show: false});
                  _handleAlertMessage(
                    null,
                    'success',
                    'Komoditi Berhasil Terhapus',
                  );
                }}
              />
            ) : BottomPanelPopup.content === 'komoditiWithKuponDelete' ? (
              <AlertPopUp
                navigation={navigation}
                setBottomPanelPopup={setBottomPanelPopup}
                BottomPanelPopup={BottomPanelPopup}
                onPress={() => {
                  let data = BottomPanelPopup.data;
                  let filterData = SelectedKomoditi.filter(
                    dataAll => dataAll._id !== data._id,
                  );
                  setSelectedKomoditi(filterData);
                  let filterDataNew = newKomoditi.filter(
                    dataAll => dataAll._id !== data._id,
                  );
                  setNewKomoditi(filterDataNew);
                  setBottomPanelPopup({show: false});
                  _handleAlertMessage(
                    null,
                    'success',
                    'Komoditi Berhasil Terhapus',
                  );
                }}
              />
            ) : BottomPanelPopup.content === 'submit' ? (
              <AlertPopUp
                navigation={navigation}
                setBottomPanelPopup={setBottomPanelPopup}
                BottomPanelPopup={BottomPanelPopup}
              />
            ) : BottomPanelPopup.content === 'draft' ? (
              <AlertPopUp
                navigation={navigation}
                setBottomPanelPopup={setBottomPanelPopup}
                BottomPanelPopup={BottomPanelPopup}
              />
            ) : (
              <KomoditiList
                setBottomPanelPopup={setBottomPanelPopup}
                setSelectedKomoditi={setSelectedKomoditi}
                SelectedKomoditi={SelectedKomoditi}
                KommoditiListData={KommoditiListData}
                editable={BottomPanelPopup.data}
                IsLoading={isLoading}
                setIsLoading={setIsLoading}
                SelectedKupon={SelectedKupon}
              />
            )
          }
        />
      )}
    </View>
  );
};

export default BuatPenawaran;
