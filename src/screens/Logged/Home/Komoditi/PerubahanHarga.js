import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  AppBar,
  BottomPanelModal,
  CardHargaKomoditi,
  Gap,
  LoadingAnimated,
  RadioButtons,
} from '../../../../components';
import {
  IconHouse,
  IconLeftArrow,
  IconTriangleArrowDown,
} from '../../../../assets';
import {gStyles} from '../../../../utils/styles';
import {getListKomoditi, getListWarehouse} from '../../../../services';
import {useBackHandler} from '@react-native-community/hooks';

// const initialWarehouse = [{id: 0, option: 'Semua Warehouse Hub'}];
const PerubahanHargaKomoditi = ({navigation}) => {
  const dispatch = useDispatch();
  const {theme} = useSelector(reducer => reducer.global);
  const [filterWarehouseShow, setFilterWarehouseShow] = useState(false);
  const [listWarehouse, setListWarehouse] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState();

  const [Loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [ListKomoditi, setListKomoditi] = useState([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(true);

  const pageSize = 5;

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setPage(page + 1);
  };

  useEffect(() => {
    getWarehouseList();
  }, []);

  const getWarehouseList = async () => {
    await dispatch(getListWarehouse()).then(res => {
      console.log('getWarehouseList', res);
      if (res?.data) {
        const remap = res.data.map(dt => ({
          id: dt.warehouse_id,
          option: dt.warehouse_name,
        }));
        // const data = initialWarehouse.concat(remap);
        const data = remap;
        console.log('data warehouse', data);
        setListWarehouse(data);
        setSelectedWarehouse(data[0]);
      }
    });
  };

  useEffect(() => {
    getKomoditiList();
  }, [page, selectedWarehouse]);

  const getKomoditiList = async () => {
    setLoading(true);
    await dispatch(
      getListKomoditi(
        '/farmer/warehouse-commoditie',
        page,
        pageSize,
        selectedWarehouse,
      ),
    ).then(res => {
      // console.log('redux listKomoditi', listKomoditi);
      console.log('update komoditi hari ini', page, res);
      let newData = page === 1 ? res.data : ListKomoditi.concat(res.data);
      setListKomoditi(newData);
      if (res?.meta?.last_page === page) {
        setLastPage(true);
      } else {
        setLastPage(false);
      }
      setLoadMoreLoading(false);
      setFilterWarehouseShow(false);
    });
    setLoading(false);
  };

  const handleRefresh = useCallback(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleRefresh();
    });
    return unsubscribe;
  }, [navigation]);

  const handleSelectWarehouse = val => {
    let find = listWarehouse.find(ware => ware.option === val);
    if (find) {
      setSelectedWarehouse(find);
    }
  };

  // useBackHandler(() => handleBack());
  // const handleBack = () => navigation.goBack();

  return (
    <>
      <View style={[styles.container, {paddingBottom: 40}]}>
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
          title="Perubahan Harga Komoditi"
          borderBottom
          borderBottomColor={theme.textColor}
          titleStyle={[gStyles.marginLeft(28)]}
        />

        <View style={[styles.filterWarehouse]}>
          <Text style={gStyles.text(14, '400', '#797B8A')}>Menampilkan</Text>

          <TouchableOpacity
            onPress={() => setFilterWarehouseShow(true)}
            style={gStyles.flexCenter('row')}>
            <IconHouse
              fill="#2E3192"
              width={20}
              height={20}
              style={gStyles.marginHorizontal(4)}
            />
            <Text style={gStyles.text(14, '500', '#313447')}>
              {selectedWarehouse?.option}
            </Text>
            <IconTriangleArrowDown
              fill="#93959E"
              width={16}
              height={16}
              style={gStyles.marginHorizontal(4)}
            />
          </TouchableOpacity>
        </View>
        <View style={gStyles.bottomBoxShadow(2, '#000')} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: theme.backgroundColor,
            // padding: 16,
            paddingTop: 16,
            paddingHorizontal: 16,
            marginBottom: 50,
            paddingBottom: 16,
            // backgroundColor: 'red'
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          {ListKomoditi.map((komoditi, i) => (
            <CardHargaKomoditi
              warehouseName={komoditi.warehouse_name}
              name={komoditi.commoditie_name}
              data={komoditi}
              // sku="(SKU: 3454357)"
              prices={komoditi.commoditie_prices}
              onPress={() =>
                navigation.navigate('DetailHargaKomoditi', {
                  idKomoditi: komoditi.commoditie_id,
                })
              }
              style={{marginBottom: i === ListKomoditi.length - 1 ? 40 : 12}}
            />
          ))}
          <Gap height={16} />
          {lastPage ? null : (
            <View style={styles.wrapperLoadMore}>
              <TouchableOpacity
                disabled={loadMoreLoading}
                style={[
                  styles.btnLoadMore,
                  {
                    backgroundColor: loadMoreLoading ? '#F5F6F7' : 'white',
                    opacity: loadMoreLoading ? 0.5 : 1,
                  },
                ]}
                onPress={handleLoadMore}>
                {/* {loadMoreLoading ? ( */}
                <Text style={gStyles.text(14, '600', '#1E1E1F')}>
                  Load More
                </Text>
                {/* )} */}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {filterWarehouseShow ? (
        <BottomPanelModal
          height="auto"
          animate
          clickOutsideToClosePanel
          closePanel={() => setFilterWarehouseShow(false)}
          radius={12}
          withHeader
          title={'Pilih Warehouse Hub'}
          showCloseBtn
          titleStyle={gStyles.text(16, '700', '#313447')}
          content={
            <View
              style={[
                gStyles.cardNoBorder,
                {marginBottom: 0, paddingBottom: 20, paddingTop: 0},
              ]}>
              {listWarehouse.map((option, index) => (
                <View key={index} style={[]}>
                  <RadioButtons
                    styleTouchButton={[
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        width: '100%',
                        borderWidth: 1,
                        paddingHorizontal: 5,
                        marginVertical: 5,
                        paddingLeft: 12,
                        borderRadius: 8,
                        borderColor:
                          selectedWarehouse?.option === option.option
                            ? '#2E3192'
                            : '#CBCCD1',
                      },
                    ]}
                    type="row-reverse"
                    option={option}
                    setOption={val => handleSelectWarehouse(val)}
                    selected={selectedWarehouse?.option}
                    radioButtonBorderColor="#BEBFC2"
                    selectedRadioButtonColor="#fff"
                    selectedRadioButtonBorderColor="#2E3192"
                    radioButtonSize={22}
                    icon={<IconHouse fill="#2E3192" width={20} height={20} />}
                    key={option}
                    optionTextStyling={[
                      gStyles.text(14, '400', '#313447'),
                      gStyles.marginLeft(5),
                    ]}
                    paddingTop={10}
                    paddingBottom={10}
                  />
                </View>
              ))}
            </View>
          }
        />
      ) : null}
    </>
  );
};

export default PerubahanHargaKomoditi;

const styles = StyleSheet.create({
  wrapperLoadMore: {marginTop: 12, marginBottom: 14, marginHorizontal: 16},
  filterWarehouse: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  btnLoadMore: {
    minHeight: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BEBFC2',
  },
});
