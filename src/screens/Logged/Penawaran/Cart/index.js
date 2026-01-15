import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  AppBar,
  BottomPanelModal,
  Button,
  CardTransaksi,
  CustomAlert,
  EmptyList,
  Gap,
  Loading,
  LoadingAnimated,
} from '../../../../components';
import {AddSquare, IconLeftArrow} from '../../../../assets';
import {
  _handleAlertMessage,
  getOfferNumber,
  setAlert,
  setSelectedKupon,
} from '../../../../services';
import CheckBox from '@react-native-community/checkbox';
import {colors, gStyles} from '../../../../utils/styles';
import AlertBottomPanel from '../../Home/component/AlertBottomPanel';
import {
  NumberFormatter,
  delimiterFormat,
} from '../../../../utils/helpers/number';
import API, {getErrorResponse} from '../../../../services/api';
import {format_tanggal_indo} from '../../../../utils/helpers/date';
import RekeningBank from '../../Profile/RekeningBank';
import AlertPopUp from '../Buat/component/AlertPopup';

const ListCart = ({navigation}) => {
  const {theme, message, messageType, alert, alertType, loading} = useSelector(
    reducer => reducer.global,
  );
  const dispatch = useDispatch();
  const {bankPrimary} = useSelector(reducer => reducer.profile);
  const pageSize = 10;
  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [SelectedBank, setSelectedBank] = useState(bankPrimary);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [listCart, setListCart] = useState([]);
  const [BottomPanelPopup, setBottomPanelPopup] = useState({
    show: false,
    shadow: true,
    data: null,
    title: null,
    type: '',
    content: '',
  });

  useEffect(() => {
    getListCart();
  }, [page, navigation]);

  const handleCheckoutCart = async (create = 'offer') => {
    // setBottomPanelPopup({show: true, content: 'submit'});
    // return;
    let formData = {
      farmer_bank_account_id: SelectedBank?.id ?? null,
      offer_ids: listCart?.filter(dt => dt.isSelected).map(dt => dt.id),
    };
    console.log('formData', formData);
    // return;
    let url = 'farmer/offer/checkout-draft';

    setIsLoading(true);
    await API.post(url, formData, true)
      .then(res => {
        console.log('res handleCheckoutCart', create, res);
        if (res?.meta?.http_status === 200) {
          setBottomPanelPopup({
            show: true,
            content: 'submit',
          });
          getListCart();
        } else {
          _handleAlertMessage(res);
          Alert.alert(
            'Failed',
            getErrorResponse(res?.response?.data?.errors[0]?.message),
          );
        }
      })
      .catch(err => {
        Alert.alert(
          'Failed',
          getErrorResponse(err?.response?.data?.errors[0]?.message),
        );
        _handleAlertMessage(err);
      });
    setTimeout(() => {
      setIsLoading(false);
      setBottomPanelPopup({
        show: false,
      });
    }, 300);
  };

  const getListCart = async () => {
    if (page !== 1) {
      console.log('page', page);
      await API.get(
        `farmer/offer/list/draft?page=${page}&limit=${pageSize}&sort=updated_at-`,
      )
        .then(res => {
          console.log(`res get cart page ${page}`, res);
          let newData = listCart.concat(res.data?.offers);
          // if (res.data.length < 1) {
          //   setLastPage(true);
          // }
          if (res.meta.last_page === page) {
            setLastPage(true);
          }

          newData = newData.map(obj => {
            return {...obj, isSelected: false};
          });
          // console.log('message', message);
          console.log('newData', newData);

          setListCart(newData);

          // Alert.alert('Berhasil melakukan sync data');
          // setAlert(true)
          setLoadMoreLoading(false);
        })
        .catch(err => {
          console.log('err get list cart petani', err);
        });
    } else {
      await API.get(
        `farmer/offer/list/draft?page=1&limit=${pageSize}&sort=updated_at-`,
      )
        .then(res => {
          console.log('res get cart page 1', res);
          let newData = res.data?.offers;
          newData = newData.map(obj => {
            return {...obj, isSelected: false};
          });
          console.log('newData', newData);

          setListCart(newData);

          setLoadMoreLoading(false);
        })
        .catch(err => {
          console.log('err get list chat petani ', err);
        });
    }
    setIsLoading(false);
  };

  const handleRefresh = useCallback(() => {
    setPage(1);
    getListCart();
  }, []);

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setPage(page + 1);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleRefresh();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const goBack = () => {
    // dispatch(setSelectedKupon(null));
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

  const handleBack = () => {
    navigation.goBack();
  };

  const customBack = () => {
    // if (BottomPanelPopup.content === 'submit') {
    navigation.navigate('HomeScreen');
    // } else {
    setBottomPanelPopup({show: false});
    //   goBack();
    // }
  };

  const handleBuatPenawaran = async () => {
    await dispatch(getOfferNumber())
      .then(res => {
        console.log('res handleBuatPenawaran', res);
        dispatch(setSelectedKupon(null));
        if (res.success) {
          navigation.navigate('BuatPenawaran');
        } else if (res.message) {
          Alert.alert(res.message);
        } else {
          setShowBottomPanel(true);
        }
      })
      .catch(err => {
        console.log('err', err);
        Alert.alert(err?.message);
      });
  };

  const handleSelectOffer = useCallback(
    (id, isSelect) => {
      console.log('offer_id', id);
      console.log('isSelect', isSelect);
      //ngerubah status isSelected
      const updatedData = listCart.map(item => {
        if (item.id === id) {
          return {...item, isSelected: isSelect};
        }
        return item;
      });
      console.log('updatedData', updatedData);
      setListCart(updatedData);
    },
    [listCart],
  );

  const handleDeleteCart = async () => {
    let formData = {
      offer_ids: listCart?.filter(dt => dt.isSelected).map(dt => dt.id),
    };
    setIsLoading(true);
    console.log('formData', formData);
    await API.delete('farmer/offer/delete-draft', formData, true)
      .then(res => {
        console.log('res handleDeleteCart === ', res);
        if (res?.meta?.http_status === 200) {
          // Alert.alert('');
          handleRefresh();
          _handleAlertMessage(res, 'success', res.message);
        } else {
          _handleAlertMessage(res, 'failed', res.message);
        }
      })
      .catch(err => {
        Alert.alert(getErrorResponse(err?.response?.data?.errors));
        _handleAlertMessage(err);
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  let isAnySelected = listCart.filter(obj => obj.isSelected).length;

  const SelectAllCart = useCallback(() => {
    const onClick = () => {
      let updatedArray = listCart.map(obj => {
        return {...obj, isSelected: !toggleCheckBox};
      });

      setListCart(updatedArray);
      setToggleCheckBox(!toggleCheckBox);
    };
    return listCart?.length > 0 ? (
      <>
        <TouchableOpacity
          onPress={() => onClick()}
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Text style={gStyles.text(14, '400', '#313447')}>Pilih Semua</Text>
          <CheckBox
            disabled={false}
            value={toggleCheckBox}
            tintColors={{true: '#2A378E', false: '#d4d4d4'}}
            onValueChange={newValue => onClick()}
          />
        </TouchableOpacity>
      </>
    ) : null;
  }, [listCart, toggleCheckBox]);
  return (
    <SafeAreaView style={styles.container}>
      <LoadingAnimated visible={isLoading} />
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        iconLeft={
          <IconLeftArrow width={20} height={20} fill={theme.textColor} />
        }
        hideRightContent={listCart?.length > 0 ? false : true}
        rightContent={<SelectAllCart />}
        title="Keranjang"
        borderBottom
        borderBottomColor={theme.textColor}
        customBack={customBack}
      />

      {/* body content */}

      {/* {isLoading && <Loading />} */}
      {isLoading && <LoadingAnimated visible={isLoading} />}
      <ScrollView
        style={[
          styles.bodyContent,
          {
            backgroundColor: theme.backgroundColor,
          },
        ]}
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        {listCart?.length > 0 ? (
          listCart?.map((dt, i) => (
            <CardTransaksi
              onPress={() =>
                navigation.navigate('BuatPenawaran', {
                  dataOffer: dt,
                  isDraft: true,
                })
              }
              key={i}
              id={dt?.id}
              products={dt?.offer_commodities}
              no={dt?.offer_number}
              date={dt?.offer_date}
              totalPrice={dt?.total_price_offer}
              isCart={true}
              isCartSelected={
                listCart.some(
                  obj => obj.id === dt?.id && obj?.isSelected === true,
                )
                  ? true
                  : false
              } //jika listCart?.id yang diloop ada di dalam selectedData
              selectOffer={handleSelectOffer}
            />
          ))
        ) : isLoading ? null : (
          <EmptyList
            title="Belum Ada Penawaran"
            desc="Penawaran yang belum dikirim
          akan muncul di sini."
            type="full"
          />
        )}

        <Gap height={16} />
        {lastPage ? null : (
          <View style={styles.wrapperLoadMore}>
            <TouchableOpacity
              style={styles.btnLoadMore}
              onPress={handleLoadMore}>
              {loadMoreLoading ? (
                <Lottie
                  style={gStyles.height(20)}
                  source={require('../../../../assets/icon/loading.json')}
                  autoPlay
                  loop
                />
              ) : (
                <Text style={gStyles.text(14, '600', '#1E1E1F')}>
                  Load More
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {alert ? (
        <CustomAlert
          text={message}
          handleClose={() => dispatch(setAlert(false))}
          type={messageType}
          alertType={alertType}
        />
      ) : null}
      <AlertBottomPanel
        navigation={navigation}
        showBottomPanel={showBottomPanel}
        setShowBottomPanel={setShowBottomPanel}
      />
      {isAnySelected > 0 ? (
        <>
          <View style={[styles.borderTop, {boxShadow: theme.textColor}]} />
          <View
            style={[
              gStyles.paddingHorizontal(16),
              gStyles.paddingVertical(8),
              {
                backgroundColor: theme.backgroundColor,
                display: 'flex',
                flexDirection: 'column',
                // alignItems: 'center',
                // justifyContent: 'space-between',
                // flexDirection: 'column',
              },
            ]}>
            <Text style={gStyles.text(16, '400', '#313447')}>
              <Text style={gStyles.text(16, '700', '#313447')}>
                {isAnySelected}
              </Text>{' '}
              Penawaran Dipilih
            </Text>
            {/* <Button
              title={'Selanjutnya'}
              type="full"
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
              style={[
                {
                  backgroundColor: colors.primary,
                  width: '48%',
                },
              ]}
              textStyle={[
                {
                  color: colors.light,
                },
              ]}
            /> */}
            <View style={[gStyles.row, {marginTop: 8}]}>
              <TouchableOpacity
                style={[
                  styles.btnCancel,
                  gStyles.row_center,
                  {backgroundColor: '#F5F6F7', width: '48%'},
                ]}
                onPress={() => handleDeleteCart()}>
                <Text style={[gStyles.text(14, '500', '#313447'), {margin: 0}]}>
                  Hapus
                </Text>
              </TouchableOpacity>
              <Button
                title={'Selanjutnya'}
                type="full"
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
                style={[
                  {
                    backgroundColor: colors.primary,
                    width: '48%',
                  },
                ]}
                textStyle={[
                  {
                    color: colors.light,
                  },
                ]}
              />
            </View>
          </View>
        </>
      ) : (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => handleBuatPenawaran()}>
          <AddSquare width={24} height={24} />
        </TouchableOpacity>
      )}
      {BottomPanelPopup.show && (
        <BottomPanelModal
          radius={12}
          clickOutsideToClosePanel
          closePanel={() => {
            if (BottomPanelPopup.content === 'submit') {
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
            BottomPanelPopup.content === 'bank' ? (
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
                    handleSubmitOffer: handleCheckoutCart,
                  }}
                  navigation={navigation}
                  // bankState={{setSelectedBank, SelectedBank}}
                />
              </>
            ) : (
              <AlertPopUp
                navigation={navigation}
                setBottomPanelPopup={setBottomPanelPopup}
                BottomPanelPopup={BottomPanelPopup}
              />
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ListCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 0,
  },
  bodyContent: {
    display: 'flex',
    padding: 16,
    flex: 1,
  },
  wrapperLoadMore: {marginTop: 12, marginBottom: 14, marginHorizontal: 16},
  btnLoadMore: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BEBFC2',
  },
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
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    elevation: 4, // for Android only
    shadowColor: '#000', // for iOS only
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
