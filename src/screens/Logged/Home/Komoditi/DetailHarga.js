import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  AppBar,
  BottomPanel,
  Button,
  CardHargaKomoditi,
  LoadingAnimated,
  PriceInfo,
  RadioButtons,
} from '../../../../components';
import {
  Box,
  IconDownArrow,
  IconHouse,
  IconLeftArrow,
  IconTriangleArrowDown,
  IconUp,
} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import API from '../../../../services/api';
import {format_tanggal_indo} from '../../../../utils/helpers/date';
import {ImageProduct} from '../../../../components/atoms/Product';
// import {useBackHandler} from '@react-native-community/hooks';

const DetailHargaKomoditi = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {theme} = useSelector(reducer => reducer.global);
  const [warehouseShowed, setWarehouseShowed] = useState('');
  const [KomoditiData, setKomoditiData] = useState(null);
  const [listWarehouse, setListWarehouse] = useState([]);
  const [Loading, setLoading] = useState(true);

  // console.log('warehouse active', warehouseTabActive);
  useEffect(() => {
    if (route?.params?.idKomoditi) {
      console.log('route', route?.params?.idKomoditi);
      getKomoditiDetail(route.params.idKomoditi);
    }
  }, [route]);

  const getKomoditiDetail = async id => {
    setLoading(true);
    await API.get(`/farmer/commoditie/detail/${id}`)
      .then(res => {
        console.log('getKomoditiDetail', res);
        if (res?.meta?.http_status === 200)
          if (res?.data) setKomoditiData(res.data);
      })
      .catch(err => console.log('err', err));
    setLoading(false);
  };

  // useBackHandler(() => handleBack());
  // const handleBack = () => navigation.goBack();
  return (
    <>
      <View style={styles.container}>
        <LoadingAnimated
          visible={Loading}
          // handleBack={() => handleBack()}
        />
        <AppBar
          appBarColor={theme.backgroundColor}
          navigation={navigation}
          headerTextColor={theme.textColor}
          hideRightContent
          iconLeft={<IconLeftArrow width={24} height={24} fill={'#797B8A'} />}
          title="Detail"
          borderBottom
          borderBottomColor={theme.textColor}
          titleStyle={[gStyles.marginLeft(28)]}
        />
        {KomoditiData && (
          <>
            <View style={[styles.filterWarehouse]}>
              <View style={gStyles.row_center}>
                <View style={gStyles.boxWrapper}>
                  {/* <Image source={Box} style={gStyles.dimension(32, 32)} /> */}
                  <ImageProduct
                    url={KomoditiData?.commoditie_photos}
                    style={[
                      gStyles.dimension('100%', '100%'),
                      {borderRadius: 40},
                    ]}
                  />
                </View>
                <View
                  style={[
                    gStyles.marginLeft(5),
                    {
                      display: 'flex',
                      flexCenter: 'column',
                      alignItems: 'flex-start',
                      flex: 1,
                    },
                  ]}>
                  <Text style={gStyles.text(16, '500', '#313447')}>
                    {KomoditiData.commoditie_name}
                  </Text>
                  {KomoditiData?.total_variant > 0 ? (
                    <Text style={gStyles.text(12, '400', '#797B8A')}>
                      {KomoditiData.total_variant} varian
                    </Text>
                  ) : null}
                </View>
                <Button
                  type="outline"
                  title="Ganti"
                  color="#2E3192"
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 4,
                  }}
                  onPress={() => navigation.navigate('ListKomoditi')}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#EBF0FF',
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <Text style={gStyles.text(14, '400', '#313447')}>
                Harga Per Tanggal{' '}
                <Text style={gStyles.text(14, '700', '#2E3192')}>
                  {format_tanggal_indo(new Date(KomoditiData.current_date))}
                </Text>
              </Text>
            </View>
            <View style={gStyles.bottomBoxShadow(1, '#000')} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                backgroundColor: '#F5F6F7',
              }}>
              {KomoditiData.warehouse_commodities.map((warehouse, i) => (
                <View key={i}>
                  <TouchableOpacity
                    onPress={() =>
                      setWarehouseShowed(prev =>
                        prev === warehouse.warehouse_name
                          ? ''
                          : warehouse.warehouse_name,
                      )
                    }
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      padding: 16,
                    }}>
                    <IconHouse
                      fill="#2E3192"
                      width={24}
                      height={24}
                      style={gStyles.marginRight(8)}
                    />
                    <Text
                      style={[
                        gStyles.text(16, '500', '#313447'),
                        gStyles.flex(1),
                      ]}>
                      {warehouse.warehouse_name}
                    </Text>
                    {warehouse.warehouse_name === warehouseShowed ? (
                      <IconUp fill="#797B8A" width={15} height={15} />
                    ) : (
                      <IconDownArrow fill="#797B8A" width={20} height={20} />
                    )}
                  </TouchableOpacity>
                  {warehouse.warehouse_name === warehouseShowed
                    ? warehouse?.commodities?.length > 0
                      ? warehouse.commodities.map((data, index) => (
                          <View
                            key={index}
                            style={{
                              backgroundColor: '#fff',
                              paddingHorizontal: 16,
                              paddingBottom: 16,
                            }}>
                            <View
                              style={{
                                backgroundColor: '#F5F6F7',
                                padding: 12,
                                borderRadius: 8,
                              }}>
                              <Text style={gStyles.text(14, '500', '#313447')}>
                                {data.commoditie_name}{' '}
                                <Text
                                  style={gStyles.text(12, '400', '#797B8A')}>
                                  {data.sku}
                                </Text>
                              </Text>
                              <View
                                style={[
                                  gStyles.line('#E3E3E5', 1),
                                  gStyles.marginVertical(12),
                                ]}
                              />
                              {data.detail_prices?.map((price, idx) => (
                                <PriceInfo
                                  key={idx}
                                  length={data.detail_prices.length}
                                  index={idx}
                                  grade={price.grade_name}
                                  sku={price.sku}
                                  price={price.current_price}
                                  perQty={price.unit}
                                  upOrDown={price.label_color}
                                  howMuch={price.difference_price}
                                  // howMuch={price.difference_price}
                                />
                              ))}
                            </View>
                          </View>
                        ))
                      : null
                    : null}
                  <View
                    style={{
                      marginBottom: i === listWarehouse.length - 1 ? 0 : 8,
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </>
  );
};

export default DetailHargaKomoditi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterWarehouse: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  cardNoBorder: {
    display: 'flex',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
});
