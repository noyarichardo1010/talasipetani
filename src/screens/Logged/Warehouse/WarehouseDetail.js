import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Container,
  Gap,
  Input,
  LoadingAnimated,
} from '../../../components';
import {gStyles} from '../../../utils/styles';
import {
  IconLeftArrow,
  IconLocation,
  IconMap,
  IconSearch,
} from '../../../assets';
import ListKomoditi from './component/listKomoditi';
import {useDispatch, useSelector} from 'react-redux';
import API from '../../../services/api';

const WarehouseDetail = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {theme} = useSelector(reducer => reducer.global);
  const [WarehouseData, setWarehouseData] = useState(null);
  const [listWarehouseKomoditi, setListWarehouseKomoditi] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [Search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const pageSize = 10;

  // console.log('warehouse active', warehouseTabActive);
  useEffect(() => {
    console.log('route', route?.params?.warehouse);
    if (route?.params?.warehouse) {
      setWarehouseData(route.params.warehouse);
      getWarehouseDetail();
    }
  }, [route, page]);

  const getWarehouseDetail = async () => {
    let idk = route.params.warehouse.warehouse_id;
    setLoading(true);
    await API.get(
      `/farmer/warehouse/detail-data/${idk}?page=${page}&limit=${pageSize}&search=${Search}`,
    )
      .then(res => {
        console.log('getWarehouseDetail', res);
        if (res?.meta?.http_status === 200)
          if (res?.data) {
            let newData =
              page === 1 ? res.data : ListWarehouseKomoditi.concat(res.data);
            setListWarehouseKomoditi(newData);
            if (res?.meta?.last_page === page) setLastPage(true);
            else setLastPage(false);
          }
      })
      .catch(err => console.log('err', err));
    setLoading(false);
    setLoadMoreLoading(false);
  };

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setPage(page + 1);
  };

  const handleRefresh = useCallback(() => {
    setPage(1);
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* Header Appp Bar */}
      <LoadingAnimated visible={Loading} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {WarehouseData && (
          <View
            style={[
              gStyles.shadowTitle,
              gStyles.row_2,
              {
                alignItems: 'flex-start',
                backgroundColor: '#2E3192',
                padding: 16,
              },
            ]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <IconLeftArrow fill={'#9AA2B1'} width={20} height={20} />
            </TouchableOpacity>
            <View style={{marginLeft: 8}}>
              <Text style={gStyles.text(16, '500', '#FFFFFF')}>
                {WarehouseData.warehouse_name}
              </Text>
              <View style={[gStyles.row_center3, {marginVertical: 8}]}>
                <IconLocation width={17} height={17} fill={'#FFFFFF'} />

                <Text
                  style={[gStyles.text(12, '400', '#FFFFFF'), {marginLeft: 5}]}>
                  {`${WarehouseData?.village_name ?? 'Desa'}, ${
                    WarehouseData.district_name ?? 'Kec.'
                  }, ${WarehouseData.city_name}, ${
                    WarehouseData.province_name
                  }`}
                </Text>
              </View>
              <Button
                paddingVertical={5}
                onPress={() =>
                  navigation.navigate('WarehouseMap', {
                    warehouse: WarehouseData,
                  })
                }
                style={{marginTop: 5, width: 200}}
                title={
                  <View style={[gStyles.row_center2]}>
                    <IconMap />
                    <Text
                      style={[
                        {marginLeft: 5},
                        gStyles.text(12, '400', '#2E3192'),
                      ]}>
                      Lihat Lokasi Pada Map
                    </Text>
                  </View>
                }
              />
            </View>
          </View>
        )}
        <ScrollView style={{padding: 16}} contentContainerStyle={{flexGrow: 1}}>
          <View style={gStyles.row_center2}>
            <Input
              style={{width: '100%', height: 40}}
              placeholder={'Cari Komoditi di Warehouse hub'}
              onChangeText={val => setSearch(val)}
              onEndEditing={() => getWarehouseDetail()}
            />
            <TouchableOpacity style={{position: 'absolute', right: 15}}>
              <IconSearch fill={'#CBCCD1'} width={20} height={20} />
            </TouchableOpacity>
          </View>
          <View style={{marginVertical: 20}}>
            {listWarehouseKomoditi.map((komoditi, i) => (
              <ListKomoditi item={komoditi} />
            ))}
            <Gap height={16} />
            {lastPage || listWarehouseKomoditi.length === 0 ? null : (
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
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default WarehouseDetail;

const styles = StyleSheet.create({
  cardKomoditi: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#E3E3E5',
    borderBottomWidth: 1,
    margin: 12,
    marginTop: 0,
    paddingBottom: 15,
  },
  bodyContent: {
    display: 'flex',
    padding: 16,
    flex: 1,
  },
  wrapperLoadMore: {marginTop: 12, marginBottom: 14, marginHorizontal: 16},
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
