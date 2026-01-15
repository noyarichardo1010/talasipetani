import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {gStyles} from '../../../../utils/styles';
import styles from '../../Penawaran/styles';
import {useDispatch, useSelector} from 'react-redux';
import {AddSquare, BoxIcon, IconDot} from '../../../../assets';
import {BadgeStatus, LoadingAnimated} from '../../../../components';
import EmptyTransaction from '../../Home/component/EmptyTransaction';
import API from '../../../../services/api';
import {
  _handleAlertMessage,
  getListTransaksi,
  setLoading,
} from '../../../../services';
import {format_tanggal_indo} from '../../../../utils/helpers/date';
import {NumberFormatter, delimiterFormat} from '../../../../utils/helpers/number';
import {ImageProduct} from '../../../../components/atoms/Product';

const ListTransaksi = ({
  navigation,
  handleBuatPenawaran,
  route = '',
  refreshing,
  handleRefresh,
  ListTransaksi,
  firstLoad,
}) => {
  const {theme} = useSelector(reducer => reducer.global);
  const {transactionActive, transactionFinish} = useSelector(
    reducer => reducer.penawaran,
  );

  const [IsLoading, setIsLoading] = useState(false);
  const [ListDataTransaksi, setListDataTransaksi] = useState(
    route.key === 'aktif' ? transactionActive : transactionFinish,
  );
  // console.log('ListDataTransaksi', route.key, ListDataTransaksi);
  // const [Params, setParams] = useState({
  //   page: 1,
  //   limit: 100000,
  //   status: '',
  // });

  // useEffect(() => {
  //   // jika isNewOffer=true tampilkan button Buat Penawaran Baru
  //   let isNewOffer =
  //     transactionActive.length === 0 && transactionFinish.length === 0;

  //   // Pilih data sesuai tab
  //   let selectList =
  //     route.key === 'aktif' ? transactionActive : transactionFinish;
  //   console.log('isNewOffer', isNewOffer);
  //   console.log('selectList', selectList);
  //   setListDataTransaksi(isNewOffer ? null : selectList);
  // }, [route]);

  // useEffect(() => {
  //   const type = route.key === 'selesai' ? 'finish' : 'active';
  //   console.log('ListTransaksi component', route);
  //   if (
  //     (transactionActive.length > 0 && type === 'active') ||
  //     (transactionFinish.length > 0 && type === 'finish')
  //   ) {
  //     let data = type === 'active' ? transactionActive : transactionFinish;
  //     console.log('pengecekan 1');
  //     setListDataTransaksi(data);
  //   }
  //   // else
  //   loadListTransaksi(type);
  // }, []);

  // const loadListTransaksi = type => {
  //   setIsLoading(true);
  //   console.log('pengecekan 2');

  //   // const status = Params.status ? 'status=' + Params.status : '';
  //   const page = Params.page ? '&page=' + Params.page : '';
  //   const limit = Params.limit ? '&limit=' + Params.limit : '';
  //   dispatch(
  //     getListTransaksi(`farmer/offer/list/${type}?${page}${limit}`, type),
  //   )
  //     .then(res => {
  //       console.log('res', res);
  //       if (res?.meta?.http_status === 200) {
  //         setListDataTransaksi(res.data?.offers);
  //       } else _handleAlertMessage(res);
  //       setIsLoading(false);
  //       // setFirstLoad(true);
  //     })
  //     .catch(err => {
  //       _handleAlertMessage(err);
  //       setIsLoading(false);
  //     });
  // };

  return (
    <View
      style={[styles.container, {backgroundColor: 'white', paddingBottom: 10}]}>
      <LoadingAnimated visible={IsLoading} />
      {/* LIST TRANSAKSI */}
      {!firstLoad && (
        <ScrollView
          style={styles.wrapper}
          contentContainerStyle={
            ListDataTransaksi?.length === 0
              ? {alignItems: 'center', flex: 1}
              : {}
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          {ListDataTransaksi?.length > 0 ? (
            <>
              {ListDataTransaksi.map((offer, i) => (
                <TouchableWithoutFeedback
                  key={i}
                  onPress={() => navigation.navigate('DetailTransaksi', offer)}>
                  <View style={styles.card}>
                    {/* card header */}
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={gStyles.text(12, '500', '#797B8A')}>
                          {offer.offer_number}
                        </Text>
                        <Text style={gStyles.text(12, '400', '#797B8A')}>
                          {format_tanggal_indo(new Date(offer.offer_date))}
                        </Text>
                      </View>
                      <BadgeStatus status={offer.status} />
                    </View>

                    {/* card body */}
                    <View onStartShouldSetResponder={() => true}>
                      <ScrollView
                        horizontal={true}
                        style={{
                          display: 'flex',
                          marginVertical: 15,
                        }}
                        showsHorizontalScrollIndicator={false}>
                        {offer.offer_commodities.length > 0
                          ? offer.offer_commodities.map((komoditi, i) => (
                              <TouchableWithoutFeedback
                                onPress={() =>
                                  navigation.navigate('DetailTransaksi', offer)
                                }>
                                <View style={styles.item} key={i}>
                                  <View style={styles.boxIcon}>
                                    {/* <BoxIcon width={35} height={35} /> */}
                                    <ImageProduct
                                      url={komoditi?.commoditie_photos}
                                      style={[
                                        gStyles.dimension('100%', '100%'),
                                        {borderRadius: 40},
                                      ]}
                                    />
                                  </View>
                                  {/* <Image source={BoxIcon} style={styles.image} /> */}
                                  <View>
                                    <View style={{padding: 4}}>
                                      <Text
                                        style={
                                          (gStyles.textMdBold, {color: 'black'})
                                        }>
                                        {komoditi.commoditie_name}
                                      </Text>
                                    </View>
                                    <View
                                      style={[
                                        gStyles.row_center3,
                                        {padding: 4},
                                      ]}>
                                      <Text
                                        style={gStyles.text(
                                          12,
                                          '400',
                                          '#797B8A',
                                        )}>
                                        {/* {komoditi.quantity}  */}
                                        {delimiterFormat(komoditi.quantity)}
                                        {komoditi.unit}
                                      </Text>
                                      {/* <Text
                                        style={[
                                          gStyles.text(12, '400', '#797B8A'),
                                          {marginHorizontal: 3, marginTop: 2},
                                        ]}>
                                        *
                                      </Text> */}
                                      <View
                                        style={[
                                          gStyles.flexCenter('row'),
                                          gStyles.marginHorizontal(6),
                                        ]}>
                                        <IconDot
                                          fill="#93959E"
                                          width={5}
                                          height={5}
                                        />
                                      </View>
                                      <Text
                                        style={gStyles.text(
                                          12,
                                          '400',
                                          '#797B8A',
                                        )}>
                                        Rp.{' '}
                                        {delimiterFormat(
                                          komoditi.total_price_bid_correction !==
                                            komoditi.total_price &&
                                            komoditi.total_price_bid_correction !==
                                              0
                                            ? komoditi.total_price_bid_correction
                                            : komoditi.total_price,
                                        )}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </TouchableWithoutFeedback>
                            ))
                          : null}
                      </ScrollView>
                    </View>
                    {/* card footer */}
                    <View style={styles.cardFooter}>
                      <Text style={gStyles.text(14, '500', '#797B8A')}>
                        Total Penawaran
                      </Text>
                      <Text style={[gStyles.text(14, '500', theme.textColor)]}>
                        Rp {delimiterFormat(offer.total_price_offer)}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </>
          ) : (
            <View
              style={[
                gStyles.col_2,
                {
                  flex: 1,
                  justifyContent: 'center',
                },
              ]}>
              <EmptyTransaction
                handleBuatPenawaran={handleBuatPenawaran}
                title={route?.title}
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ListTransaksi;
